
/**
 * KlarnaAsLowAs Constructor to calcualte pay from amount
 * @param {Number} price 
 */
function KlarnaAsLowAs(price) {
    this.apr                     = 0.0099; // APR in decimal form (0.99%)
    this.maxLimit                = 999;    // Upper bounds
    this.minLimit                = 149;    // Lower bounds
    this.sixMonthLimit           = 300;    // Upper limit for 6 months financing.
    this.price                   = parseFloat(price);
}

/**
 * Get payfrom object with details on amount or an error if criteria isnt met. 
 * @return {Object} 
 */
KlarnaAsLowAs.prototype.calculate = function() {
    var total = this.price;
    var months = total >= this.sixMonthLimit ? 12 : 6;
    var apr = this.apr;
    var dailyRate = apr / 365;
    var monthlyRate = apr / 12;

    var monthlyAmount = Math.ceil( 
        (((total * 1.045) * monthlyRate * (months / 1.85)) + (total * (31) * dailyRate) + total) / months
    );

    var monthlyFinanceCharge = monthlyAmount - (total / months);
    
    if (total < this.minLimit || total > this.maxLimit) {
        return {
            error: 'Amount not eligible.'
        };
    }

    return {
        monthlyAmount : monthlyAmount,
        months: months,
        estTotal: months * monthlyAmount
    };
};

function init(){
    var prices = Array.prototype.slice.call(document.querySelectorAll('[data-as-low-as]'));

    // Go through every price on page and see if it meets criteria. 
    prices.forEach( function(el) {
        var price = el.getAttribute('data-as-low-as');
        var asLowAs = new KlarnaAsLowAs(price);
        var asLowAsAmount = asLowAs.calculate();
        var template;

        if (!asLowAsAmount.hasOwnProperty('error')) {
            template = '<div class="pay-from"> As low as $' + asLowAsAmount.monthlyAmount + '/month*<br><span class="pay-from-disclaimer">*Provided by Klarna for qualifying customers.</span></div>';
            el.insertAdjacentHTML('afterend', template);
        }

        console.log(asLowAsAmount);
    });
}


init();
