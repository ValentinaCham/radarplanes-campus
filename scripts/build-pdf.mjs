#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const htmlPath = join(ROOT, 'informe', 'informe.html');

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(htmlPath).toString(), { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

await page.pdf({
  path: join(ROOT, 'informe', 'informe-radarplanes.pdf'),
  format: 'A4',
  printBackground: true,
  margin: { top: '18mm', right: '16mm', bottom: '22mm', left: '16mm' }
});

await browser.close();
console.log('✓ informe-radarplanes.pdf');