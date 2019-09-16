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