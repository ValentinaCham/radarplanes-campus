#!/usr/bin/env node
/**
 * Snapshot RadarPlanes views with proper device emulation.
 * Usage: node scripts/snap.js [view-name]
 */
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'screenshots');
const URL = process.env.URL || 'http://localhost:5173';

const SHOTS = [
  { view: 'radar', name: '01-radar-mobile', width: 390, height: 844, dpr: 2 },
  { view: 'radar', name: '02-detail-mobile', width: 390, height: 1700, dpr: 2, plan: 'plan-1' },
  { view: 'lanzar', name: '03-lanzar-mobile', width: 390, height: 1700, dpr: 2 },
  { view: 'mis-planes', name: '04-misplanes-mobile', width: 390, height: 1200, dpr: 2 },
  { view: 'comunidad', name: '05-comunidad-mobile', width: 390, height: 1700, dpr: 2 },
  { view: 'radar', name: '06-radar-desktop', width: 1280, height: 800, dpr: 1 },
  { view: 'comunidad', name: '07-comunidad-desktop', width: 1280, height: 800, dpr: 1 }
];

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars']
});

await mkdir(OUT, { recursive: true });

for (const s of SHOTS) {
  const page = await browser.newPage();
  await page.setViewport({
    width: s.width,
    height: s.height,
    deviceScaleFactor: s.dpr,
    isMobile: s.width < 768,
    hasTouch: s.width < 768
  });
  const params = new URLSearchParams();
if (s.plan) params.set('plan', s.plan);
params.set('nogreet', '1');
const target = `${URL}/?${params.toString()}#${s.view}`;
  await page.goto(target, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({
    path: join(OUT, `${s.name}.png`),
    fullPage: false
  });
  console.log(`✓ ${s.name}.png (${s.width}x${s.height})`);
  await page.close();
}

await browser.close();