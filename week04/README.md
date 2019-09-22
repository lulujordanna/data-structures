## Goal 
Taking the data that I have parsed from the AA zone, the goal of this weeks assignment is to create a relational database. There are four steps to achieving this goal; planning, creating a table, populating the table and checking the result. Each of these steps are defined in my through files uploaded and individual JS files. 

## Solution in Steps

### 1. Planning the database. 
When initally planning my database, I thought of the heirachy of the data itself. While this is beneifical to understanding the structure of content, the structure for a relational database is better suited in multiple tables. 

![Image of AA Data Hierarchy](https://github.com/lulujordanna/data-structures/blob/master/week04/files/aaHierarchy.jpg)

Using illustrator I mapped out the three tables I will need for the AA data structure; locationGeo, schedule and meetings. Each table has the value name and parameter it needs. Using IDs for the location and meetings, this feeds into the schedule table without having duplicate information.  

![Image of AA Data Structure](https://github.com/lulujordanna/data-structures/blob/master/week04/files/aaSchema.png)


### 2. Security & Creating a table. 
After setting up my database in AWS, I connected the database credentials to my JS file. Using the process.env command I kept my user credientals, host url and password in my environment variable to ensure these do not end up on GitHub. Once that was completed I created my locationGeo table in the database. 
```javascript
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USER;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;
```
```javascript
var thisQuery = "CREATE TABLE locationGeo (locationID int, address varchar(100), addressName varchar(100), lat double precision, long double precision);";
```

### 3. Populating the table.  
Before I could populate the table, I wanted to ensure that duplicate addresses were removed from the JSON that I was working with. In order to do this I created two new arrays; addressesForDb and addressesCheck. The addressesForDb will be the final array I use to populate my table, while the check array checks the latitude and longitude for duplicates. Inside my for loop, I created a variable to first combine the latitude and longitude. Then the if statement checks the latLonCombined is false. The data I wanted was then pushed to the addressesForDb array and the final number of locations for this zone is 13. 
```javascript
var addressesForDb = [];
var addressesCheck = [];

for (var i = 0; i < content.length; i++) {
  var latLonCombined = content[i]['lat'] + content[i]['long'];
    if (addressesCheck.includes(latLonCombined) == false) {
        addressesForDb.push(content[i]);
        addressesCheck.push(latLonCombined);
  }
}
```

I then was able to populate the table with the information from the JSON file. However not all of my variables were included in the JSON file at the moment (locationID and addressName) so I used 'dummy data' for now which is evident in the INSERT INTO statement below.  
```javascript
async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO locationGeo VALUES ('"+ 0 +"', E'"+ value.street +"', '"+ value.NULL +"', " + value.lat + ", " + value.long + ");";
    
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
```

### 4. Checking the result. 
Using the starter code I was able to check to see that the database had populated correctly. As I don't have the data for the locationId and Address name the result returned a 0 and undefined. 

![Image of database check](https://github.com/lulujordanna/data-structures/blob/master/week04/files/databaseCheck.png)

## Next Steps

While this was successful for adding a single table, I struggled with adding multiple tables. My next step would be to adjust the code to add the additional tables and parse the new data for the locationGeo table and the future tables. 
