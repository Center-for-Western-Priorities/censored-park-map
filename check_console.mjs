import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    await page.goto('http://localhost:5174');
    await new Promise(r => setTimeout(r, 2000));

    const content = await page.content();
    console.log('App Root HTML:', content.substring(0, 500));

    await browser.close();
})();
