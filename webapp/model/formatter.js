sap.ui.define([], function () {
    "use strict";

    var Formatter = {
        commoncal: function (avalue) {
            var oFormatOptions = {
                minIntegerDigits: 3,
                maxIntegerDigits: 10,
                minFractionDigits: 2,
                maxFractionDigits: 2
            };
            var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);
            return oFloatFormat.format(avalue);
        },

        commoncurrency: function (value, code) {
            var oCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
                currencyCode: false
            });
            return oCurrencyFormat.format(value) + " " + code;
        },

        formatCurrencyInINRText: function (sValue) {
            if (sValue) {
                let INRValue = sValue;
                let code = "INR";
                return Formatter.commoncurrency(INRValue, code);
            }
        },
    };

    return Formatter;
});
