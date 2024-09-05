import { createDriver } from "../Base/driverSetUp.js";
import { By, Select, until, Key } from "selenium-webdriver";
import { getConfig } from '../Utils/config.js';
import { locators } from "../Base/locators.js";

// Global variables.
const config = getConfig();
let driver = await createDriver();
let priceString;

// Needed for an extra step in payment in advance.
let commentBoolean = false;

(async function main() {
    await login();
    await newCustomer();
    await invoice(config.priceWithVat);
    if (config.paymentInAdvanced) {
        commentBoolean = true;
        await invoice(config.advancedPaymentWithTax);
    }
    await taxInvoice(config.priceWithVat);
})();

// Logins to eTimologio with credentials.
async function login() {
    await driver.get(config.url);
    await driver.findElement(locators.userNameField).sendKeys(config.credentials.username);
    await driver.findElement(locators.vatNumbField).sendKeys(config.credentials.vatNumber);
    await driver.findElement(locators.subKeyField).sendKeys(config.credentials.subKey);
    await driver.findElement(locators.loginButton).click();
}

// Adds & saves a new customer.
async function newCustomer() {
    // Customer Menu.
    await driver.findElement(locators.customersButton).click();
    await driver.findElement(locators.newCustomerButton).click();
    // Fills new customers parameters and saves customer.
    await selectFunc(locators.typeOfCustomerField, "1");
    await selectFunc(locators.customersCountryField, config.customersCountry);
    await driver.findElement(locators.customersNameField).sendKeys(config.customersName);
    // City and zip code is mandatory field, so - is used.
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
    const addInvoiceModal = await driver.findElement(locators.addInvoiceModal);
    await waitForModalToBeStable(addInvoiceModal, "block");
    await selectFunc(locators.serviceTypeField, config.serviceProvision);
    await priceCalculator(config.vatPercentage, price);
    const priceField = await driver.findElement(locators.priceField);
    await priceField.click();
    await priceField.sendKeys(Key.BACK_SPACE);
    await driver.wait(until.elementTextIs(priceField, ""), 2000);
    await priceField.sendKeys(priceString);
    await selectFunc(locators.vatPercentageField, config.vatPercentage);
    if (config.vatPercentage === "7") {
        await selectFunc(locators.vatExceptionField, config.vatExceptionType);
    }
    await driver.findElement(locators.serviceSaveButton).click();
    // For advanced payment invoice need to add a comment.
    if (commentBoolean) {
        await driver.findElement(locators.invoiceCommentButton).click();
        await driver.findElement(locators.invoiceCommentField).sendKeys(config.invoiceComment);
    }
    // Saves the invoice as a temp invoice.
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
    const addInvoiceModal = await driver.findElement(locators.addInvoiceModal);
    await waitForModalToBeStable(addInvoiceModal, "block");
    await selectFunc(locators.serviceTypeField, config.serviceTax);
    await driver.findElement(locators.commentButton).click();
    const classificationModal = await driver.findElement(locators.classificationModal);
    await waitForModalToBeStable(classificationModal, "block");
    await selectFunc(locators.categoryButton, config.taxCategoryComment);
    await driver.findElement(locators.commentSaveButton).click();
    await waitForModalToBeStable(addInvoiceModal, "block");
    await driver.findElement(locators.serviceSaveButton).click();

    // Adds the tax with to the invoice.
    const newTaxButton = await driver.findElement(locators.newTaxButton);
    await driver.wait(until.elementIsEnabled(newTaxButton), 2000).click();
    await selectFunc(locators.taxTypeField, config.taxType);
    await selectFunc(locators.taxCategoryField, config.taxCategory);
    const priceField = await driver.findElement(locators.priceField2);
    await priceField.click();
    await driver.actions().keyDown(Key.CONTROL).sendKeys("a").keyUp(Key.CONTROL).sendKeys(Key.BACK_SPACE).perform();
    await priceCalculator(config.vatPercentage, price)
    await priceField.sendKeys(priceString);
    const taxAmountButton = await driver.findElement(locators.taxPriceField);
    await taxAmountButton.sendKeys(Key.BACK_SPACE);
    await taxAmountButton.sendKeys(config.taxPrice);
    await driver.findElement(locators.taxSaveButton).click();

    // Saves the invoice as a temp invoice.
    await tempSave();
}

