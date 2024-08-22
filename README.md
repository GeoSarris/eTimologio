# eTimologio

Repository contents:
    Base\driverSetUp.js:
        Creates a driver for either chrome, firefox or edge browser.
    Base\locators.js
        Contains all the locators for the elements that are used in eTimologio page.
    Resources\config.json
        Contains all parameters and credentials needed for the login and the fill of certain
        fields used in the script. Credentials are blank because of sensitive data. The values 
        that the parameters can take are at line --.
    Utils\config.js
        Reads the config.json file and make an export so it can be accessed with import.
    Main\timologioMain.js
        The main script used to create the invoices and save them.
        First step: Logs in with the credentials
        Second step: Creates the main invoice.
        Thrird step (optional): Creates the invoice of a advanced payment.
        Fourth step: Creates the tax invoice.
        (The script doesn't auto exit on purpose.)
    
Available values for used parameters:
    "customersCountry": "GR" -> Greece, "BG" -> Bulgaria, "RO" -> Romania, "RS" -> Serbia,
                        "MK" -> North Macedonia, "SI" -> Slovenia, "DE" -> Germany  
                         (Mainly used)
    "customersName": "Example" Name is converted to Capitals
    "invoiceMain": "58"-> 11.2 Invoice of service
    "invoiceTax": "56" -> 8.2  Tax of climate sustainability.
    "series": "-" , "A" For this project (Customable html variables)
    "paymentMethod": "1" -> Buissenes Account Native, "2" -> Buissenes Account Foreigner, 
                     "3" -> Cash , "4" -> Check , "5" -> On credit, "6" -> Web Banking, 
                     "7" -> POS / e-pOS "8" -> Iris
    "serviceProvision": "1" -> Service Provision (Customable  html variable)
    "serviceTax": "100" -> Tax (Customable html variable)
    "priceWithTax": "500" -> the values is divided by the vat percentage.
    "vatPercentage": "1" -> 24%, "2" -> 13%, "3" -> 6%, "4" -> 17%, "5" -> 9%, "6" -> 4%, 
                     "7" -> 0%, "8" -> With out Vat , "9" -> 3% (αρ.31 ν.5057/2023),
                     "10" -> 4% (αρ.31 ν.5057/2023)
    "vatExceptionType": "16" -> Χωρίς ΦΠΑ - άρθρο 39α του Κώδικα ΦΠΑ 
                         (Valuves 1-31 depends on exception)
    "vatDummyParam": "000000000" 
    "paymentInAdvanced": true (If set to true invoice for advanced payments is created)
    "advancedPaymentWithTax": "200" -> the values is divided by the vat percentage.
    "taxCategoryComment": "category1_95" , "category1_7"
    "invoiceComment": "Προκαταβολή" 
    "taxType": Values 1-5  
    "taxCategory": "10" -> Renting rooms, (Values 3-30 read html for categories)
    "taxPrice": "20"