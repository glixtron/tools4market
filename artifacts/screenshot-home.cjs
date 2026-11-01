const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 20000 });
  await p.waitForTimeout(800);
  await p.screenshot({ path: 'artifacts/homepage.png', fullPage: false });
  await b.close();
  console.log('screenshot saved: artifacts/homepage.png');
})().catch(e => { console.error(e); process.exit(1); });
