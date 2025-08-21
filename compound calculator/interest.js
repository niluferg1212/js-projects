const prompt = require('prompt-sync')({ sigint: true });

function getNumber(ask) {
    while (true) {
        const input = prompt(ask);
        const number = parseFloat(input);
        if (!isNaN(number) && number > 0) {
            return number;
        } else {
            console.log("Please enter a positive number to proceed. Try again!");
        }
    }
}

console.log("Hello and thank you for using the Compound Interest Calculator!");

const principal = getNumber("Please input the principal amount (P):\n");
const interestRate = getNumber("Please input the interest rate (R) in percentage:\n") / 100;
const timePeriod = getNumber("Please input the time period (T):\n");

let interestTotal = 0;

for (let year = 1; year <= timePeriod; year++) {
    const interest = principal * interestRate;
    interestTotal += interest;
    principal += interest;
    console.log(`Year ${year}: Balance: $${principal.toFixed(2)}, Total Interest: $${interestTotal.toFixed(2)}`);
}

console.log(`Eventually, after ${timePeriod} years, your total balance is $${principal.toFixed(2)} and the total amount of interest added is $${interestTotal.toFixed(2)}.\n`);
