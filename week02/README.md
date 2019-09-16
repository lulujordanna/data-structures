## Week 02 Assignment 

Building off of the week 01 assignment, the goal of this project was to use Node.js to read a single text file and create a new file with addresses of the Alcohol Anonymous meetings. I used Zone 10 from the AA map which is file m10.


## Previous Solution 

In the global variables portion of my document I requested the previous document, loaded in the cheerio package, wrote my new file and created an open variable called location which will be used to store the location data. Writing the file ahead of the cheerio commands help to account for the asynchronous nature of JavaScript. 
```javascript
var content = fs.readFileSync('/home/ec2-user/environment/week01/data/m10.txt');
var $ = cheerio.load(content);

fs.writeFileSync('/home/ec2-user/environment/week02/data/m10.txt', location);
var location;  
```

<br>
Using npm cheerio, I began to search for the parameters of the table that I needed. Unfortunately due to the inconsistencies in the HTML formatting I could not just extract the paragraph's themselves. I started by removing the extra divs, spans, and bolded text elements that were not related to the address. 

```javascript
var meetingTitle = $(elem).find('b').remove().html();
var extraDiv = $(elem).find('div').remove().html(); 
var extraSpan = $(elem).find('span').remove().html(); 
```

<br>
I then created a variable called address get closer to the correct text itself and to strip out any white space. The .split() command created an array of these addresses. 

```javascript
var address = $(elem).children().eq(0).text().replace(/\t/g,'').split('\n').filter(address=>address.trim().length > 1).map(i=>i.trim());
```

<br>
Using the location variable which I had created at the beginning, I created a string using the second position in the array (address number and street name) and added 'Manhattan NY' to complete the address. Using appendFileSync the information is added to the file without overwriting the previous information. 

```javascript
location = address[1] + ' Manhattan NY '; 
```


## Current Solution 

After further explanation of solutions in class, I have adapted my code to the following. This solution uses cheerio to search for the specific styling and parses the elements into a object. It also saves the file as a JSON which is more applicable then a text file for future use. 

```javascript
var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('/home/ec2-user/environment/week01/data/m10.txt');
var $ = cheerio.load(content);

var meetingData = []; 

$('td').each(function(i, elem) {
    
    if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3; width:260px"){
        var thisMeeting = {}; 
        
        thisMeeting.streetAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
        thisMeeting.city = 'New York'
        thisMeeting.state = 'NY'
        meetingData.push(thisMeeting); 
    }
});

console.log(meetingData);
fs.writeFileSync('/home/ec2-user/environment/week02/data/m10.JSON', JSON.stringify(meetingData)); 
```
