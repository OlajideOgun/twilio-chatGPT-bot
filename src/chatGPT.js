const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))
const {executablePath} = require('puppeteer')
const DataAccessManager = require('./dataAccessManager');
const logger = require('../logger');
const util = require('util');


// const DataAccessManager = require('./src/dataAccessManager');



class ChatGPT {
  constructor() {
    this.browser = null;
    this.dataAccessManager = new DataAccessManager();
    this.dataAccessManager.connect();
    
  }

  async resetConversation(userPhoneNumber) {
    await this.dataAccessManager.removeData({phoneNumber: userPhoneNumber});
  }

  async setUpHandlerForBrowserEvents () 
  {
    this.browser.on('disconnected', () => {
      logger.customError('Browser disconnected');
      // this.dataAccessManager.removeData();
    });
    this.browser.on('error', () => {
      logger.customError('Browser error');
      // this.dataAccessManager.removeData();
    });
    this.browser.on('targetdestroyed', () => {
      logger.customError('Browser target destroyed');
      // const browserWSEndpoint = 'ws://127.0.0.1:9222/devtools/browser/c16b09a3-b56c-4702-94fc-865c987145ae';
      // puppeteer.connect({browserWSEndpoint:browserWSEndpoint,headless: true});


      // logger.info('Browser target destroyed');
      // this.dataAccessManager.removeData();
    });
  }


  async createBrowser() {
    try {
      // this.browser = await puppeteer.launch({ headless: false, product: 'chrome', });
    //need to confiure the launch options more here

    const browserWSEndpoint = 'ws://127.0.0.1:9222/devtools/browser/96f686d4-21ef-4851-ba16-cd283d539fcc';

    logger.info(`Connecting to browser with endpoint: ${browserWSEndpoint}`);
    this.browser = await puppeteer.connect({browserWSEndpoint:browserWSEndpoint,headless: false});

    // return browser object
    // this.browser = await puppeteer.launch(
    //   {headless: true, product: 'chrome', executablePath: executablePath(),
    //   args: ['--remote-debugging-port=9222','--remote-debugging-address=0.0.0.0']});

      

      //call function to set up handlers for  browser events
      await this.setUpHandlerForBrowserEvents();

    
    // logger.info(`Browser created with browser context:`); 
    // this.browser.browserContexts().forEach(browserContext => console.log(browserContext.id));
    // this.browser.on('disconnected', () => {
    //   logger.info('Browser disconnected');
    
      
    } catch (error) {
      logger.customError(error);
      
    }

  }

  async createBrowserContext() {
    const browserContext = await this.browser.createIncognitoBrowserContext();
    logger.info(`Created new browser context with id ${browserContext.id}`);
    return browserContext;
  }

  //method to get user browser context id from the database
  async getBrowserContextIdFromDB(phoneNumber) {
    //make call to database to get browserContextId
    const browserId = await this.dataAccessManager.getBrowserId(phoneNumber);
    return browserId;

  }
 
  /**
     * this method uses the user phonenumber to retireve their browserContextId from the database
     * if its not in DB then we create a new browserContext and save it to the DB
     * we then load the browserContext and return it
     * @param {string} userPhoneNumber
     */
  async getBrowserContext(userPhoneNumber) {
    try {
        let browserContextId = await this.getBrowserContextIdFromDB(userPhoneNumber);
        let browserContext;

        if (!browserContextId){

          browserContext = await this.createBrowserContext();
          browserContextId = browserContext.id;
          await this.dataAccessManager.saveOrUpdateBrowserId(userPhoneNumber, browserContextId);
          return browserContext;
        }
        
        // this.browser.browserContexts().forEach(browserContext => logger.info(browserContext.id));
        browserContext = this.browser.browserContexts().find(browserContext => browserContext.id === browserContextId);
        
        // if browser crashed we may have old browser context id in the DB so it wont be in the browser context list
        // well make a new browser context and save it to the DB
        if (!browserContext) {
          logger.warn(`Browser context: ${browserContext.id} is not in the browser context list`);
          logger.warn(`Browser may have crashed, creating new browser context`);
          browserContext = await this.createBrowserContext();
          await this.dataAccessManager.saveOrUpdateBrowserId(userPhoneNumber, browserContextId);


        }
        return browserContext;
    } 
    catch (err) {
      logger.customError(err);
    }
  }



  async getChatGPTResponse(userPhoneNumber,userTextMessage) {

    const browserContext = await this.getBrowserContext(userPhoneNumber);
    await this.navigateToPageWithNewBrowserContext(browserContext, "https://chat.openai.com/");
    const chatGPTAnswer = await this.sendChat(browserContext,userTextMessage);

    return chatGPTAnswer + " - GPT3";

  }

