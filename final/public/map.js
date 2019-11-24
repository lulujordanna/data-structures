var L; 
var mymap = L.map('mapid').setView([40.766438, -73.977748], 12);
    
    L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
	attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
	minZoom: 1,
	maxZoom: 19, 
	accessToken: 'pk.eyJ1IjoibHVsdWpvcmRhbm5hIiwiYSI6ImNrMzdsZ3U4bzAwMHUzcXBnNHB1dWlyNmwifQ.aFToIlZE5xfbmHl2qJ1tHA'
}).addTo(mymap);

// function zone10() {
//   mymap = L.map('mapid').setView([40.766438, -73.977748], 14);
// }