var cs2Schemes = [];

var mcc = {
    black: new CS2ColorCode("#000000", "0"),
    dark_blue: new CS2ColorCode("#0000AA", "1"),
    dark_green: new CS2ColorCode("#00AA00", "2"),
    dark_aqua: new CS2ColorCode("#00AAAA", "3"),
    dark_red: new CS2ColorCode("#AA0000", "4"),
    dark_purple: new CS2ColorCode("#AA00AA", "5"),
    gold: new CS2ColorCode("#FFAA00", "6"),
    gray: new CS2ColorCode("#AAAAAA", "7"),
    dark_gray: new CS2ColorCode("#555555", "8"),
    blue: new CS2ColorCode("#5555FF", "9"),
    green: new CS2ColorCode("#55FF55", "a"),
    aqua: new CS2ColorCode("#55FFFF", "b"),
    red: new CS2ColorCode("#FF5555", "c"),
    light_purple: new CS2ColorCode("#FF55FF", "d"),
    yellow: new CS2ColorCode("#FFFF55", "e"),
    white: new CS2ColorCode("#FFFFFF", "f")
}

function randomHexColor() {
    var rndHex = '';
    for (let i = 0; i < 6; i++) rndHex += "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
    return rndHex;
}

//Random Scheme
var randomSchemeColors = [];
for (var co in mcc) randomSchemeColors.push(mcc[co]);
var randomScheme = new Scheme("Random", randomSchemeColors);
randomScheme.nextCode = function () {
    return this.codes[Math.floor(Math.random() * this.codes.length)];
}
cs2Schemes.push(randomScheme);

//Random Hex Scheme
var randomHexScheme = new Scheme("Random Hex", []);
randomHexScheme.nextCode = function () {
    var hex = randomHexColor();
    return new CS2ColorCode('#' + hex, hex);
}
cs2Schemes.push(randomHexScheme);

//Rainbow Scheme
var rainbowSchemeColors = [mcc.dark_red, mcc.red, mcc.gold, mcc.yellow,
mcc.green, mcc.aqua, mcc.blue, mcc.light_purple, mcc.dark_purple];
cs2Schemes.push(new Scheme("Rainbow", rainbowSchemeColors));

//Ordered Scheme
var orderedSchemeColors = [];
for (var col in mcc) orderedSchemeColors.push(mcc[col]);
cs2Schemes.push(new Scheme("Ordered", orderedSchemeColors));