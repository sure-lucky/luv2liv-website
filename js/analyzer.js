document.addEventListener('DOMContentLoaded', () => {
    // Only run if we are on the analyzer page
    if (!document.getElementById('purchasePrice')) return;

    const inputs = {
        purchasePrice: document.getElementById('purchasePrice'),
        downPayment: document.getElementById('downPayment'),
        interestRate: document.getElementById('interestRate'),
        loanTerm: document.getElementById('loanTerm'),
        grossRent: document.getElementById('grossRent'),
        propertyTaxes: document.getElementById('propertyTaxes'),
        insurance: document.getElementById('insurance'),
        hoa: document.getElementById('hoa'),
        maintenance: document.getElementById('maintenance'),
        managementFee: document.getElementById('managementFee'),
    };

    const displays = {
        purchasePrice: document.getElementById('purchasePriceVal'),
        downPayment: document.getElementById('downPaymentVal'),
        interestRate: document.getElementById('interestRateVal'),
        loanTerm: document.getElementById('loanTermVal'),
        grossRent: document.getElementById('grossRentVal'),
        maintenance: document.getElementById('maintenanceVal'),
        managementFee: document.getElementById('managementFeeVal'),
    };

    const results = {
        loanAmount: document.getElementById('res-loanAmount'),
        pi: document.getElementById('res-pi'),
        expenses: document.getElementById('res-expenses'),
        noi: document.getElementById('res-noi'),
        cashflow: document.getElementById('res-cashflow'),
        caprate: document.getElementById('res-caprate'),
        coc: document.getElementById('res-coc'),
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
    };

    const formatPercent = (num) => {
        return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num / 100);
    };

    const calculate = () => {
        // Get values
        const price = parseFloat(inputs.purchasePrice.value) || 0;
        const dpPercent = parseFloat(inputs.downPayment.value) || 0;
        const ratePercent = parseFloat(inputs.interestRate.value) || 0;
        const years = parseFloat(inputs.loanTerm.value) || 0;
        const rent = parseFloat(inputs.grossRent.value) || 0;
        const taxes = parseFloat(inputs.propertyTaxes.value) || 0;
        const ins = parseFloat(inputs.insurance.value) || 0;
        const hoaFee = parseFloat(inputs.hoa.value) || 0;
        const maintPercent = parseFloat(inputs.maintenance.value) || 0;
        const mgmtPercent = parseFloat(inputs.managementFee.value) || 0;

        // Update display values next to labels for range sliders
        if(displays.purchasePrice) displays.purchasePrice.textContent = formatCurrency(price);
        if(displays.downPayment) displays.downPayment.textContent = `${dpPercent}%`;
        if(displays.interestRate) displays.interestRate.textContent = `${ratePercent}%`;
        if(displays.loanTerm) displays.loanTerm.textContent = `${years} yrs`;
        if(displays.grossRent) displays.grossRent.textContent = formatCurrency(rent);
        if(displays.maintenance) displays.maintenance.textContent = `${maintPercent}%`;
        if(displays.managementFee) displays.managementFee.textContent = `${mgmtPercent}%`;

        // Calculations
        const downPaymentAmt = price * (dpPercent / 100);
        const loanAmt = price - downPaymentAmt;
        
        // P&I calculation
        let pi = 0;
        if (loanAmt > 0 && ratePercent > 0 && years > 0) {
            const r = (ratePercent / 100) / 12;
            const n = years * 12;
            pi = loanAmt * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        // Monthly Expenses
        const monthlyTaxes = taxes / 12;
        const monthlyIns = ins / 12;
        const maintFee = rent * (maintPercent / 100);
        const mgmtFee = rent * (mgmtPercent / 100);

        const opEx = monthlyTaxes + monthlyIns + hoaFee + maintFee + mgmtFee;
        const totalExpenses = opEx + pi;

        // Income & Returns
        const monthlyNOI = rent - opEx;
        const annualNOI = monthlyNOI * 12;
        const monthlyCashFlow = rent - totalExpenses;
        const annualCashFlow = monthlyCashFlow * 12;

        const capRate = price > 0 ? (annualNOI / price) * 100 : 0;
        // Cash on Cash: If down payment is 0, they effectively have infinite/undefined return.
        // Usually, in real estate calculators, we show "N/A" or "Infinite" or just 0%. Let's default to 0.
        const coc = downPaymentAmt > 0 ? (annualCashFlow / downPaymentAmt) * 100 : 0;

        // Update DOM
        if(results.loanAmount) results.loanAmount.textContent = formatCurrency(loanAmt);
        if(results.pi) results.pi.textContent = formatCurrency(pi);
        if(results.expenses) results.expenses.textContent = formatCurrency(totalExpenses);
        if(results.noi) results.noi.textContent = `${formatCurrency(annualNOI)}/yr`;
        
        if(results.cashflow) {
            results.cashflow.textContent = formatCurrency(monthlyCashFlow);
            if (monthlyCashFlow > 0) {
                results.cashflow.className = 'result-value bold positive-cashflow';
            } else if (monthlyCashFlow < 0) {
                results.cashflow.className = 'result-value bold negative-cashflow';
            } else {
                results.cashflow.className = 'result-value bold'; // Neutral if exactly 0
            }
        }

        if(results.caprate) results.caprate.textContent = formatPercent(capRate);
        if(results.coc) {
            if (downPaymentAmt === 0) {
                results.coc.textContent = 'Infinite';
            } else {
                results.coc.textContent = formatPercent(coc);
            }
        }
    };

    // Attach event listeners to all inputs
    Object.values(inputs).forEach(input => {
        if (input) {
            input.addEventListener('input', calculate);
        }
    });

    // Initial calculation to populate fields on load
    calculate();
});
