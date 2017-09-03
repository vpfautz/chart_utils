"use strict";
exports.__esModule = true;
var Chart = /** @class */ (function () {
    function Chart() {
    }
    /**
     * Calculates MACD for given rates. It's used to give some idea of the
     * current trend.
     *
     * @param rates Array of rates
     * @param fast_ma Fast MA Period (default: 12)
     * @param slow_ma Slow MA Period (default: 26)
     * @param signal Signal Period (default: 9)
     */
    Chart.macd = function (rates, fast_ma, slow_ma, signal) {
        if (fast_ma === void 0) { fast_ma = 12; }
        if (slow_ma === void 0) { slow_ma = 26; }
        if (signal === void 0) { signal = 9; }
        var ema_fast = rates[0];
        var ema_slow = rates[0];
        var sig = ema_slow - ema_fast;
        var ew_fast = 2 / (fast_ma + 1);
        var ew_slow = 2 / (slow_ma + 1);
        var ew_signal = 2 / (signal + 1);
        var macd = [];
        for (var _i = 0, rates_1 = rates; _i < rates_1.length; _i++) {
            var p = rates_1[_i];
            ema_fast = (p - ema_fast) * ew_fast + ema_fast;
            ema_slow = (p - ema_slow) * ew_slow + ema_slow;
            var macd_ = ema_fast - ema_slow;
            sig = (macd_ - sig) * ew_signal + sig;
            macd.push([macd_, sig]);
        }
        return macd;
    };
    /**
     * Returns the chaikin for given ohlc input. It's used to measure if there
     * is increasing or decreasing movement in volume.
     *
     * @param ohlc list of ohlc data
     * @param n number of periods (default: 21)
     */
    Chart.chaikin = function (ohlc, n) {
        if (n === void 0) { n = 21; }
        // calculate AD_t
        var ad = [];
        for (var _i = 0, ohlc_1 = ohlc; _i < ohlc_1.length; _i++) {
            var d = ohlc_1[_i];
            if (d.h == d.l) {
                ad.push(0);
            }
            else {
                ad.push(((d.c - d.l) - (d.h - d.c)) / (d.h - d.l) * d.v);
            }
        }
        var cmf = [];
        for (var t = 0; t < ohlc.length; t++) {
            var ad_sum = 0;
            var v_sum = 0;
            // TODO optimize with prefix sum
            for (var i = 0; i < Math.min(t + 1, n); i++) {
                ad_sum += ad[t - i];
                v_sum += ohlc[t - i].v;
            }
            cmf.push(ad_sum / v_sum);
        }
        return cmf;
    };
    /**
     * Returns the RSI of given ohlc input. RSI indicates if the market
     * is overselled or overbuyed.
     *
     * @param ohlc list of ohlc data
     * @param n number of periods (default: 14)
     */
    Chart.rsi = function (ohlc, n) {
        if (n === void 0) { n = 14; }
        var rsi = [];
        var gain = function (d) { return d.c > d.o ? d.c - d.o : 0; };
        var loss = function (d) { return d.c < d.o ? d.o - d.c : 0; };
        var avg_gain = gain(ohlc[0]);
        var avg_loss = loss(ohlc[0]);
        for (var _i = 0, ohlc_2 = ohlc; _i < ohlc_2.length; _i++) {
            var d = ohlc_2[_i];
            avg_gain = ((n - 1) * avg_gain + gain(d)) / n;
            avg_loss = ((n - 1) * avg_loss + loss(d)) / n;
            if (avg_loss == 0)
                avg_loss = 1e-10;
            var rs = avg_gain / avg_loss;
            rsi.push(100 - 100 / (1 + rs));
        }
        return rsi;
    };
    return Chart;
}());
exports["default"] = Chart;
