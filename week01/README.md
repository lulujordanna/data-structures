## Week 01 Assignment 

The goal of the Week 01 Assignment was to use Node.js to make a request for each of the ten "Meeting List Agenda" pages for Alcoholics Anonymous in Manhattan. This programatically converts the HTML pages to text files. 

Provided to us was a set of URLs and a sample starter code. 

```
https://parsons.nyc/aa/m01.html  
https://parsons.nyc/aa/m02.html  
https://parsons.nyc/aa/m03.html  
https://parsons.nyc/aa/m04.html  
https://parsons.nyc/aa/m05.html  
https://parsons.nyc/aa/m06.html  
https://parsons.nyc/aa/m07.html  
https://parsons.nyc/aa/m08.html  
https://parsons.nyc/aa/m09.html  
https://parsons.nyc/aa/m10.html
```

```javascript
// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');

request('https://parsons.nyc/thesis-2019/', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/thesis.txt', body);
    }
    else {console.log("Request failed!")}
});
```

## Solution 

Using the starter code as my base, I needed to create two arrays to hold the information for the URLs and text file paths. I then replaced the single url with the urls array (urls[i]) and replaced the single file path with the fns array (fns[i]).

This did not initally work as the for() loop was executing faster than the methods inside the loop. By changing the var to a let statement, creates a fresh binding to our iterator versus var which does a single binding for the whole loop. This can be referenced here: https://2ality.com/2015/02/es6-scoping.html#let-in-loop-heads

```javascript
var request = require('request');
var fs = require('fs');

var urls = ['https://parsons.nyc/aa/m01.html', 
'https://parsons.nyc/aa/m02.html', 
'https://parsons.nyc/aa/m03.html', 
'https://parsons.nyc/aa/m04.html', 
'https://parsons.nyc/aa/m05.html', 
'https://parsons.nyc/aa/m06.html', 
'https://parsons.nyc/aa/m07.html', 
'https://parsons.nyc/aa/m08.html', 
'https://parsons.nyc/aa/m09.html', 
'https://parsons.nyc/aa/m10.html'];

var fns = ['/home/ec2-user/environment/week01/data/m01.txt', 
'/home/ec2-user/environment/week01/data/m02.txt', 
'/home/ec2-user/environment/week01/data/m03.txt', 
'/home/ec2-user/environment/week01/data/m04.txt', 
'/home/ec2-user/environment/week01/data/m05.txt', 
'/home/ec2-user/environment/week01/data/m06.txt', 
'/home/ec2-user/environment/week01/data/m07.txt', 
'/home/ec2-user/environment/week01/data/m08.txt', 
'/home/ec2-user/environment/week01/data/m09.txt', 
'/home/ec2-user/environment/week01/data/m10.txt'];


for (let i=0; i<10; i++) {
    request(urls[i], function(error, response, body) {
        if (!error && response.statusCode == 200) {
            fs.writeFileSync(fns[i], body);
        }
        else { console.log("Request failed!") }
    });
}
```

## Next Steps 

If I were to work on this this further I would learn to generate the urls and file names dynamically. 