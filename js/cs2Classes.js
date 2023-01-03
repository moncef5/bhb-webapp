'use strict';

function Scheme(name, codes){

    this.name = name;
    this.codes = codes;
    this.index = 0;
}

Scheme.prototype.nextCode = function(){
    var curIndex = this.index;
    this.index = (this.index++ == (this.codes.length - 1) ? 0 : this.index++);
    return this.codes[curIndex];
}

function CS2ColorCode(hex, value) {
    this.hex = hex;
    this.value = value;

    this.getHex = function () {
        return this.hex;
    }
}