export declare type OHLCType = {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
};
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
    static macd(rates: number[], fast_ma?: number, slow_ma?: number, signal?: number): number[][];
    /**
     * Returns the chaikin for given ohlc input. It's used to measure if there
     * is increasing or decreasing movement in volume.
     *
     * @param ohlc list of ohlc data
     * @param n number of periods (default: 21)
     */
    static chaikin(ohlc: OHLCType[], n?: number): number[];
    /**
     * Returns the RSI of given ohlc input. RSI indicates if the market
     * is overselled or overbuyed.
     *
     * @param ohlc list of ohlc data
     * @param n number of periods (default: 14)
     */
    static rsi(ohlc: OHLCType[], n?: number): number[];
}
