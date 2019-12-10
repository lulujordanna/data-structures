## Final Assignments Documentation

### 1: Alcohol Anonymous: Meeting Finder
This project amalgamates weekly assignments [1](https://github.com/lulujordanna/data-structures/tree/master/week01), [2](https://github.com/lulujordanna/data-structures/tree/master/week02), [3](https://github.com/lulujordanna/data-structures/tree/master/week03), [4](https://github.com/lulujordanna/data-structures/tree/master/week04), [6](https://github.com/lulujordanna/data-structures/tree/master/week06), [7](https://github.com/lulujordanna/data-structures/tree/master/week07), [10](https://github.com/lulujordanna/data-structures/tree/master/week10) and [11](https://github.com/lulujordanna/data-structures/tree/master/week11) to repurpose the tabular Alcoholics Anonymous schedule for Manhattan into a new map-based interface. The application was developed as a long term planning tool which enables the user to find the right AA meeting based on defined geographic parameters. All AA meeting locations are initially loaded as map markers with the function to filter the map markers by neighbourhood. 

#### The Data
The data of all ten zones of New York's AA Meeting List was manually parsed, cleaned and stored in PostgreSQL. The final query structure has two initial sub-queries to connect the three SQL tables. Once the tables are joined on zones and location, the SELECT statement ascribes lat, long, addressname, address and zonename to be unique parameters and then builds a json_build_object for the meeting information. This is to ensure that duplicate markers would not be created for the same geo-location. The app uses Express and Handlebars to send the data to the webpage. 

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
On initial load, all of the AA meeting locations appear as map markers. The map is set to central Manhattan with the ability to move or zoom for manual search. This can be overwhelming due to the sheer amount of map markers, which is why the filtering was implemented. Once a specific neighbourhood is chosen, the application hides all other markers limiting the users search. Detailed information about the location and meeting schedule are mapped to a pop-up which is accessible after clicking on a individual marker.

![Image of AA Map](https://github.com/lulujordanna/data-structures/blob/master/final/images/aa1.jpg)
![Image of filtered AA Map](https://github.com/lulujordanna/data-structures/blob/master/final/images/aa2.jpg)
![Image of AA Map with popup](https://github.com/lulujordanna/data-structures/blob/master/final/images/aa3.jpg)

#### Challenges
I am very happy with the final outcome, as it not only reflects my intended design but it highlights my strides in learning JavaScript this semester. However the final outcome is not 100% reliable as I faced some challenges with the map markers. Due to a issue with my geo-coding around 10 of the meeting locations ended up in geographic locations that were not intended (Brooklyn, Staten Island, etc.). While I am disappointed with that result, the task of re-geocoding was to vast for the limited time period. This unfortunately does not make my AA app as reliable as I hoped as I am providing wrongful data.
