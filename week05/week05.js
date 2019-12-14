// //Dependencies
var async = require('async');
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

//Blog entries creation
var blogEntries = [];

class BlogEntry {
  constructor(category, date, title, entry, url, photo) {
    this.category = {};
    this.category.S = category; 
    
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    
    this.title = {};
    this.title.S = title;
    
    this.entry = {};
    this.entry.S = entry;
    
    this.url = {};
    this.url.S = url;
    
     if (photo != null) {
      this.photo = {};
      this.photo.S = photo;
    }
    
    this.month = {};
    this.month.N = new Date(date).getMonth().toString();
    
  }
}

blogEntries.push(new BlogEntry('AA Meetings', 'August 30, 2019', 'An Introduction to Node JS', 'The goal of the Week 01 Assignment was to use Node.js to make a request for each of the ten "Meeting List Agenda" pages for Alcoholics Anonymous in Manhattan. The final outcome will programmatically convert the HTML pages to text files. Using the starter code as my base, I needed to create two arrays to hold the information for the URLs and text file paths. However, the for() loop was executing faster than the methods inside the loop. By changing the var to a let statement, this created a fresh binding to our iterator versus var which does a single binding for the whole loop. The outcome was successful, however moving forward I would like to learn how to generate the URLs and file names dynamically.', 'https://github.com/lulujordanna/data-structures/tree/master/week01'));
blogEntries.push(new BlogEntry('AA Meetings', 'September 9, 2019', 'Parsing and Scraping a Text File', 'Building off of the week 01 assignment, the goal of this project was to use Node.js to read a single text file and create a new file with addresses of the Alcohol Anonymous meetings. I used Zone 10 from the AA map which is file m10. Using npm cheerio, I began to search for the parameters of the table that I needed. Unfortunately, due to the inconsistencies in the HTML formatting I could not just extract the paragraphs themselves. I started by removing the extra divs, spans, and bolded text elements that were not related to the address. I then created a variable called address to get closer to the correct text itself and to strip out any white space. The split() command created an array of these addresses. Using a variable called location, which I had created at the beginning of the assignment, I created a string using the second position in the array (address number and street name) and added "Manhattan NY" to complete the address. Using appendFileSync the information is added to the text file without overwriting the previous information. After further explanation of solutions in class, I have adapted my code to use cheerio to search for the specific styling and parses the elements into an object. It also saves the file as a JSON which is more applicable then a text file for future use.', 'https://github.com/lulujordanna/data-structures/tree/master/week02'));
blogEntries.push(new BlogEntry('AA Meetings', 'September 16, 2019', 'An Introduction to Geocoding', 'Using the parsed data from last week, the goal of this assignment was to use the Texas A&M Geoservices Geocoding API to make a request for the geo-locations of all the meetings in the zone. The first step was loading in the content from Week02 to use the object values for the constructed API request. Within the asyncEachSeries, I created three variables to make it faster to reference the values within the JSON. After the URL has been constructed, I created variables to inside the else statement to hold the latitude and longitude information. I then created a variable called fullAddress to store the information for the street address, city, state, latitude and longitude. Using meetingsData.push(fullAddress), this information was pushed to the array. I then wrote a new JSON file with the updated parameters. Moving forward my goal would be to strip out any inconsistencies within the street address and remove any duplicate locations within the JSON file.', 'https://github.com/lulujordanna/data-structures/tree/master/week03'));
blogEntries.push(new BlogEntry('AA Meetings', 'September 23, 2019', 'An Introduction to SQL', 'Taking the data that I have parsed from the AA zone, the goal of this week’s assignment is to create a relational database. There are four steps to achieving this goal; planning, creating a table, populating the table and checking the result. When initially planning my database, I thought of the hierarchy of the data itself. While this is beneficial to understanding the structure of content, the structure for a relational database is better suited in multiple tables. Using Illustrator, I mapped out the three tables I will need for the AA data structure; locationGeo, schedule and meetings. Each table has the value name and parameter it needs. Using IDs for the location and meetings, this feeds into the schedule table without having duplicate information. After setting up my database in AWS, I connected the database credentials to my JS file. Using the process.env command I kept my user credentials, host URL and password in my environment variable to ensure these do not end up on GitHub. Once that was completed, I created my locationGeo table in the database. Before I could populate the table, I wanted to ensure that duplicate addresses were removed from the JSON that I was working with. In order to do this, I created two new arrays; addressesForDb and addressesCheck. The addressesForDb will be the final array I use to populate my table, while the check array checks the latitude and longitude for duplicates. Inside the for() loop, I created a variable to first combine the latitude and longitude. Then the if statement checks the latLonCombined is false. The data I wanted was then pushed to the addressesForDb array and the final number of locations for this zone is 13. I then was able to populate the table with the information from the JSON file. However not all of my variables were included in the JSON file at the moment (locationID and addressName) so I used "dummy data" for now which is evident in the INSERT INTO statement of the code. Using the starter code, I was able to check to see that the database had populated correctly. As I do not have the data for the locationId and Address name the result returned a 0 and undefined. While this was successful for adding a single table, I struggled with adding multiple tables. My next step would be to adjust the code to add the additional tables and parse the new data for the locationGeo table and the future tables.', 'https://github.com/lulujordanna/data-structures/tree/master/week04', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week04/files/aaSchema.png'));
blogEntries.push(new BlogEntry('Process Blog', 'October 1, 2019', 'An Introduction to NoSQL', 'The goal of this week’s assignment is to begin planning out how to build a NoSQL database and populating that database for our final assignment 2, The Process Blog. I plan on using my documentation from GitHub to showcase my development with JavaScript and my working process of the three final assignments. While the core functionality of each post won’t change (category, date, title, entry), I want there to be flexibility to include other multi-media and link out to webpages. I am using a semi-structured key-value and document database (DynamoDB). For each entry, I am thinking of the following hierarchical structure (see image below) and that the data coming out of the database will look fairly similar. After creating this plan, I modified the BlogEntry object to fit these parameters. I then populated the object and used the .push() method for the data to be stored in the blogEnteries array. Once the array was populated, I wrapped the starter code in a async.EachSeries to loop through the entries and push them to the database. After reflecting on this work, I felt that my NoSQL database was a good start, but there was an issue with inputting images. I originally put a "none" string in that portion of the object as I had no photos to upload yet. After class I was able to switch my code to reflect if a field does not have an item to upload.', 'https://github.com/lulujordanna/data-structures/tree/master/week05', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week05/files/dataStructureProcess.png'));

blogEntries.push(new BlogEntry('AA Meetings', 'October 14, 2019', 'SQL Query', 'The goal of the query is to filter meetings based on parameters for the planned map. I queried the address, latitude and longitude as this was the current information, I have populated in the PostgreSQL database.', 'https://github.com/lulujordanna/data-structures/tree/master/week06', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week06/files/SQLQuery.png'));
blogEntries.push(new BlogEntry('AA Meetings', 'October 15, 2019', 'SQL Query', 'I found this assignment challenging as I did not have much data to work with. I am currently working on parsing out more information from the HTML pages to be able to create further, more complex queries based on meeting times, day, etc. Below is an image of the final outcome.', 'https://github.com/lulujordanna/data-structures/tree/master/week06', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week06/files/SQLQuery.png'));

blogEntries.push(new BlogEntry('Process Blog', 'October 15, 2019', 'NoSQL Query', 'By modifying the starter code I was able to create a successful query from my DynamoDB database. In order to ensure that both the partition key and sort key were expressed in the query, I made the ExpressionAttributeNames align with the two values; category and date. In the final query I requested the Process Blog data between August 30th and December 11th. While there is only one Process Blog entry to be returned (see image below). I did test this out with the AA Meetings entries and changed the date parameters to ensure that different queries were successful.', 'https://github.com/lulujordanna/data-structures/tree/master/week06', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week06/files/NoSQLQuery.png'));

blogEntries.push(new BlogEntry('AA Meetings', 'October 26, 2019', 'Restructuring the AA Data', 'The goal of this assignment was to finishing parsing the rest of the data from the assigned zone and update/replace your PostgreSQL table(s) with the new data. Once this was completed, I had to repeat the process for the remaining 9 zones. The completed data should include all the data I want to include for the map in Final Assignment 1. Since, Week 04 the data structure has changed. Based on the information I want and was able to parse, I am moving forward with a two table SQL database. The first table, locationGeo is similar to the structure from before, with a slight changed to the datatype for locationID. While the second table, schedule has changed a lot based on the data parsed and what datatypes they were available. The following image highlights this new structure.', 'https://github.com/lulujordanna/data-structures/tree/master/week07', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week07/images/DS_AA.png'));
blogEntries.push(new BlogEntry('AA Meetings', 'October 27, 2019', 'Parsing the Location Data', 'Building upon the structure that we have worked with in the previous weeks, I wanted to add the address name to database. In order to do this I had to add an additional field to parse the addressName key. Once that data was scrapped I created a JSON file (locationGeo10.JSON). I then created a new JS file to tackle the Geo-coding with the JSON file that I parsed. Once the script was complete and the latitude and longitude were parsed from the TAMU API request, I saved this as a new JSON file to show my progression (locationGeo10_Update.JSON). Using the logic and data structure from week04, I began by removing duplicate locations. I then added an additional parameter by using a for() loop to assign a locationID to each address. This was a way to ensure that duplicate addresses were only inputting once in the database and ultimately to connect my locationGeo table to the Schedule table. I then queried the database to ensure that the addresses were correctly inserted. I repeated this process for all remaining zones to complete my locationGeo table. Below is an image of the final query.', 'https://github.com/lulujordanna/data-structures/tree/master/week07', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week07/images/locationsQuery.png'));
blogEntries.push(new BlogEntry('AA Meetings', 'October 28, 2019', 'Parsing the Schedule Data', 'Once the locationGeo table was complete I began to parse my data for the schedule table. I needed to figure out a way to connect the unique location IDs with the individual rows of the html page. By bringing in the AWS instance to the JS file, I was able to connect to my database. Using cheerio I parsed through the html to find the street address string in order to compare with the database and then moved onto the meeting details (day, time, meeting type). Var meetingDetails was a variable which I used to clean up the data inside this row. I then created an object This Meeting, to connect the address variable to the unique locationIDs in the database. I then made another object called thisMeetingDetails to clean up the data for the day, time, meeting type and special interest. Both objects were pushed into the meetingData array which was used my fs.writeFileSync command for the JSON file. The structure of this data created a nesting object within the JSON file. I then had to input this into the schedule table of the database.  Initially I had issues inputting my data into the schedule table, however using a nested async function, I helped to ensure that the nesting JSON structure be able to be inserted into the database. I also added an if statement to account for the Special Interest value. As not all meetings have special interest, this accounts for it and inserts a NULL in the database if it was undefined. ', 'https://github.com/lulujordanna/data-structures/tree/master/week07', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week07/images/scheduleQuery.png'));

blogEntries.push(new BlogEntry('Temperature Sensor', 'November 4, 2019', 'Introduction to IOT', 'For this weekly assignment, we were introduced to IOT and began working on our temperature sensor assignment. For this assignment I have decided to place my sensor by the Air Conditioner of my bedroom to test the changes in temperature and additionally track when I turn it on/off. The image below shows where I have placed it in my bedroom.  ', 'https://github.com/lulujordanna/data-structures/tree/master/week09'));
blogEntries.push(new BlogEntry('Temperature Sensor', 'November 7, 2019', 'Writing Sensor data to DB', 'The goal of this weekly assignment was to create a new table for my sensor data and begin writing values to it at a frequency of every five minutes. For my project, I chose a SQL database. Below is an image for the first temperature value it stored.', 'https://github.com/lulujordanna/data-structures/tree/master/week09', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week09/images/CollectingData.png'));

blogEntries.push(new BlogEntry('AA Meetings', 'November 11, 2019', 'Creating Endpoints - AA', 'The goal of this weekly assignment is to create a web server application in Node.js that will respond to various requests for JSON data for AA meetings, process blog entries, and sensor readings. Building off of previous weekly assignments, I created a web server application that uses Express to load in data from each of the three databases. The outcome does not include html elements or styling yet, it just a representation of the queries to the database. I first loaded in all my dependencies; making the database credentials global variables to account for scoping as my SQL database is used for both the AA data and Sensor data. Once all of the dependencies were loaded in, I created the first express function to build my landing page. To query the database for the AA Meetings, I currently have a query that Ryan and I wrote which connects a locationID to a zoneID. Joining these two tables together is crucial in the data mapping of my final project. Once the query is successful, the data is pushed to an array called aaOutput which is the data type sent to the webpage using the express app.get function.', 'https://github.com/lulujordanna/data-structures/tree/master/week10'));
blogEntries.push(new BlogEntry('Process Blog', 'November 11, 2019', 'Creating Endpoints – Process Blog', 'As the NoSQL database is a different query structure, I currently used the query from Week 06 to display the meetings with the AA Meetings Category. While I am proud of my progression with JavaScript this week, each of the endpoints highlight that greater aggregation in my data is needed. Each has a significant learning curve which I am concerned about in the limited time frame left in the course.', 'https://github.com/lulujordanna/data-structures/tree/master/week10'));
blogEntries.push(new BlogEntry('Temperature Sensor', 'November 11, 2019', 'Creating Endpoints - Temperature Sensor', 'As the Sensor data also uses a SQL database the process and JavaScript were similar to the AA Meetings. I currently have a query which prints everything from the sensorData table. Ultimately the temperature needs to be aggregated by hour of each day but querying the data this way felt the most applicable then grouping by value or count.', 'https://github.com/lulujordanna/data-structures/tree/master/week10'));

blogEntries.push(new BlogEntry('AA Meetings', 'November 18, 2019', 'Interface Design – AA', 'For Assignment 1, I want to create a clean, user friendly visualization to make the information highly accessible. My goal of this project is to create a long-term planning tool which users can use to find the right AA Meeting for them, based on defined geographic neighbourhoods. As I am building this project, I am assuming that future users live in Manhattan and are comfortable with defining their geographic location in proximity to an AA Meeting. The following images highlight the visual design of the interactive map. Users will land on the default view (Image 1) and have to choose their neighbourhood to receive information. Once the neighbourhood is chosen, the map will reposition, and meetings will appear (Image 2). When the user clicks on the map pointers, details about the meetings at that location will appear (Image 3). The data will be mapped to the visual elements in multiple ways. The firstly the buttons will each be assigned a zoneID based from the zoneName table. This established which neighbourhood/zone the map with re-position to. Once a button is triggered this shapes the map to include the markers for the meetings. Each marker is based on the latitude and longitude from the geoLocation table. Each location has a locationID to connect the marker to the schedule information, which is viewed when clicked upon. The data structure is in a much stronger place then when I started, but I still need to work on an optimal query for this two-step process (button to trigger the map/markers).', 'https://github.com/lulujordanna/data-structures/tree/master/week11', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week11/images/aa-1.png'));
blogEntries.push(new BlogEntry('Process Blog', 'November 18, 2019', 'Interface Design – Process Blog', 'For Assignment 2, I want to create a simplistic blog which is driven by the content of each post. It will track my progression in learning javaScript through the reflections in Data Structures. Each reflection has a category (a project) which is the primary key for the structure of the blog and a sort key; the date. The default view will be in order of posts based on the category but users will be able to filter based on the date and/or category. The following image is a sketch of the design with two different types of posts (one with an image and one without). As the project is highly text based, the data will be transformed into html elements in the order in which I inputed them into the database. I need to learn how to be able to filter the data in the final outcome. Based on my design I am making the assumptions that users will scroll through the page to navigate, click on the buttons to learn more via my GitHub page and understand that the top menu is a source of filtering.', 'https://github.com/lulujordanna/data-structures/tree/master/week11', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week11/images/processblog.png'));
blogEntries.push(new BlogEntry('Temperature Sensor', 'November 18, 2019', 'Interface Design – Temperature Sensor', 'For the final assignment, I want to create a interactive visualization that records the temperature of my bedroom, accounting for the times when I have my Air Conditioner (AC) on. The following images highlight the visual design for the project. The first image is the default view, while the second image is what occurs when you hover over a selected period. If the AC was on during that time, a highlighted box and tooltip will appear. Ultimately, if time permits, I would like to have a feature where you could click to see all the times the AC was on (image 3). The temperature data will be mapped to the visual element of the line graph. This will need to be aggregated by hour of each day. The data regarding my AC usage will be taken from a JSON file which has been tracking every time I turn on and off my AC during the day. For this project, I am making the assumption that users will hover over my graph in order to gain further knowledge about my AC behaviours.', 'https://github.com/lulujordanna/data-structures/tree/master/week11', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/week11/images/sensor-1.png'));

blogEntries.push(new BlogEntry('AA Meetings', 'December 9, 2019', 'Alcohol Anonymous Meeting Finder: The Output', 'This project amalgamates weekly assignments 1, 2, 3, 4, 6, 7, 10 and 11 to repurpose the tabular Alcoholics Anonymous schedule for Manhattan into a new map-based interface. The application was developed as a long-term planning tool which enables the user to find the right AA meeting based on defined geographic parameters. All AA meeting locations are initially loaded as map markers with the function to filter the map markers by neighbourhood.', 'https://github.com/lulujordanna/data-structures/tree/master/final'));
blogEntries.push(new BlogEntry('AA Meetings', 'December 10, 2019', 'Alcohol Anonymous Meeting Finder: The Data', 'The data of all ten zones of New Yorks AA Meeting List was manually parsed, cleaned and stored in PostgreSQL. The final query structure has two initial sub-queries to connect the three SQL tables. Once the tables are joined on zones and location, the SELECT statement ascribes lat, long, addressname, address and zonename to be unique parameters and then creates a json_build_object for the meeting information. This is to ensure that duplicate markers would not be created for the same geo-location. The app uses Express and Handlebars to send the data to the webpage.', 'https://github.com/lulujordanna/data-structures/tree/master/final'));
blogEntries.push(new BlogEntry('AA Meetings', 'December 11, 2019', 'Alcohol Anonymous Meeting Finder: The Visual Representation', 'On initial load, all of the AA meeting locations appear as map markers. The map is set to central Manhattan with the ability to move or zoom for manual search. This can be overwhelming due to the sheer amount of map markers, which is why the filtering was implemented. Once a specific neighbourhood is chosen, the application hides all other markers limiting the users search. Detailed information about a location and meeting schedule are mapped to a pop-up which is accessible after clicking on a individual marker.', 'https://github.com/lulujordanna/data-structures/tree/master/final', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/final/images/aa1.jpg'));
blogEntries.push(new BlogEntry('AA Meetings', 'December 12, 2019', 'Alcohol Anonymous Meeting Finder: Connecting to Endpoints', 'Connecting the endpoints to this interface I am using handlebars as a templating system. The handlebars variable aaData from res.end is being assigned a new variable name (originalData) in the script tag as a way to render and work with the queried data. I am using Leaflet.js to load the map and have assigned it a setView of Manhattan based on the latitude and longitude. The function makeMarkers uses template literals inside two for() loops to extract the data about the location and meetings schedule. This data is then bound to the marker popup. Instead of using the addTo(mymap) inside the markers function, I am adding it to the markers variable, which is a leaflet layer group. This is in order to reset the map markers once a button is clicked. When the panToZone function is called (on button click), the map moves to the specified coordinates (coords variable) and the data is filtered by zone name.', 'https://github.com/lulujordanna/data-structures/tree/master/final'));
blogEntries.push(new BlogEntry('AA Meetings', 'December 13, 2019', 'Alcohol Anonymous Meeting Finder: The Takeaways', 'I am very happy with the final outcome, as it not only reflects my intended design but it highlights my strides in learning JavaScript this semester. However the final outcome is not as fault-tolerant as intended, as I faced some challenges with the map markers. Due to a issue with my geo-coding around 10 of the meeting locations ended up in geographic locations that are not correct (Brooklyn, Staten Island). While I am disappointed with that result, the task of re-geocoding was to vast for the limited time period.', 'https://github.com/lulujordanna/data-structures/tree/master/final'));

blogEntries.push(new BlogEntry('Temperature Sensor', 'December 9, 2019', 'Cool November: The Output', 'This project combines weekly assignments 8, 9, 10 and 11 to produce a temperature representation from the data I collected using a Particle Sensor. The visualization records the average hourly temperature of my bedroom over the course of a month and compares the temperature to when the air conditioner is running. I chose to explore this topic as I began to develop a wasteful habit of running my air conditioner to combat with the heat in my apartment unit.', 'https://github.com/lulujordanna/data-structures/tree/master/final'));
blogEntries.push(new BlogEntry('Temperature Sensor', 'December 10, 2019', 'Cool November: The Data', 'The data collected from the Particle Sensor was written to a PostgreSQL database. To query this data, I first wrote a sub-query which converts the time from GMT to EST. Then in my select clause, I extracted the year, month, day and hour from the timestamp in the adjSensorTime variable. The query then averages the temperature value and then groups the data by this new information. Similarly, to the previous projects I used Express and Handlebars to send the data to the webpage.', 'https://github.com/lulujordanna/data-structures/tree/master/final'));
blogEntries.push(new BlogEntry('Temperature Sensor', 'December 11, 2019', 'Cool November: The Visual Representation', 'The app centers around a d3 generated line graph. The line graph is the temperature and the overlaid rectangles represent the times when my air conditioner was running. This visual aesthetic was chosen as a way to quickly compare when it was on/off. While the the visualization highlights changes in the temperature data; the nuances in this air conditioner data demonstrate interesting stories. From the average amount I used it, to the times of day, it highlights my behaviours and the wasteful pattern I have become accustomed to. These findings were communicated in three infographics below the graph.', 'https://github.com/lulujordanna/data-structures/tree/master/final', 'https://raw.githubusercontent.com/lulujordanna/data-structures/master/final/images/sensor1.jpg'));
blogEntries.push(new BlogEntry('Temperature Sensor', 'December 12, 2019', 'Cool November: Connecting to Endpoints', 'Connecting the data to the interface had some challenges as I was using two time-based data inputs; the temperature (queried from SQL) and my air conditioner times (stored in a JSON file). The handlebars variable from my query is being assigned a new variable name (data). I first started by setting up the foundation for a line graph. Then inside my draw function, I used the data map function to parse the time (d.date) and temperature value (d.value). To build the line graph I used the datum attribute and assigned my x coordinate to represent the date, and the y coordinate to represent the temperature. Once the line graph was created I repeated the process for the air conditioner. I used the data map function again, this time within a d3.json function outside of the draw function. Once the air conditioner data was mapped correctly, inside the draw function I used the data attribute and appended a rectangle based on the start and end time of using the air conditioner.', 'https://github.com/lulujordanna/data-structures/tree/master/final'));
blogEntries.push(new BlogEntry('Temperature Sensor', 'December 13, 2019', 'Cool November: The Takeaways', 'I am also very happy with this final outcome, as its is very close to my intended design. I feel that my app has accounted for designing a reliable web application as I accounted for the issues of converting time in my query. If I was continuing to collect data and the graph would have to adapt daily, I would need to take this into account for designing a more fault tolerant system that I currently have.', 'https://github.com/lulujordanna/data-structures/tree/master/final'));

//blogEntries.push(new BlogEntry('category', 'date', 'title', 'entry', 'https://github.com/lulujordanna/data-structures/tree/master/week', 'photo'));

//Adding blog entries to the DynamoDB
var dynamodb = new AWS.DynamoDB();

async.eachSeries(blogEntries, function(value, callback) {
  var params = {};
  params.Item = value; 
  params.TableName = "processblog";
  
  dynamodb.putItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
  setTimeout(callback, 1000); 
});