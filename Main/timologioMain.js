import { createDriver } from "../Base/driverSetUp.js";
import { By, Select, until, Key } from "selenium-webdriver";
import { getConfig } from '../Utils/config.js';
import { locators } from "../Base/locators.js";
import fs from 'fs';

const config = getConfig();
let driver = await createDriver();

// Needed for an extra step in payment in advance.
let commentBoolean = false;

(async function main() {
    await login();
    await newCustomer();
    await invoice(config.priceWithTax);
    if (config.paymentInAdvanced) {
        commentBoolean = true;
        await invoice(config.advancedPaymentWithTax);
    }
    await taxInvoice(config.priceWithTax);
})();

// Logins to eTimologio with credentials.
async function login() {
    await driver.get(config.url);
    await driver.findElement(locators.userNameField).sendKeys(config.credentials.username);
    await driver.findElement(locators.vatNumbField).sendKeys(config.credentials.vatNumber);
    await driver.findElement(locators.subKeyField).sendKeys(config.credentials.subKey);
    await driver.findElement(locators.loginButton).click();
}

// ADDS & saves a new customer.
async function newCustomer() {
    // Customer Menu.
    await driver.findElement(locators.customersButton).click();
    await driver.findElement(locators.newCustomerButton).click();
    // Fills new customers parameters and saves customer.
    await selectFunc(locators.typeOfCustomerField, "1");
    await selectFunc(locators.customersCountryField, config.customersCountry);
    await driver.findElement(locators.customersNameField).sendKeys(config.customersName);
    await driver.findElement(locators.customersCityField).sendKeys("-");
    await driver.findElement(locators.customersZipCodeField).sendKeys("-");
    await driver.findElement(locators.customerSaveButton).click();
}

// Creates an invoice (called on main payment and on payment in advanced)
async function invoice(price) {

    await driver.findElement(locators.invoiceButton).click();
    await driver.findElement(locators.newInvoiceButton).click();

    await selectFunc(locators.typeOfInvoice, config.invoiceMain);
    await selectFunc(locators.seriesField, config.series);
    await driver.findElement(locators.customersNameFieldInvoice).sendKeys(config.customersName);
    const nameAutoComplete = await driver.findElement(locators.autoCompleteSelect);
    await driver.wait(until.elementIsEnabled(nameAutoComplete), 2000).click();
    await selectFunc(locators.paymentMethodField, config.paymentMethod);

    await driver.findElement(locators.addServiceButton).click();
    await selectFunc(locators.serviceTypeField, config.serviceProvision);
    await driver.sleep(1000);
    await selectFunc(locators.vatPercentageField, config.vatPercentage);
    let priceString;
    if (config.vatPercentage == "2") {
        priceString = parseFloat(parseFloat(price) / 1.13).toFixed(2).toString();
    } else if (config.vatPercentage == "7") {
        priceString = parseFloat(parseFloat(price)).toFixed(2).toString();
        await selectFunc(locators.vatExceptionField, config.vatExceptionType);
    }
    const priceField = await driver.findElement(locators.priceField);
    await priceField.sendKeys(Key.BACK_SPACE);
    await priceField.sendKeys(priceString);
    await driver.findElement(locators.serviceSaveButton).click();

    // For advanced payment invoice need to add a comment.
    if (commentBoolean) {
        await driver.findElement(locators.invoiceCommentButton).click();
        await driver.findElement(locators.invoiceCommentField).sendKeys(config.invoiceComment);
    }
    await tempSave();
}

// Creates a tax invoice.
async function taxInvoice(price) {
    // Invoice Menu.
    await driver.findElement(locators.invoiceButton).click();
    await driver.findElement(locators.newInvoiceButton).click();
    // Fills invoice main parameters.
    await selectFunc(locators.typeOfInvoice, config.invoiceTax);
    await selectFunc(locators.seriesField, "-");
    await driver.findElement(locators.customersNameFieldInvoice).sendKeys(config.customersName);
    const nameAutoComplete = await driver.findElement(locators.autoCompleteSelect);
    await driver.wait(until.elementIsEnabled(nameAutoComplete), 2000).click();
    await driver.findElement(locators.vatInvoiceField).sendKeys(config.vatDummyParam);
    await selectFunc(locators.paymentMethodField, config.paymentMethod);
    // Adds a zero service with taxCategory comment and saves it.
    await driver.findElement(locators.addServiceButton).click();
    await selectFunc(locators.serviceTypeField, config.serviceTax);
    await driver.sleep(700);
    await driver.findElement(locators.commentButton).click();
    await selectFunc(locators.categoryButton, config.taxCategoryComment);
    await driver.sleep(700);
    await driver.findElement(locators.commentSaveButton).click();
    await driver.sleep(700);
    await driver.findElement(locators.serviceSaveButton).click();
    await driver.sleep(700);
    // Adds the tax with to the invoice.
    const newTaxButton = await driver.findElement(locators.newTaxButton);
    await driver.wait(until.elementIsEnabled(newTaxButton), 2000).click();
    await selectFunc(locators.taxTypeField, config.taxType);
    await selectFunc(locators.taxCategoryField, config.taxCategory);
    const priceField = await driver.findElement(locators.priceField2);
    await priceField.click();
    await driver.actions().keyDown(Key.CONTROL).sendKeys("a").keyUp(Key.CONTROL).sendKeys(Key.BACK_SPACE).perform();
    let priceString;
    if (config.vatPercentage == "2") {
        priceString = parseFloat(parseFloat(price) / 1.13).toFixed(2).toString();
    } else if (config.vatPercentage == "7") {
        priceString = parseFloat(parseFloat(price)).toFixed(2).toString();
    }
    await priceField.sendKeys(priceString);
    const taxAmountButton = await driver.findElement(locators.taxPriceField);
    await taxAmountButton.sendKeys(Key.BACK_SPACE);
    await taxAmountButton.sendKeys(config.taxPrice);
    await driver.findElement(locators.taxSaveButton).click();
    // Saves the invoice as a temp invoice.
    await tempSave();
}

// Save invoice as temp and returns main page.
async function tempSave(){
    const finalSubmitBtn = await driver.findElement(locators.tempInvoiceSaveButton);
    await driver.sleep(1000);
    await finalSubmitBtn.click();
    await driver.sleep(700);
    await driver.findElement(locators.acceptTempButton).click();
    await driver.sleep(700);
    await driver.findElement(locators.finalOkButton).click();
    await driver.sleep(800);
    const logoImg = await driver.findElement(locators.logoImg);
    await logoImg.click();
}

// Locator should be as in a findElement func if not from, selectValue works only with selectByValue parameter.
async function selectFunc(locator, selectValue) {
    let elementType = await driver.findElement(locator);
    await driver.wait(until.elementIsVisible(elementType), 2000);
    let elementSelect = new Select(elementType);
    await elementSelect.selectByValue(selectValue);
}
