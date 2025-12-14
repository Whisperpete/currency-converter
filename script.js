// --- Element Selection ---
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const convertButton = document.getElementById('convert-btn');
const swapButton = document.getElementById('swap-btn');
const resultMessage = document.getElementById('result-message');
const errorMessage = document.getElementById('error-message');

// --- API Endpoint ---
const API_URL = 'https://api.frankfurter.dev';

// --- Helper Functions ---

/**
 * Shows an error message and hides the result message.
 * @param {string} message The error text to display.
 */
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    resultMessage.style.display = 'none';
    convertButton.disabled = false;
}

/**
 * Shows the result message and hides the error message.
 * @param {string} message The result text to display.
 */
function displayResult(message) {
    resultMessage.textContent = message;
    resultMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    convertButton.disabled = false;
}

/**
 * Fetches the list of available currency symbols and populates the dropdowns.
 */
async function getCurrencies() {
    try {
        const response = await fetch(`${API_URL}/currencies`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Object.keys(data) returns an array of currency codes (e.g., ['AUD', 'BGN', ...])
        const currencyCodes = Object.keys(data).sort(); 

        currencyCodes.forEach(code => {
            const option1 = document.createElement('option');
            option1.value = code;
            option1.textContent = `${code} - ${data[code]}`;
            
            const option2 = document.createElement('option');
            option2.value = code;
            option2.textContent = `${code} - ${data[code]}`;
            
            fromCurrencySelect.appendChild(option1);
            toCurrencySelect.appendChild(option2);
        });

        // Set default values after population
        fromCurrencySelect.value = 'USD'; 
        toCurrencySelect.value = 'EUR';

    } catch (error) {
        console.error('Error fetching currencies:', error);
        displayError('Could not load currency list. Check your network or API status.');
    }
}


/**
 * Converts the currency based on user input.
 */
async function convertCurrency() {
    // 1. Clear previous messages and disable button
    resultMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    convertButton.disabled = true;
    
    // 2. Validate input
    const amount = parseFloat(amountInput.value);
    const from = fromCurrencySelect.value;
    const to = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        return displayError('Please enter a valid amount greater than zero.');
    }

    if (from === to) {
        return displayResult(`${amount.toFixed(2)} ${from} is equal to ${amount.toFixed(2)} ${to}.`);
    }

    // 3. Fetch conversion rate from API
    try {
        // API format: /latest?from=USD&to=EUR
        const response = await fetch(`${API_URL}/latest?from=${from}&to=${to}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 4. Check for API-specific error (though Frankfurter is simple)
        if (!data.rates || !data.rates[to]) {
             throw new Error('API response was missing exchange rate data.');
        }

        // 5. Calculate and display result
        const rate = data.rates[to];
        const convertedAmount = amount * rate;

        const formattedAmount = convertedAmount.toFixed(2);
        
        // Use Intl.NumberFormat to format the result for better readability (optional)
        const formatter = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: to,
        });

        const formattedResult = formatter.format(convertedAmount);
        
        displayResult(`${amount.toFixed(2)} ${from} is approximately ${formattedResult}`);

    } catch (error) {
        console.error('Conversion failed:', error);
        displayError('Conversion failed. Please try again or check the API status.');
    } finally {
        convertButton.disabled = false;
    }
}

/**
 * Swaps the 'From' and 'To' currency values.
 */
function swapCurrencies() {
    const tempValue = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = tempValue;
    // Re-run conversion automatically after swap
    convertCurrency();
}

// --- Event Listeners ---
convertButton.addEventListener('click', convertCurrency);
swapButton.addEventListener('click', swapCurrencies);

// --- Initialization ---
// Load the currency list when the page loads
getCurrencies();

// The YouTube video walks through the steps of creating a currency converter using HTML, CSS, and JavaScript, which directly relates to your request.
[Build a Currency Converter with HTML CSS JavaScript (Live API) - YouTube](https://m.youtube.com/watch?v=3BSA4zxbov8)


http://googleusercontent.com/youtube_content/0
