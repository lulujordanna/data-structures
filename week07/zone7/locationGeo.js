var fs = require('fs');
var cheerio = require('cheerio');

var zone = '07'
var content = fs.readFileSync('/home/ec2-user/environment/week01/data/m'+zone+'.txt');
var $ = cheerio.load(content);

var meetingData = []; 

$('tr').each(function(l, trElem) {
    
    $(trElem).children().each(function(i,elem) {
    
    if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3; width:260px"){
        var meetingLocation = {}; 
        
        meetingLocation.streetAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
        meetingLocation.addressName = $(elem).html().split('<h4>')[0].trim().split('<br>')[0].replace(/.....$/, "").replace("<h4 style=\"margin:0;padding:0;\">", ""); 
        meetingLocation.city = 'New York'; 
        meetingLocation.state = 'NY'; 
        
        meetingData.push(meetingLocation); 
    }
  }); 
});

//console.log(meetingData);
fs.writeFileSync('/home/ec2-user/environment/week07/data/locationGeo'+zone+'.JSON', JSON.stringify(meetingData));


