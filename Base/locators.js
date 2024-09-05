import { By } from 'selenium-webdriver'

const locators = {
    // Login locators
    userNameField: By.id("UserName"),
    vatNumbField: By.id("VatNumber"),
    subKeyField: By.id("SubscriptionKey"),
    loginButton: By.xpath("//input[@value='Είσοδος / Login']"),

    // Customer Menu locators
    customersButton: By.id("customersMenu"),
    newCustomerButton: By.id("submenu_newcustomer"),
    // Customer parameters locators
    typeOfCustomerField: By.id("CustomerType"),
    customersCountryField: By.id("Country"),
    customersNameField: By.id("CustomerName"),
    customersCityField: By.id("CustomerCity"),
    customersZipCodeField: By.id("CustomerZipCode"),
    customerSaveButton: By.id("btnSave"),

    // Invoice Menu locators 
    invoiceButton: By.id("invoicesMenu"),
    newInvoiceButton: By.id("submenu_newinvoice"),
    // Invoice parameter's field locators
    typeOfInvoice: By.id("_invoiceType"),
    seriesField: By.id("series"),
    customersNameFieldInvoice: By.id("counterpartData"),
    vatInvoiceField: By.id("invCounterpart"),
    autoCompleteSelect: By.xpath("//ul[@id='ui-id-1']//child::li"),
    paymentMethodField: By.id("paymentType"),

    // Add service locator
    addServiceButton: By.id("btnNewInvoiceLine"),
    // Service parameters locators
    serviceTypeField: By.id("itemLine"),
    priceField: By.id("unitPrice"),
    vatPercentageField: By.id("vatPercentage"),
    vatExceptionField: By.id("vatExemptionCategory"),
    serviceSaveButton: By.id("btnAddLine"),

    // New comment modal locators (for serviceTax)
    commentButton: By.id("btnNewClassification"),
    categoryButton: By.id("clsCategory"),
    commentSaveButton: By.id("btnSaveClsList"),

    // New tax add locators 
    newTaxButton: By.id("btnTaxes"),
    taxTypeField: By.id("taxType"),
    taxCategoryField: By.id("taxCategory"),
    priceField2: By.id("underlyingValue"),
    taxPriceField: By.id("taxAmount"),
    taxSaveButton: By.id("btnAdd"),

    // Comment of invoice locator
    invoiceCommentButton: By.id("comObsLbl"),
    invoiceCommentField: By.id("invoiceNotes"),

    // Temp save locators
    tempInvoiceSaveButton: By.id("btnTempSaveInvoice"),
    backToTopButton: By.id("back-to-top"),
    acceptTempButton: By.xpath("//button[@class='btn btn-warning btn-sm rounded bootbox-accept']"),
    finalOkButton: By.xpath("//input[@value='OK']"),

    // Logo img for refresh
    logoImg: By.id("imgLogo"),

    // Modals for Invoices
    addInvoiceModal: By.xpath("//div[@name='addInvoiceLineModal']"),
    classificationModal: By.id("classificationModal"),
    
    // Modals for tempSave
    firstModal: By.xpath("//div[@class='bootbox modal fade bootbox-confirm show']"),
    secondModal: By.xpath("//div[@id='_msgboxdlgundefined']//div[@class='modal-dialog modal-dialog-scrollable']"),


};

export { locators }