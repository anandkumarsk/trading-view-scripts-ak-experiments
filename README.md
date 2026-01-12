# trading-view-scripts-ak-experiments

## Pine Script: Top 10 % Change (Last 15 Minutes)

```pine
//@version=5
indicator("Top 10 % Change (Last 15 Minutes)", overlay=false, max_lines_count=500, max_labels_count=500)

// User-configurable list of symbols (set these to your desired tickers)
sym01 = input.symbol("NYSE:MSFT", "Symbol 1")
sym02 = input.symbol("NASDAQ:AAPL", "Symbol 2")
sym03 = input.symbol("NASDAQ:NVDA", "Symbol 3")
sym04 = input.symbol("NASDAQ:AMZN", "Symbol 4")
sym05 = input.symbol("NASDAQ:GOOGL", "Symbol 5")
sym06 = input.symbol("NASDAQ:META", "Symbol 6")
sym07 = input.symbol("NYSE:BRK.B", "Symbol 7")
sym08 = input.symbol("NYSE:JPM", "Symbol 8")
sym09 = input.symbol("NYSE:V", "Symbol 9")
sym10 = input.symbol("NYSE:JNJ", "Symbol 10")
sym11 = input.symbol("NASDAQ:TSLA", "Symbol 11")
sym12 = input.symbol("NYSE:UNH", "Symbol 12")
sym13 = input.symbol("NYSE:HD", "Symbol 13")
sym14 = input.symbol("NYSE:PG", "Symbol 14")
sym15 = input.symbol("NASDAQ:AVGO", "Symbol 15")
sym16 = input.symbol("NYSE:MA", "Symbol 16")
sym17 = input.symbol("NYSE:XOM", "Symbol 17")
sym18 = input.symbol("NYSE:CVX", "Symbol 18")
sym19 = input.symbol("NYSE:KO", "Symbol 19")
sym20 = input.symbol("NYSE:PFE", "Symbol 20")

symbols = array.from(
    sym01, sym02, sym03, sym04, sym05,
    sym06, sym07, sym08, sym09, sym10,
    sym11, sym12, sym13, sym14, sym15,
    sym16, sym17, sym18, sym19, sym20
)

var string[] topSymbols = array.new_string()
var float[] topChanges = array.new_float()

f_percent_change(_symbol) =>
    closeNow = request.security(_symbol, "1", close, barmerge.gaps_off, barmerge.lookahead_off)
    close15 = request.security(_symbol, "15", close[1], barmerge.gaps_off, barmerge.lookahead_off)
    na(closeNow) or na(close15) ? na : (closeNow - close15) / close15 * 100.0

f_insert_top(_sym, _chg) =>
    if not na(_chg)
        inserted = false
        for i = 0 to array.size(topChanges) - 1
            if _chg > array.get(topChanges, i)
                array.insert(topChanges, i, _chg)
                array.insert(topSymbols, i, _sym)
                inserted := true
                break
        if not inserted
            array.push(topChanges, _chg)
            array.push(topSymbols, _sym)
        if array.size(topChanges) > 10
            array.pop(topChanges)
            array.pop(topSymbols)

if barstate.islastconfirmedhistory or barstate.islast
    array.clear(topSymbols)
    array.clear(topChanges)
    for i = 0 to array.size(symbols) - 1
        sym = array.get(symbols, i)
        chg = f_percent_change(sym)
        f_insert_top(sym, chg)

var table t = table.new(position.top_right, 2, 11, frame_color=color.new(color.gray, 60))

if barstate.islastconfirmedhistory or barstate.islast
    table.clear(t)
    table.cell(t, 0, 0, "Symbol", bgcolor=color.new(color.gray, 80), text_color=color.white)
    table.cell(t, 1, 0, "% Change", bgcolor=color.new(color.gray, 80), text_color=color.white)
    for i = 0 to math.min(9, array.size(topSymbols) - 1)
        sym = array.get(topSymbols, i)
        chg = array.get(topChanges, i)
        table.cell(t, 0, i + 1, sym, text_color=color.white)
        table.cell(t, 1, i + 1, str.tostring(chg, format.percent), text_color=chg >= 0 ? color.lime : color.red)
```

Notes:
- Pine scripts cannot scan the entire market; this script ranks only the symbols you provide.
- It uses 1-minute and 15-minute data to compute the last 15 minutes of % change.
