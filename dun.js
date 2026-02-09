
const sunIcon = L.icon({
    iconUrl: 'config/img/sun.png',
    iconSize: [32,32],
    iconAnchor: [16,16]
});

const moonIcon = L.icon({
    iconUrl: 'config/img/moon.png',
    iconSize: [32,32],
    iconAnchor: [16,16]
});

let sunMarker = null;
let moonMarker = null;

function updateSunMoon() {
    const now = new Date();

    
    const brNow = new Date(now.getTime() - 3*60*60*1000);

    const hours = brNow.getHours() + brNow.getMinutes()/60 + brNow.getSeconds()/3600;

    
    const sunLon = 180 - (hours/24)*360;
    const sunLat = 0; 

    if(!sunMarker){
        sunMarker = L.marker([sunLat, sunLon], {icon: sunIcon}).addTo(map).bindPopup("Sol");
    } else {
        sunMarker.setLatLng([sunLat, sunLon]);
    }

    
    
    const moonSpeed = 13.2 / 360;
    const moonLon = 180 - ((hours/24)*360) * moonSpeed;
    const moonLat = 0; 

    if(!moonMarker){
        moonMarker = L.marker([moonLat, moonLon], {icon: moonIcon}).addTo(map).bindPopup("Lua");
    } else {
        moonMarker.setLatLng([moonLat, moonLon]);
    }
}


setInterval(updateSunMoon, 1000);
updateSunMoon(); 
