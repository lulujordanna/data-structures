## Final Assignments Documentation

### 1: Alcohol Anonymous: Meeting Finder
This project amalgamates weekly assignments [1](https://github.com/lulujordanna/data-structures/tree/master/week01), [2](https://github.com/lulujordanna/data-structures/tree/master/week02), [3](https://github.com/lulujordanna/data-structures/tree/master/week03), [4](https://github.com/lulujordanna/data-structures/tree/master/week04), [6](https://github.com/lulujordanna/data-structures/tree/master/week06), [7](https://github.com/lulujordanna/data-structures/tree/master/week07), [10](https://github.com/lulujordanna/data-structures/tree/master/week10) and [11](https://github.com/lulujordanna/data-structures/tree/master/week11) to repurpose the tabular Alcoholics Anonymous schedule for Manhattan into a new map-based interface. The application was developed as a long term planning tool which enables the user to find the right AA meeting based on defined geographic parameters. All AA meeting locations are initially loaded as map markers with the function to filter the map markers by neighbourhood. 

#### The Data
The data of all ten zones of [New York's AA Meeting List](https://parsons.nyc/aa/m10.html) was manually parsed, cleaned and stored in PostgreSQL. The final query structure has two initial sub-queries to connect the three SQL tables. Once the tables are joined on zones and location, the SELECT statement ascribes lat, long, addressname, address and zonename to be unique parameters and then creates a json_build_object for the meeting information. This is to ensure that duplicate markers would not be created for the same geo-location. The app uses Express and Handlebars to send the data to the webpage. 

```javascript
const indexSource = fs.readFileSync("aa.html").toString();
var template = handlebars.compile(indexSource, { strict: true });

app.get('/aa', function(req, res) {
    
    const client = new Pool(db_credentials);
                       client.connect();

//SQL Query for AA Meetings
    var firstQuery = `WITH locationWithZone AS (
                      SELECT *, SPLIT_PART(l.locationid,'_',1) as zoneID
                      FROM locationGeo l),
                
                      allAAData AS (
                      SELECT l.*, z.*, s.*
                      FROM locationWithZone l
                      INNER JOIN zoneNames z on l.zoneID  = z.zoneID
                      INNER JOIN schedule s on l.locationid  = s.locationid)
            
                      SELECT lat, long, addressname, address, zonename, json_agg(json_build_object('Start Time',  
                      meetingstarttime, 'End Time', meetingendtime, 'Day', meetingday, 'Types', meetingtype, 
                      'Special Interest', meetingspecialinterest)) as meetings 
                      FROM allAAData 
                      GROUP BY lat, long, addressname, address, zonename;`;

client.query(firstQuery, (qerr, qres) => {
    if (qerr) {throw qerr}
    else {
        res.end(template({aaData: JSON.stringify(qres.rows)}));
        client.end();
    }
  });
});
```

#### The Visual Representation
On initial load, all of the AA meeting locations appear as map markers. The map is set to central Manhattan with the ability to move or zoom for manual search. This can be overwhelming due to the sheer amount of map markers, which is why the filtering was implemented. Once a specific neighbourhood is chosen, the application hides all other markers limiting the users search. Detailed information about a location and meeting schedule are mapped to a pop-up which is accessible after clicking on a individual marker.

![Image of AA Map](https://github.com/lulujordanna/data-structures/blob/master/final/images/aa1.jpg)
![Image of filtered AA Map](https://github.com/lulujordanna/data-structures/blob/master/final/images/aa2.jpg)
![Image of AA Map with popup](https://github.com/lulujordanna/data-structures/blob/master/final/images/aa3.jpg)

Connecting the endpoints to this interface I am using handlebars as a templating system. The handlebars variable aaData from res.end is being assigned a new variable name (originalData) in the script tag as a way to render and work with the queried data. I am using Leaflet.js to load the map and have assigned it a setView of Manhattan based on the latitude and longitude. The function makeMarkers uses template literals inside two for() loops to extract the data about the location and meetings schedule. This data is then bound to the marker popup. Instead of using the addTo(mymap) inside the markers function, I am adding it to the markers variable, which is a leaflet layer group. This is in order to reset the map markers once a button is clicked.  When the panToZone function is called (on button click), the map moves to the specified coordinates (coords variable) and the data is filtered by zone name. 

```javascript
        var originaldata = {{{aaData}}};
        var data = originaldata;
        
        var L; 
        var mymap = L.map('mapid',{scrollWheelZoom: false }).setView([40.766438, -73.977748], 14);
                
                L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
            	attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
            	minZoom: 12,
            	maxZoom: 16, 
            	fitBounds: ([[40.712, -74.227],[40.774, -74.125]]),
            	scrollWheelZoom: false, 
            	accessToken:'pk.eyJ1IjoibHVsdWpvcmRhbm5hIiwiYSI6ImNrMzdsZ3U4bzAwMHUzcXBnNHB1dWlyNmwifQ.aFToIlZE5xfbmHl2qJ1tHA'
            }).addTo(mymap);
            
            var markers = L.layerGroup().addTo(mymap); 
            makeMarkers(); 
    
        function makeMarkers(){
            markers.clearLayers(); 
            
             for (var i=0; i<data.length; i++) {
                  var meetings = `<h2>${data[i].address}</h2> 
                                  <h4>${data[i].addressname}</h4>
                                  <h4>${data[i].zonename}</h4>`
                                 
                  for (var x=0; x<data[i]['meetings'].length; x++){
                     meetings += `<br>Day: ${data[i].meetings[x]['Day']}
                                  <br>Time: ${data[i].meetings[x]['Start Time']} - ${data[i].meetings[x]['End Time']}
                                  <br>Meeting Type: ${data[i].meetings[x]['Types']}<br>`
                                  
                                  if(data[i].meetings[x]['Special Interest'] != null){
                                    meetings += `Special Interest: ${data[i].meetings[x]['Special Interest']}<br>`
                                  }
                 };
                 
                L.marker([data[i].lat, data[i].long]).bindPopup(meetings, {maxHeight: 300}).addTo(markers);
            }
        }

        function panToZone(coords, name) {
            data = originaldata.filter(d => d.zonename == name)
            makeMarkers()
            mymap.panTo(coords, {animate: true, duration: 0.5}); 
        }
```

#### Takeaways
I am very happy with the final outcome, as it not only reflects my intended design but it highlights my strides in learning JavaScript this semester. However the final outcome is not as fault-tolerant as intended, as I faced some challenges with the map markers. Due to a issue with my geo-coding around 10 of the meeting locations ended up in geographic locations that are not correct (Brooklyn, Staten Island). While I am disappointed with that result, the task of re-geocoding was to vast for the limited time period.

<hr>

### 2: Learning JS: A Process Blog
This project brings together weekly assignments [5](https://github.com/lulujordanna/data-structures/tree/master/week05), [6](https://github.com/lulujordanna/data-structures/tree/master/week06), [10](https://github.com/lulujordanna/data-structures/tree/master/week10) and [11](https://github.com/lulujordanna/data-structures/tree/master/week11) to produce a blog-style interface cataloging my progression with learning JavaScript in Data Structures this semester. The blog entries are categorized by the three final assignments and the data is stored using a semi-structured structure in DyanamoDB.

<hr>

### 3: Cool November: A Temperature Visualization
This project combines weekly assignments 8, [9](https://github.com/lulujordanna/data-structures/tree/master/week09), [10](https://github.com/lulujordanna/data-structures/tree/master/week10) and [11](https://github.com/lulujordanna/data-structures/tree/master/week11) to produce a temperature representation from the data I collected using a [Particle 
Sensor](https://www.particle.io/). The visualization records the average hourly temperature of my bedroom over the course of a month and compares the temperature to when the air conditioner is running. I chose to explore this topic as I began to develop a wasteful habit of running my air conditioner to combat with the heat in my apartment unit. 

#### The Data
The data collected from the Particle Sensor was written to a PostgreSQL database. To query this data, I first wrote a sub-query which converts the time from GMT to EST. Then in my select clause, I extracted the year, month, day and hour from the timestamp in the adjSensorTime variable. The query then averages the temperature value and then groups the data by this new information. Similarly to the previous projects, I used Express and Handlebars to send the data to the webpage.

```javascript
app.get('/sensor', function(req, res) {

const client = new Pool(db_credentials);

//SQL Query for Sensor Data
var secondQuery = `WITH newSensorData as (SELECT sensorTime - INTERVAL '5 hours' as adjSensorTime, * FROM sensorData)
                  
                  SELECT
                        EXTRACT (YEAR FROM adjSensorTime) as sensorYear,
                        EXTRACT (MONTH FROM adjSensorTime) as sensorMonth, 
                        EXTRACT (DAY FROM adjSensorTime) as sensorDay,
                        EXTRACT (HOUR FROM adjSensorTime) as sensorHour, 
                        AVG(sensorValue::int) as temp_value
                        FROM newSensorData
                        GROUP BY sensorYear, sensorMonth, sensorDay, sensorHour
                        ORDER BY sensorYear, sensorMonth, sensorDay, sensorHour;`;
 
    client.connect();
    client.query(secondQuery, (qerr, qres) => {
        if (qerr) {throw qerr}
        else {
            res.end(template2({sensorData: JSON.stringify(qres.rows)}));
            client.end();
        }
  });
});
```

#### The Visual Representation 
The app centers around a d3 generated line graph. The line graph is the temperature and the overlaid rectangles represent the times when my air conditioner was running. This visual aesthetic was chosen as a way to quickly compare when it was on/off. While the the visualization highlights changes in the temperature data; the nuances in this air conditioner data demonstrate interesting stories. From the average amount I used it, to the times of day, it highlights my behaviours and the wasteful pattern I have become accustomed to. These findings were communicated in three infographics below the graph. 

![Image of Temperature Sensor](https://github.com/lulujordanna/data-structures/blob/master/final/images/sensor1.jpg)
![Image of Temperature Sensor](https://github.com/lulujordanna/data-structures/blob/master/final/images/sensor2.jpg)

Connecting the data to the interface had it's challenges as I was using two time-based data inputs; the temperature (queried from SQL) and my air conditioner times (stored in a JSON file). The handlebars variable from my query is being assigned a new variable name (data). I first started by setting up the foundation for a line graph. Then inside my draw function, I used the data map function to parse the time (d.date) and temperature value (d.value). To build the line graph I used the datum attribute and assigned my x coordinate to represent the date, and the y coordinate to represent the temperature. Once the line graph was created I repeated the process for the air conditioner. I used the data map function again, this time within a d3.json function outside of the draw function. Once the air conditioner data was mapped correctly, inside the draw function I used the data attribute and appended a rectangle based on the start and end time of using the air conditioner. 

```javascript
   var data ={{{sensorData}}}
   
   // set the dimensions and margins of the graph
   var margin = {top: 10, right: 30, bottom: 30, left: 20},
       width = 1350 - margin.left - margin.right,
       height = 400 - margin.top - margin.bottom;
       tooltip = { width: 100, height: 100, x: 10, y: -30 };
   
   // append the svg object to the body of the page
   var svg = d3.select("#sensorGraph")
     .append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
     .append("g")
       .attr("transform",
             "translate(" + margin.left + "," + margin.top + ")");
            
   var dataAC; 
   d3.json("./sensor.JSON", function(dataAc) {
        dataAC = dataAc.map(function(d){
          return { datestart : d3.timeParse("%Y-%m-%dT%H:%M:%S")(d.day + 'T' + d.start), dateend : d3.timeParse("%Y-%m-%dT%H:%M:%S")(d.day + 'T' + d.end), value : d.entry }
        })
       draw(); 
   });
       
   
   function draw(){
   
      //Mapping data from SQL query to d3
       data = data.map(function(d){
          return { date : d3.timeParse("%Y-%m-%dT%H")(d.sensoryear + '-' + d.sensormonth + '-' + d.sensorday + 'T' + d.sensorhour), value : d.temp_value }
        })
       // X axis
       var x = d3.scaleTime()
         .domain(d3.extent(data, function(d) { return d.date; }))
         .range([ 0, width ]);
       svg.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x));
   
       // Y axis
       var y = d3.scaleLinear()
         .domain([0, d3.max(data, function(d) { return +d.value; })])
         .range([ height, 0 ]);
       svg.append("g")
         .call(d3.axisLeft(y));
         
       // AC usage
       svg.selectAll('.ac')
          .data(dataAC)
          .enter()
          .append("rect")
          .attr("x", (d) => x(d.datestart))
          .attr("y", 0)
          .attr("width", (d) => x(d.dateend)- x(d.datestart))
          .attr("height", height)
          .attr('fill','#6daaa5')
          .attr('opacity', 0.15);
          
          
      // The line graph
       svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#6daaa5")
          .attr("stroke-width", 2)
          .attr("d", d3.line()
           .x(function(d) { return x(d.date) })
           .y(function(d) { return y(d.value) })
           )
           
       //The benchmark line
       svg.append("line")    
          .attr("x1", 0)
          .attr("y1", 94.5)
          .attr("x2", width)
          .attr("y2", 94.5)
          .attr("stroke", "#6daaa5")
          .attr("stroke-width", 1) 
          .attr("stroke-dasharray", ("3, 3"));
   }
```

#### Takeaways
I am also very happy with this final outcome, as its is very close to my intended design. I feel that my app has accounted for designing a reliable web application as I accounted for the issues of converting time in my query. If I was continuing to collect data and the graph would have to adapt daily, I would need to take this into account for designing a more fault tolerant system that I currently have. 


