export type OHLCType = { o: number, h: number, l: number, c: number, v: number };

export default class Chart {

  /**
   * Calculates MACD for given rates. It's used to give some idea of the
   * current trend.
   * 
   * @param rates Array of rates
   * @param fast_ma Fast MA Period (default: 12)
   * @param slow_ma Slow MA Period (default: 26)
   * @param signal Signal Period (default: 9)
   */
  static macd(rates: number[], fast_ma = 12, slow_ma = 26, signal = 9): number[][] {
    let ema_fast = rates[0];
    let ema_slow = rates[0];
    let sig = ema_slow - ema_fast;
    let ew_fast = 2 / (fast_ma + 1);
    let ew_slow = 2 / (slow_ma + 1);
    let ew_signal = 2 / (signal + 1);
    let macd = []

    for (let p of rates) {
      ema_fast = (p - ema_fast) * ew_fast + ema_fast;
      ema_slow = (p - ema_slow) * ew_slow + ema_slow;
      let macd_ = ema_fast - ema_slow;
      sig = (macd_ - sig) * ew_signal + sig;
      macd.push([macd_, sig]);
    }

    return macd;
  }

  /**
   * Returns the chaikin for given ohlc input. It's used to measure if there
   * is increasing or decreasing movement in volume.
   * 
   * @param ohlc list of ohlc data
   * @param n number of periods (default: 21)
   */
  static chaikin(ohlc: OHLCType[], n = 21) {
    // calculate AD_t
    let ad: number[] = [];
    for (let d of ohlc) {
      ad.push(((d.c - d.l) - (d.h - d.c)) / (d.h - d.l) * d.v);
    }

    let cmf: number[] = []

    for (let t = 0; t < ohlc.length; t++) {
      let ad_sum = 0;
      let v_sum = 0;
      // TODO optimize with prefix sum
      for (let i = 0; i < Math.min(t + 1, n); i++) {
        ad_sum += ad[t - i];
        v_sum += ohlc[t - i].v;
      }
      cmf.push(ad_sum / v_sum);
    }

    return cmf;
  }

  /**
   * Returns the RSI of given ohlc input. RSI indicates if the market
   * is overselled or overbuyed.
   * 
   * @param ohlc list of ohlc data
   * @param n number of periods (default: 14)
   */
  static rsi(ohlc: OHLCType[], n = 14) {
    let rsi: number[] = [];
    let gain = (d: OHLCType) => d.c > d.o ? d.c - d.o : 0;
    let loss = (d: OHLCType) => d.c < d.o ? d.o - d.c : 0;
    let avg_gain = gain(ohlc[0]);
    let avg_loss = loss(ohlc[0]);
    for (let d of ohlc) {
      avg_gain = ((n - 1) * avg_gain + gain(d)) / n;
      avg_loss = ((n - 1) * avg_loss + loss(d)) / n;
      let rs = avg_gain / avg_loss;

      rsi.push(100 - 100 / (1 + rs));
    }

    return rsi;
  }
}
