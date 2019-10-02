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

blogEntries.push(new BlogEntry('AA Meetings', 'August 30, 2019', 'Week 01: An Introduction to Node JS', 'The goal of the Week 01 Assignment was to use Node.js to make a request for each of the ten "Meeting List Agenda" pages for Alcoholics Anonymous in Manhattan. The final outcome will programmatically convert the HTML pages to text files. Using the starter code as my base, I needed to create two arrays to hold the information for the URLs and text file paths. However, the for() loop was executing faster than the methods inside the loop. By changing the var to a let statement, this created a fresh binding to our iterator versus var which does a single binding for the whole loop. The outcome was successful, however moving forward I would like to learn how to generate the URLs and file names dynamically.', 'https://github.com/lulujordanna/data-structures/tree/master/week01'));
blogEntries.push(new BlogEntry('AA Meetings', 'September 9, 2019', 'Week 02: Parsing and Scraping a Text File', 'Building off of the week 01 assignment, the goal of this project was to use Node.js to read a single text file and create a new file with addresses of the Alcohol Anonymous meetings. I used Zone 10 from the AA map which is file m10. Using npm cheerio, I began to search for the parameters of the table that I needed. Unfortunately, due to the inconsistencies in the HTML formatting I could not just extract the paragraphs themselves. I started by removing the extra divs, spans, and bolded text elements that were not related to the address. I then created a variable called address to get closer to the correct text itself and to strip out any white space. The split() command created an array of these addresses. Using a variable called location, which I had created at the beginning of the assignment, I created a string using the second position in the array (address number and street name) and added "Manhattan NY" to complete the address. Using appendFileSync the information is added to the text file without overwriting the previous information. After further explanation of solutions in class, I have adapted my code to use cheerio to search for the specific styling and parses the elements into an object. It also saves the file as a JSON which is more applicable then a text file for future use.', 'https://github.com/lulujordanna/data-structures/tree/master/week02'));
blogEntries.push(new BlogEntry('AA Meetings', 'September 16, 2019', 'Week 03: An Introduction to Geocoding', 'Using the parsed data from last week, the goal of this assignment was to use the Texas A&M Geoservices Geocoding API to make a request for the geo-locations of all the meetings in the zone. The first step was loading in the content from Week02 to use the object values for the constructed API request. Within the asyncEachSeries, I created three variables to make it faster to reference the values within the JSON. After the URL has been constructed, I created variables to inside the else statement to hold the latitude and longitude information. I then created a variable called fullAddress to store the information for the street address, city, state, latitude and longitude. Using meetingsData.push(fullAddress), this information was pushed to the array. I then wrote a new JSON file with the updated parameters. Moving forward my goal would be to strip out any inconsistencies within the street address and remove any duplicate locations within the JSON file.', 'https://github.com/lulujordanna/data-structures/tree/master/week03'));
blogEntries.push(new BlogEntry('AA Meetings', 'September 23, 2019', 'Week 04: An Introduction to SQL', 'Taking the data that I have parsed from the AA zone, the goal of this week’s assignment is to create a relational database. There are four steps to achieving this goal; planning, creating a table, populating the table and checking the result. When initially planning my database, I thought of the hierarchy of the data itself. While this is beneficial to understanding the structure of content, the structure for a relational database is better suited in multiple tables. Using Illustrator, I mapped out the three tables I will need for the AA data structure; locationGeo, schedule and meetings. Each table has the value name and parameter it needs. Using IDs for the location and meetings, this feeds into the schedule table without having duplicate information. After setting up my database in AWS, I connected the database credentials to my JS file. Using the process.env command I kept my user credentials, host URL and password in my environment variable to ensure these do not end up on GitHub. Once that was completed, I created my locationGeo table in the database. Before I could populate the table, I wanted to ensure that duplicate addresses were removed from the JSON that I was working with. In order to do this, I created two new arrays; addressesForDb and addressesCheck. The addressesForDb will be the final array I use to populate my table, while the check array checks the latitude and longitude for duplicates. Inside the for() loop, I created a variable to first combine the latitude and longitude. Then the if statement checks the latLonCombined is false. The data I wanted was then pushed to the addressesForDb array and the final number of locations for this zone is 13. I then was able to populate the table with the information from the JSON file. However not all of my variables were included in the JSON file at the moment (locationID and addressName) so I used "dummy data" for now which is evident in the INSERT INTO statement of the code. Using the starter code, I was able to check to see that the database had populated correctly. As I do not have the data for the locationId and Address name the result returned a 0 and undefined. While this was successful for adding a single table, I struggled with adding multiple tables. My next step would be to adjust the code to add the additional tables and parse the new data for the locationGeo table and the future tables.', 'https://github.com/lulujordanna/data-structures/tree/master/week04', 'https://github.com/lulujordanna/data-structures/blob/master/week04/files/aaSchema.png'));
blogEntries.push(new BlogEntry('Process Blog', 'October 1, 2019', 'Week 05: An Introduction to NoSQL', 'The goal of this week’s assignment is to begin planning out how to build a NoSQL database and populating that database for our final assignment 2, The Process Blog. I plan on using my documentation from GitHub to showcase my development with JavaScript and my working process of the three final assignments. While the core functionality of each post won’t change (category, date, title, entry), I want there to be flexibility to include other multi-media and link out to webpages. I am using a semi-structured key-value and document database (DynamoDB). For each entry, I am thinking of the following hierarchical structure (see image below) and that the data coming out of the database will look fairly similar. After creating this plan, I modified the BlogEntry object to fit these parameters. I then populated the object and used the .push() method for the data to be stored in the blogEnteries array. Once the array was populated, I wrapped the starter code in a async.EachSeries to loop through the entries and push them to the database. After reflecting on this work, I felt that my NoSQL database was a good start, but there was an issue with inputting images. I originally put a "none" string in that portion of the object as I had no photos to upload yet. After class I was able to switch my code to reflect if a field does not have an item to upload.', 'https://github.com/lulujordanna/data-structures/tree/master/week05'));

//console.log(blogEntries);

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