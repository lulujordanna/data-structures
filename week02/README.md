## Week 02 Assignment 

Building off of the week 01 assignment, the goal of this project was to use Node.js to read a single text file and create a new file with addresses of the Alcohol Anonymous meetings. I used Zone 10 from the AA map which is file m10.

<br>

Solution

In the global variables portion of my document I requested the previous document, loaded in the cheerio package, wrote my new file and created an open variable called location which will be used to store the location data. Writing the file ahead of the cheerio commands help to account for the asynchronous nature of JavaScript. 

```javascript
var content = fs.readFileSync('/home/ec2-user/environment/week01/data/m10.txt');
var $ = cheerio.load(content);

fs.writeFileSync('/home/ec2-user/environment/week02/data/m10.txt', location);
var location;  
```

<br>
Using npm cheerio, I began to search for the parameters of the table that I needed. Unfortunately due to the inconsistencies in the HTML formating I could not just extract the paragraph's themselves. I started by removing the extra divs, spans, and bolded text elements that were not related to the address. 

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
Using the location variable which I had created at the beginning, I created a string using the second position in the array (adress number and street name) and added 'Manhattan NY' to complete the address. The using Using appendFileSync the information is added to the file without overwriting the previous information.

```javascript
location = address[1] + ' Manhattan NY '; 
```
 

<br>
Next Steps
I had great difficulty with this assignment and was not able to include the zip codes in the address'. Creating a function to strip out just the zip codes would be a way to iterate the code further. It could also be stored in a different file format than a text file. 
