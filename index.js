/**
 * 使用Puppeteer爬取“阮一峰”开源电子书《ECMAScript 6 入门》（电子书地址：http://es6.ruanyifeng.com/）。
 */
const puppeteer = require('puppeteer');

(async() => {
    // 1、打开 浏览器
    const browser = await puppeteer.launch();
    // 2、打开 新页面
    let page = await browser.newPage();
    // 3、网址跳转到 电子书页面
    await page.goto('http://es6.ruanyifeng.com', {waitUtil: 'networkidle0'});
    await page.waitFor(2000);
    // 4、所有文章的链接地址
    let aTags = await page.evaluate(() => {
        let as = [...document.querySelectorAll('ol li a')];
        return as.map((a) =>{
            return {
                href: a.href.trim(),
                name: a.text
            };
        });
    });
    // 5、访问所有的文章，然后生成PDF
    for(let i = 0; i < aTags.length; i++) {
        page = await browser.newPage();
        await page.setViewport({width: 1200, height: 800});

        let a = aTags[i];
        await page.goto(a.href, {waitUtil: 'networkidle0'});
        await page.waitFor(5000);

        await page.pdf({path: `./docs/${i + '.' + a.name}.pdf`});

        await page.close();
    }

    // 6、关闭浏览器
    await browser.close();
})();

