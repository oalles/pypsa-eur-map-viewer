import fs from 'node:fs/promises';
import fetch from 'node-fetch';

const BASE = 'https://zenodo.org/records/14144752/files/';
const FILES = ['buses.csv', 'lines.csv', 'links.csv', 'transformers.csv', 'converters.csv'];

await fs.mkdir('public/data', {recursive: true});

for (const f of FILES) {
    const res = await fetch(`${BASE}${f}`);
    if (!res.ok) throw new Error(`Failed ${f}`);
    let content = Buffer.from(await res.arrayBuffer()).toString('utf-8');
    // Si es lines.csv o links.csv, quitar comillas simples solo en geometry
    if (f === 'lines.csv' || f === 'links.csv' || f === 'transformers.csv' || f === 'converters.csv') {
        // Reemplaza comillas simples por comillas dobles SOLO en geometry
        // Busca geometry entre comas, con comillas simples, y las convierte a comillas dobles
        content = content.replace(/(,)'(LINESTRING [^']+)'/g, '$1"$2"');
    }
    await fs.writeFile(`public/data/${f}`, content);
    console.log('✓', f);
}
