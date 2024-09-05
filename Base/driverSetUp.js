import { Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import { getConfig } from '../Utils/config.js'

async function createDriver() {
    const config = getConfig();
    let driver;
    if (config.browser === "chrome") {
        const options = new Options();
        options.addArguments("--disable-search-engine-choice-screen");
    // Use next 3 lines for headless run.
        // options.addArguments('--headless'); // Runs Chrome in headless mode
        // options.addArguments('--no-sandbox'); // Bypass OS security model
        // options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    } else if (config.browser === "firefox") {
        driver = await new Builder().forBrowser('firefox').build();
    } else if (config.browser === "edge") {
        driver = await new Builder().forBrowser('edge').build();
    }
    //Use this for a headless run.
    //await driver.manage().window().setRect({width:1280,height:800});
    //Use this for a UI run.
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: 2000 });
    return driver;

}
export { createDriver };
