// 1. Get DOM elements
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const currencySelect = document.getElementById("currency");  // Currency select dropdown

// Last - Get saved transactions from localStorage
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// 2. Initialize app
let currentCurrency = 'USD'; // Default currency is USD
let currentSymbol = '$';  // Default symbol is $

function updateCurrencySymbol() {
  const selectedCurrency = currencySelect.value;
  currentSymbol = currencySelect.options[currencySelect.selectedIndex].getAttribute('data-symbol');
  
  // Update the balance, income, and expense with the selected currency
  updateValues();
}

// 3. Add Transaction
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = '';
    amount.value = '';
  }
}

// 4. Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// 5. Add Transactions to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}

// 6. Update Balance, Income, and Expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  // Update the balance and amounts with the correct currency symbol
  balance.innerText = `${currentSymbol}${total}`;
  money_plus.innerText = `${currentSymbol}${income}`;
  money_minus.innerText = `${currentSymbol}${expense}`;
}

// 7. Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  Init();
}

// 8. Update LocalStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 9. Init App
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// 10. Event Listeners
form.addEventListener('submit', addTransaction);

// Listen for currency change
currencySelect.addEventListener('change', updateCurrencySymbol);

// Initialize the app
Init();
