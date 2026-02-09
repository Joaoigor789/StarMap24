const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const coordsControl = L.control({ position: 'bottomleft' });
coordsControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'leaflet-control-coordinates');
    div.innerHTML = 'Lat: 0, Lon: 0';
    map.on('mousemove', e => div.innerHTML = `Lat: ${e.latlng.lat.toFixed(4)}, Lon: ${e.latlng.lng.toFixed(4)}`);
    return div;
};
coordsControl.addTo(map);

const satelliteIcon = L.icon({
    iconUrl: 'config/img/sat.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

const sunIcon = L.icon({
    iconUrl: 'config/img/sun.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const moonIcon = L.icon({
    iconUrl: 'config/img/moon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

let sunMarker = null;
let moonMarker = null;
let satellites = [];
const MAX_SATELLITES = 100;
let showOrbits = true;
let trackingPaused = false;

async function loadSatellites() {
    try {
        const res = await fetch('tle.txt');
        if (!res.ok) throw new Error('Erro ao buscar TLE');
        const txt = await res.text();
        const lines = txt.split('\n');

        for (let i = 0, count = 0; i < lines.length; i += 3) {
            if (count >= MAX_SATELLITES) break;
            if (!lines[i] || !lines[i + 1] || !lines[i + 2]) continue;

            satellites.push({
                name: lines[i].trim(),
                tle1: lines[i + 1].trim(),
                tle2: lines[i + 2].trim(),
                marker: null,
                orbit: null
            });
            count++;
        }

        setInterval(updatePositions, 1000);
    } catch (err) {
        console.error('Erro ao carregar satélites:', err);
    }
}

function updateSunMoon() {
    const now = new Date();
    const sunPos = SunCalc.getPosition(now, 0, 0);
    const sunLat = sunPos.altitude * 180 / Math.PI;
    const sunLon = sunPos.azimuth * 180 / Math.PI;

    if (!sunMarker) {
        sunMarker = L.marker([sunLat, sunLon], { icon: sunIcon }).addTo(map).bindPopup("Sol");
    } else {
        sunMarker.setLatLng([sunLat, sunLon]);
    }

    const moonPos = SunCalc.getMoonPosition(now, 0, 0);
    const moonLat = moonPos.altitude * 180 / Math.PI;
    const moonLon = -moonPos.azimuth * 180 / Math.PI;

    if (!moonMarker) {
        moonMarker = L.marker([moonLat, moonLon], { icon: moonIcon }).addTo(map).bindPopup("Lua");
    } else {
        moonMarker.setLatLng([moonLat, moonLon]);
    }
}

function updatePositions() {
    if (trackingPaused || !satellites.length) return;
    const now = new Date();

    satellites.forEach(sat => {
        const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
        const pv = satellite.propagate(satrec, now);
        if (!pv.position) return;

        const gmst = satellite.gstime(now);
        const posGd = satellite.eciToGeodetic(pv.position, gmst);
        const lat = satellite.degreesLat(posGd.latitude);
        const lon = satellite.degreesLong(posGd.longitude);
        if (isNaN(lat) || isNaN(lon)) return;

        if (!sat.marker) {
            sat.marker = L.marker([lat, lon], { icon: satelliteIcon, rotationAngle: 0, rotationOrigin: 'center center' })
                .addTo(map)
                .bindPopup(sat.name);
        } else {
            sat.marker.setLatLng([lat, lon]);
        }

        const nextTime = new Date(now.getTime() + 1000);
        const nextPv = satellite.propagate(satrec, nextTime);
        if (nextPv.position) {
            const nextGd = satellite.eciToGeodetic(nextPv.position, satellite.gstime(nextTime));
            const nextLat = satellite.degreesLat(nextGd.latitude);
            const nextLon = satellite.degreesLong(nextGd.longitude);
            const angle = Math.atan2(nextLat - lat, nextLon - lon) * (180 / Math.PI);
            sat.marker.setRotationAngle(angle);
        }

        sat.marker.getPopup().setContent(`<b>${sat.name}</b><br>Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);

        if (showOrbits) drawOrbit(sat, now);
        else if (sat.orbit) { sat.orbit.remove(); sat.orbit = null; }
    });

    updateSunMoon();
}

function drawOrbit(sat, now) {
    const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
    const orbitLine = [];

    for (let i = 0; i <= 30; i++) {
        const future = new Date(now.getTime() + i * 2 * 60 * 1000);
        const futPv = satellite.propagate(satrec, future);
        if (!futPv.position) continue;
        const futGd = satellite.eciToGeodetic(futPv.position, satellite.gstime(future));
        orbitLine.push([satellite.degreesLat(futGd.latitude), satellite.degreesLong(futGd.longitude)]);
    }

    if (!sat.orbit) {
        sat.orbit = L.polyline(orbitLine, { color: 'rgba(255,0,0,0.2)', dashArray: '5,5', opacity: 0.3 }).addTo(map);
    } else {
        sat.orbit.setLatLngs(orbitLine);
    }
}

function centerMap() { map.setView([0, 0], 2); }
function toggleOrbit() { showOrbits = !showOrbits; }
function pauseTracking() { trackingPaused = !trackingPaused; }
function showSatellites() {
    let list = "Satélites no mapa:\n";
    satellites.forEach(s => list += `${s.name}\n`);
    alert(list);
}

L.control.zoom({ position: 'topright' }).addTo(map);
loadSatellites();
setInterval(updateSunMoon, 1000);
