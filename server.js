const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

const TLE_FILE = path.join(__dirname, 'public', 'tle.txt');


async function updateTLEs() {
    try {
        const starlink = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=STARLINK&FORMAT=TLE').then(r => r.text());
        const stations = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=STATIONS&FORMAT=TLE').then(r => r.text());

        const combined = starlink + '\n' + stations;
        fs.writeFileSync(TLE_FILE, combined, 'utf8');
        console.log(`[${new Date().toLocaleString()}] TLEs atualizados.`);
    } catch (err) {
        console.error('Erro ao atualizar TLEs:', err);
    }
}


updateTLEs();


setInterval(updateTLEs, 2 * 60 * 60 * 1000); 

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
