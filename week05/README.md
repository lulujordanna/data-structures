## The Goal

The goal of this week’s assignment is to begin planning out how to build a NoSQL database and populating that database for our final assignment 2, “The Process Blog”.

### Planning 
I plan on using my documentation from GitHub to showcase my development with JavaScript and my working process of the three final assignments. While the core functionality of each post won’t change (category, date, title, entry), I want there to be flexibility to include other multi-media and link out to webpages. I am using a semi-structured key-value and document database (DynamoDB).  For each entry, I am thinking of the following hierarchical structure and that the data coming out of the database will look fairly similar. 

<strong>Category (PK)</strong>: Which project this entry belongs to (AA Meetings, Process Blog or Tempeture Sensor)
<br>
<strong>Date (SK)</strong>: Date of Entry
<br>
<strong>Title</strong>: Title of Post
<br>
<strong>Entry</strong>: The documentation/paragraph 
<br>
<strong>URL</strong>: A link to my GitHub
<br>
<strong>Photo</strong>: Image that relates to the subject matter of the post



### Previous Solution 
After creating the this plan, I modified the BlogEntry object to fit these parameters. I then populated the object and used the .push() method for the data to be stored in the blogEnteries array. Below is the code for the object and one example of the blog entry.
```Javascript
var blogEntries = [];

class BlogEntry {
  constructor(category, date, title, entry, url, photo) {
    this.category = {};
    this.category.S = category.toString();
    
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    
    this.title = {};
    this.title.S = title;
    
    this.entry = {};
    this.entry.S = entry;
    
    this.url = {};
    this.url.S = url;
    
    this.photo = {};
    this.photo.S = photo;
    
    this.month = {};
    this.month.N = new Date(date).getMonth().toString();
    
  }
}
blogEntries.push(new BlogEntry('AA Meetings', 'August 30, 2019', 'Week 01: An Introduction to Node JS', 'The goal of the Week 01 Assignment was to use Node.js to make a request for each of the ten "Meeting List Agenda" pages for Alcoholics Anonymous in Manhattan. The final outcome will programmatically convert the HTML pages to text files. Using the starter code as my base, I needed to create two arrays to hold the information for the URLs and text file paths. However, the for() loop was executing faster than the methods inside the loop. By changing the var to a let statement, this created a fresh binding to our iterator versus var which does a single binding for the whole loop. The outcome was successful, however moving forward I would like to learn how to generate the URLs and file names dynamically.', 'https://github.com/lulujordanna/data-structures/tree/master/week01', 'none'));

```

Once the array was populated, I wrapped the starter code in a async.EachSeries to loop through the entries and push them to the database. Using an async.EachSeries over a traditional for() loop accounts for the asynchronous nature of JavaScript. Below is the code for this portion as well as a screenshot from the AWS console of the populated database.  
```Javascript
var dynamodb = new AWS.DynamoDB();

async.eachSeries(blogEntries, function(value, callback) {
  var params = {};
  params.Item = value; 
  params.TableName = "processblog";
  
  dynamodb.putItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data); // successful response
  });
  setTimeout(callback, 1000); 
});  
```
![Screenshot of Populated Database](https://github.com/lulujordanna/data-structures/blob/master/week05/PopulatedDynamoDB.png)

## Current Solution 

Reflecting on last week, I felt that my NoSQL database is a good start but there was an issue with inputting images. I originally put a  'none' string in that portion of the object as I had no photos to upload yet. After class I was able to switch my code to reflect if a field does not have an item to upload. Below is the code for this section and a screenshot of the populated database.

```Javascript
var blogEntries = [];

class BlogEntry {
  constructor(category, date, title, entry, url, photo) {
    this.category = {};
    this.category.S = category.toString();
    
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
```
![Screenshot of Populated Database](https://github.com/lulujordanna/data-structures/blob/master/week05/PopulatedDynamoDB2.png)
