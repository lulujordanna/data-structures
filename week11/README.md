#  Goals 

The goal of this final weekly assignment is to create interface designs for the three data sources we have been working with this semester. In doing so we must address 

* What will the visualization look like? Will it be interactive? If so, how?
* How will the data need to be mapped to the visual elements?
* For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or something else? How will this be done?
* What is the default view (if any)?
* What assumptions are you making about the user?

## Assignment 1: AA Meetings 

For Assignment 1, I want to create a clean, user friendly visualization to make the information highly accessible. My goal of this project is to create a long term planning tool which users can use to find the right AA Meeting for them, based on defined geographic neighbourhoods. As I am building this project,  I am assuming that future users live in Manhattan and are comfortable with defining their geographic location in proximity to an AA Meeting. The following images highlight the visual design of the  interactive map. Users will land on the default view (Image 1) and have to choose their neighbourhood to receive information. Once the neighbourhood is chosen, the map will reposition and meetings will appear (Image 2). When the user clicks on the map pointers, details about the meetings at that location will appear (Image 3). The data will be mapped to the visual elements in multiple ways. The firstly the buttons will each be assigned a zoneID based from the zoneName table. This established which neighbourhood/zone the map with re-position to. Once a button is triggered this shapes the map to include the markers for the meetings. Each marker is based on the latitude and longitude from the geoLocation table. Each location has a locationID to connect the marker to the schedule information, which is viewed when clicked upon. The data structure is in a much stronger place then when I started, but I still need to work on a optimal query for this two step process (button to trigger the map/markers). 

![Interface for AA 1](https://github.com/lulujordanna/data-structures/blob/master/week11/images/aa-1.png)
![Interface for AA 2](https://github.com/lulujordanna/data-structures/blob/master/week11/images/aa-2.png)
![Interface for AA 3](https://github.com/lulujordanna/data-structures/blob/master/week11/images/aa-3.png)

## Assignment 2: Process Blog 
For Assignment 2, I want to create a simplistic blog which is driven by the content of each post. It will track my progression in learning javascript through the reflections in Data Structures. Each reflection has a category (a project) which is the primary key for the structure of the blog and a sort key; the date. The default view will be in order of posts based on the category but users will be able to filter based on the date and/or category. The following image is a sketch of the design with two different types of posts (one with an image and one without). As the project is highly text based, the data will be transformed into html elements in the order in which I inputed them into the database. I need to learn how to be able to filter the data in the final outcome. Based on my design I am making the assumptions that users will scroll through the page to navigate, click on the button's to learn more via my GitHub page and understand that the top menu is a source of filtering.

![Interface for Process Blog](https://github.com/lulujordanna/data-structures/blob/master/week11/images/processblog.png)

## Assignment 3: Temperature Sensor  
For the final assignment, I want to create a interactive visualization that records the temperature of my bedroom, accounting for the times when I have my Air Conditioner (AC) on. The following images highlight the visual design for the project. The first image is the default view, while the second image is what occurs when you hover over a selected period. If the AC was on during that time, a highlighted box and tooltip will appear. Ultimately, if time permits, I would like to have a feature where you could click to see all the times the AC was on (image 3). The temperature data will be mapped to the visual element of the line graph. This will need to be aggregated by hour of each day. The data regarding my AC usage will be taken from a JSON file which has been tracking every time I turn on and off my AC during the day. For this project, I am making the assumption that users will hover over my graph in order to gain further knowledge about my AC behaviours. 

![Interface for Temperature 1](https://github.com/lulujordanna/data-structures/blob/master/week11/images/sensor-1.png)
![Interface for Temperature 2](https://github.com/lulujordanna/data-structures/blob/master/week11/images/sensor-2.png)
![Interface for Temperature 3](https://github.com/lulujordanna/data-structures/blob/master/week11/images/sensor-3.png)