// Common function for saving documents.
async function tempSave() {
    await driver.wait(until.urlIs("https://mydata.aade.gr/timologio/invoice/newinvoice"), 2000);

    const finalSubmitBtn = await driver.findElement(locators.tempInvoiceSaveButton);
    await driver.findElement(locators.backToTopButton).click();
    await driver.wait(until.elementIsVisible(finalSubmitBtn), 2000);
    await finalSubmitBtn.click();

    // First modal pop-up
    const firstModal = await driver.findElement(locators.firstModal);
    await waitForModalToBeStable(firstModal, "block");
    const acceptTempButton = await driver.findElement(locators.acceptTempButton);
    await acceptTempButton.click();
    await driver.wait(until.stalenessOf(firstModal), 5000);

    // Second modal pop-up
    const secondModal = await driver.findElement(locators.secondModal);
    await waitForModalToBeStable(secondModal, "flex");
    await driver.sleep(600); // Sleep functions is needed.
    const finalOkButton = await driver.findElement(locators.finalOkButton);
    await driver.wait(until.elementIsEnabled(finalOkButton), 2000);
    await finalOkButton.click();

    const logoImg = await driver.findElement(locators.logoImg);
    await driver.wait(until.elementIsVisible(logoImg), 2000);
    await logoImg.click();
}

// Common function for calculating the price without vat, depending on the vatPercentage.
async function priceCalculator(vatPercentage, price) {
    switch (vatPercentage) {
        case "1":
            priceString = parseFloat(parseFloat(price) / 1.24).toFixed(2).toString();
            break;
        case "2":
            priceString = parseFloat(parseFloat(price) / 1.13).toFixed(2).toString();
            break;
        case "3":
            priceString = parseFloat(parseFloat(price) / 1.06).toFixed(2).toString();
            break;
        case "4":
            priceString = parseFloat(parseFloat(price) / 1.17).toFixed(2).toString();
            break;
        case "5":
            priceString = parseFloat(parseFloat(price) / 1.09).toFixed(2).toString();
            break;
        case "6" || "10":
            priceString = parseFloat(parseFloat(price) / 1.04).toFixed(2).toString();
            break;
        case "7" || "8":
            priceString = parseFloat(parseFloat(price)).toFixed(2).toString();
            break;
        case "9":
            priceString = parseFloat(parseFloat(price) / 1.03).toFixed(2).toString();
            break;
        case "10":
            priceString = parseFloat(parseFloat(price) / 1.24).toFixed(2).toString();
            break;
    }
}

// Common select function.
// Locator should be as in a findElement func if not from, selectValue works only with selectByValue parameter.
async function selectFunc(locator, selectValue) {
    let elementType = await driver.findElement(locator);
    await driver.wait(until.elementIsVisible(elementType), 2000);
    let elementSelect = new Select(elementType);
    await elementSelect.selectByValue(selectValue);
}

// Common waiting function for modals to be stable.
// typeOfDisplay is either flex or block, as a String variable, depending on the modal element.
async function waitForModalToBeStable(modalElement, typeOfDisplay) {
    await driver.wait(async function () {
        const display = await modalElement.getCssValue('display');
        const opacity = await modalElement.getCssValue('opacity');
        const visibility = await modalElement.getCssValue('visibility');

        //console.log(`Display: ${display}, Opacity: ${opacity}, Visibility: ${visibility}`); // Debugging output

        return display === typeOfDisplay && opacity === '1' && visibility === 'visible';
    }, 3000);

}