  async sendChat(browserContext,userTextMessage) {

    const pages = await browserContext.pages();
    const page = pages[0];
    await page.waitForSelector('textarea');
    await page.type('textarea', userTextMessage);
    await page.keyboard.press('Enter');

    const selector = 'div.result-streaming';
    logger.info("Waiting for chatGPT to finish typing");
    await page.waitForFunction(selector => !document.querySelector(selector),{ timeout: 60000 },selector);



    logger.info("Getting chatGPT answer");
    const textBoxes = await page.$$(".flex.flex-col.items-center > div");
    const text = await page.evaluate(el => el.innerText, textBoxes[textBoxes.length - 2]);


    return text;
  }

  // function to login to the chatbot if the browser context is new
  async login(page,loginButton){

    await loginButton.click();
    await page.waitForNavigation();

    const username = await page.waitForSelector('input[name="username"]');
    await username.type('olajideogun123@gmail.com');
    await page.click('button[type="submit"]');
    // await page.waitForNavigation();

    //handle captcha here
    

    const password = await page.waitForSelector('input[name="password"]');
    await password.type('VBHTinV#.%5JUyL');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    // logger.info(page.frames());

    // await page.waitForSelector("#headlessui-dialog-panel-\:r1\:");
    // await page.click("#headlessui-dialog-panel-\:r1\: > div.prose.dark\:prose-invert > div.flex.gap-4.mt-6 > button");

    // await page.waitForSelector("#headlessui-dialog-panel-\:r1\: > div.prose.dark\:prose-invert > div.flex.gap-4.mt-6 > button.btn.flex.gap-2.justify-center.btn-neutral.ml-auto", {visible: false});
    // await page.click("#headlessui-dialog-panel-\:r1\: > div.prose.dark\:prose-invert > div.flex.gap-4.mt-6 > button.btn.flex.gap-2.justify-center.btn-neutral.ml-auto");

    // .btn-neutral:focus-visible

    // const next1 = await page.waitForXPath("/html/body/div[2]");
    // if (next1) {
    //   const [x]  = await next1.$x('//*[@id="headlessui-dialog-panel-:r1:"]/div[2]/div[4]/button');
    //   await x.click();
    // }



    


    // await page.click('button[type="submit"]');
    

    // const [next2] = await page.$x("//button[contains(., 'Next')]");
    // await next2.click();

    // const [next3] = await page.$x("//button[contains(., 'Next')]");
    // await next3.click();


  }

  

  /**
     * this method uses the user phonenumber to retireve their browserContextId from the database
     * if its not in DB then we create a new browserContext and save it to the DB
     * we then load the browserContext and return it
     * Pupp
     * @param {puppeteer.BrowserContext} browserContext
     * @param {string} url
     */
  async navigateToPageWithNewBrowserContext(browserContext, url) {

    const pages = await browserContext.pages();
    let page;

    // we have a page already open so we can use it
    if (pages.length > 0){
      logger.info("Using old page");      
     return;
    }
    else {
      // we need to create a new page
      logger.info("Going to new page");
      page = await browserContext.newPage();
      const ua = "'Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0'";
      await page.setExtraHTTPHeaders({"Accept-Language": "en-US,en;q=0.9"});
      await page.setUserAgent(ua);

      await page.setRequestInterception(true);

      //if the page makes a  request to a resource type of image then abort that request
      page.on('request', request => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || request.resourceType() === 'media')
            request.abort();
        else
            request.continue();
      });

      await page.goto(url);
      
    }
    
    // i have to check if captcha is present
    // if it is then i have to do captcha


    const [loginButton] = await page.$x("//button[contains(., 'Log in')]");
    const [signUpButton] = await page.$x("//button[contains(., 'Sign up')]");

    // want to check if login button or sign up button is present on the page
    if (loginButton || signUpButton) {
      logger.info("Logging in");
      await this.login(page,loginButton);
    }
   
    

  }
}

module.exports = ChatGPT;



// / Delete all documents in the collection that have a 'status' field equal to any of the specified values
  // await collection.deleteMany({ status: { $in: statuses } });
  // Delete all documents in the 'my-collection' collection that have a 'status' field equal to 'expired' or 'canceled'
// clearCollection('my-collection', ['expired', 'canceled']);


// Delete all documents in the collection that match the filter
// await collection.deleteMany(filter);
// Delete all documents in the 'my-collection' collection that have a 'status' field equal to 'expired'
// clearCollection('my-collection', { status: 'expired' });