## Final Assignments Documentation

### 1: Alcohol Anonymous: Meeting Finder
This project amalgamates weekly assignments [1](https://github.com/lulujordanna/data-structures/tree/master/week01), [2](https://github.com/lulujordanna/data-structures/tree/master/week02), [3](https://github.com/lulujordanna/data-structures/tree/master/week03), [4](https://github.com/lulujordanna/data-structures/tree/master/week04), [6](https://github.com/lulujordanna/data-structures/tree/master/week06), [7](https://github.com/lulujordanna/data-structures/tree/master/week07), [10](https://github.com/lulujordanna/data-structures/tree/master/week10) and [11](https://github.com/lulujordanna/data-structures/tree/master/week11) to repurpose the tabular Alcoholics Anonymous schedule for Manhattan into a new map-based interface. The application was developed as a long term planning tool which enables the user to find the right AA meeting for them, based on defined geographic parameters. All AA meeting locations are initially loaded as map markers with the function to filter the map markers by neighbourhood. To view the final project, [click here](http://52.87.186.251:8080/aa). 

#### The Data
The data of all ten zones of [New York's AA Meeting List](https://parsons.nyc/aa/m10.html) was manually parsed, cleaned and stored in PostgreSQL. The final query structure has two initial sub-queries to connect the three SQL tables. Once the tables are joined on zones and location, the SELECT statement ascribes the lat, long, addressname, address and zonename to be unique parameters and then creates a json_build_object for the meeting information. This is to ensure that duplicate markers would not be created for the same geo-location. The app uses Express and Handlebars to send the data to the webpage. 

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
On initial load, all of the AA meeting locations appear as map markers. The map is set to central Manhattan with the ability to move or zoom for manual search. This can be overwhelming due to the sheer amount of map markers, which is why the filtering was implemented. Once a specific neighbourhood is chosen, the application hides all other markers limiting the meetings to the users specification. Detailed information about a location and meeting schedule are mapped to a pop-up which is accessible after clicking on a individual marker.

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
I am very happy with the final outcome, as it not only reflects my intended design but it highlights my strides in learning JavaScript this semester. However, the final outcome is not as fault-tolerant as intended as I faced some challenges with the map markers. Due to a issue with my geo-coding around 10 of the meeting locations ended up in geographic locations that are not correct (Brooklyn, Staten Island). While I am disappointed with that result, the task of re-geocoding was to vast for the limited time period. Another issue of the application is that a location with multiple meetings, the meetings do not appear in chronological order. This issue had to do with connecting the a meeting schedule to the same geolocation but the task to redo was far to great for the time. 

<hr>

### 2: Learning JS: A Process Blog
This project brings together weekly assignments [5](https://github.com/lulujordanna/data-structures/tree/master/week05), [6](https://github.com/lulujordanna/data-structures/tree/master/week06), [10](https://github.com/lulujordanna/data-structures/tree/master/week10) and [11](https://github.com/lulujordanna/data-structures/tree/master/week11) to produce a blog-style interface cataloging my progression with learning JavaScript in Data Structures this semester. The blog entries are categorized by the three final assignments. To view the final project, [click here](http://52.87.186.251:8080/process).

#### The Data
The data is stored using a semi-structured structure in Dynamodb. The final query structure is filtered by category. The params variable connects to the Dynamodb 'table', the elements of the blog entry (in the Projection Expression) and the filter parameter (Filter Expression). The query uses the scan operation to retrieve the data and the res.end has two handlebars variables, processData (the items in the Projection Expression) and category (the filter Expression). This project is different from the other examples as I am using both app.get and app.post. The app.get is the initial view of the application, which is set to the default category of AA Meetings. Using bodyParser, the app.post is how the webpage changes, after the initial load and based on the category filtering. This is visually represented in the dropdown menu, which is explained below. 

```javascript
var defaultCategory = "AA Meetings"
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/process', function(req,res) {
    processQuery(res,defaultCategory);
});

app.post('/process', function(req,res) {
    processQuery(res,req.body.category);
})

function processQuery(res,category) {
    var dynamodb = new AWS.DynamoDB();
    
    var params = {
                TableName: "processblog",
                ProjectionExpression: "category, #dt, title, entry, #u, photo",
                FilterExpression: "category = :c",
                ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
                 "#u" : "url", 
                 "#dt" : "date"
                    },
                 ExpressionAttributeValues: { // the query values
                    ":c": {S: category}
                }
            };
            
    var query = dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            throw (err);
        }
        else {
            res.end(template3({ processData: JSON.stringify(data.Items), category: JSON.stringify(category)}));
        }
    });
    
    return query;
}
```

#### The Visual Representation
The visual representation is a clean, blog style interface which has a dropdown menu to filter by the three final projects of the Data Structures class; AA Meetings, Process Blog and Temperature Sensor.  

![Image of Process Blog](https://github.com/lulujordanna/data-structures/blob/master/final/images/process1.jpg)
![Image of Process Blog](https://github.com/lulujordanna/data-structures/blob/master/final/images/process2.jpg)

Connecting the endpoints to the visual representation was multi-faceted. In the html portion of the document, I had to declare that the form become a POST form in order to connect this to the app.post portion of the application. Then in the script tag, I re-named the handlebars variables to use the queried data. I then created a table which would hold the entries data. Each table row has a specific part of the entries to create a column effect. To account of the semi-structured architecture not all of the posts have photos. In order to add them to the specified posts, I have created an if statement. Using JQuery, I loaded my entries into the #myEntries div. Finally the document.GetElementById is ensuring that the category selected in the drop down, remains the visible after you have clicked the submit button. 

``` html
   <div class="dropdown">
      <form method="POST" id="project-dropdown">
         <select class="category" id="category" name="category">
           <option name="aa" value="AA Meetings">AA Meetings</option>
           <option name="process" value="Process Blog">Process Blog</option>
           <option name="temperature" value="Temperature Sensor">Temperature Sensor</option>
         </select> 
         <input type="submit" />
      </form>
   </div>
   
   <div id='myEntries'></div>
```

``` JavaScript
      var data = {{{processData}}};
      var category_name = {{{category}}};
      
      var myTable = `<table><tbody>`;
      for (var i=0; i < data.length; i++) {
      	 myTable += '<tr><td class="title-row">' + '<span>' + data[i].title.S + '</span>' + '</td></tr>';
      	 myTable += '<tr><td class="category-row">'+ data[i].category.S + '</td></tr>';
      	 myTable += '<tr><td class="date-row">' + data[i].date.S + '</td></tr>';
      	 myTable += '<tr><td class="entry-row">' + data[i].entry.S + '</td></tr>';
      	 
      	 if (data[i].photo) { 
      	    myTable += '<tr><td><img src='+data[i].photo.S+'><td></tr>'
      	 }; 
   
      	 myTable += '<tr><td class="button-row">' + '<a href="'+data[i].url.S+'" target="_blank"><button>Learn more</button></a>' + '</td></tr>';
      }
      
      myTable += '</tbody></table>'
      
      $(window).on('load', function() {
        $("#myEntries").html(myTable)
      });
      
      document.getElementById("category").value = category_name;
```

#### The Takeaways
While I am very happy with the final outcome, there are some flaws in the sorting of the posts. As I am saving the date of the entry as a dateToString, this returns the timestamp as week day, month, day and year (Ex. Fri Aug 30 2019) and the posts are being sorted in alphabetical order, by day of the week. Unfortunately due to time parameters I was not able to change this data structure and the posts do not appear in chronological order. 

<hr>

### 3: Cool November: A Temperature Visualization
This project combines weekly assignments 8, [9](https://github.com/lulujordanna/data-structures/tree/master/week09), [10](https://github.com/lulujordanna/data-structures/tree/master/week10) and [11](https://github.com/lulujordanna/data-structures/tree/master/week11) to produce a temperature representation from the data I collected using a [Particle 
Sensor](https://www.particle.io/). The visualization records the average hourly temperature of my bedroom over the course of a month and compares the temperature to when the air conditioner is running. I chose to explore this topic as I began to develop a wasteful habit of running my air conditioner to combat with the heat in my apartment unit. To view the final project, [click here](http://52.87.186.251:8080/sensor).

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

Connecting the data to the interface had it's challenges as I was using two time-based data inputs; the temperature (queried from SQL) and my air conditioner times (stored in a JSON file). The handlebars variable from my query is being assigned a new variable name (data). I first started by setting up the foundation for a line graph. Then inside my draw function, I used the data map function to parse the time (d.date) and temperature value (d.value). To build the line graph I used the datum attribute and assigned my x coordinate to represent the date, and the y coordinate to represent the temperature. Once the line graph was created I repeated the process for the air conditioner. I used the data map function again, this time within a d3.json function, outside of the draw function. Once the air conditioner data was mapped correctly, inside the draw function I used the data attribute and appended a rectangle based on the start and end time of using the air conditioner. I then created a tooltip that indicates when the temperature and time.

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
       
       // The indicator circle  
        svg.append("circle")
           .attr("r", 5)
           .attr("class", "hover-circle hover-circle-none")
        
        // Hidden rectangles for the tooltip    
        let hover_rect_width = width/data.length;
        let hover_g = svg.append('g').attr('class','hover-rect-g');
        
        hover_g.selectAll('rect.hover-rect')
            .data(data)
            .enter()
            .append('rect')
                .attr('class','hover-rect')
                .attr('width',hover_rect_width)
                .attr('height',height)
                .attr('x',(d) => x(d.date) - hover_rect_width / 2)
                .attr('y',0)
                .on('mouseover', function (d,i) {
                    
                    var x_hover = d3.scaleTime()
                     .domain(d3.extent(data, function(d) { return d.date; }))
                     .range([ 0, width ]);
                    var y_hover = d3.scaleLinear()
                     .domain([0, d3.max(data, function(d) { return +d.value; })])
                     .range([ height, 0 ]);
                    
                    d3.select('circle.hover-circle')
                        .attr('cx',x_hover(d.date))
                        .attr('cy',y_hover(d.value))
                        .classed("hover-circle-none", false);
                    
                    d3.select('.tooltip').html(
                        '<h2>'+d.tooltip_date+'</h2>' + '<p>' +'The temperature was '+d3.format('.1f')(d.value)+'&#176; celsius</p>'
                    )
                    let mouse_pos = d3.mouse(this);
                    let x = +mouse_pos[0]+50
                    let y = +mouse_pos[1]+50
                    
                    d3.select('.tooltip')
                        .style('transform','translate('+x+'px,'+y+'px)')
                })
                .on('mouseout',function (d,i) {
                    d3.select('.tooltip')
                    .html('')
                    
                    d3.select('circle.hover-circle')
                      .classed("hover-circle-none", true);  
                })
   }
```

#### Takeaways
I am also very happy with this final outcome, as its is very close to my intended design. I feel that my app has accounted for designing a reliable web application as I accounted for the issues of converting time in my query. If I was continuing to collect data and the graph would have to adapt daily, I would need to take this into account for designing a more fault tolerant system that I currently have. 


