var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('/home/ec2-user/environment/week01/data/m10.txt');
var $ = cheerio.load(content);

var meetingData = []; 

$('tr').each(function(l, trElem) {

    let id = l;
    
    $(trElem).children().each(function(i,elem) {
    
    if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3; width:260px"){
        var thisMeeting = {}; 
        
        thisMeeting.locationID = id;
        thisMeeting.streetAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
        thisMeeting.addressName = $(elem).html().split('<h4>')[0].trim().split('<br>')[0].replace(/.....$/, "").replace("<h4 style=\"margin:0;padding:0;\">", ""); 
        thisMeeting.city = 'New York'; 
        thisMeeting.state = 'NY'; 
        
        meetingData.push(thisMeeting); 
    }; 
  });
});

//console.log(meetingData);
fs.writeFileSync('/home/ec2-user/environment/week07/data/m10.JSON', JSON.stringify(meetingData));