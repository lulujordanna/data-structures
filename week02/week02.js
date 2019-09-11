var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('/home/ec2-user/environment/week01/data/m10.txt');
var $ = cheerio.load(content);

fs.writeFileSync('/home/ec2-user/environment/week02/data/m10.txt', location);
var location; 

$('tr tr tr').each(function(i, elem) {
    
    if (i != 0){
        
        //Remove the extra elements (div, spans and bolded text) that are in the table data
        var meetingTitle = $(elem).find('b').remove().html();
        var extraDiv = $(elem).find('div').remove().html(); 
        var extraSpan = $(elem).find('span').remove().html(); 
    } 
        //Finds the need text in the table data and removes the white space
        var address = $(elem).children().eq(0).text().replace(/\t/g,'').split('\n').filter(address=>address.trim().length > 1).map(i=>i.trim()); 
        //console.log(address); 
        
        //Extracts the key information of the address. 
        location = address[1] + ' New York, NY '; 
        console.log(location);
        
        //Appending the information onto the file itself without overriding the previous information. 
        fs.appendFileSync('/home/ec2-user/environment/week02/data/m10.txt', location + '\n' );
});
