let darkMode = true;

let darkPreview = "#7A7A7A";
let lightPreview = "#FFFFFF";

let bhbOutput = '';

function randomColor() {
    var rndHex = '';
    for (let i = 0; i < 6; i++) rndHex += "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
    return rndHex;
}

/*
Sleep for [delay] number of milliseconds
*/
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function animate({ timing, draw, duration }) {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        // timeFraction goes from 0 to 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        // calculate the current animation state
        let progress = timing(timeFraction)

        draw(progress); // draw it

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
}

//Validate the hex color is good
function isHexOk(hex) {
    return (hex.length == 6);
}

function toggleLightMode() {
    //Update variable
    darkMode = !darkMode;

    //Toggle each of the light mode CSS elements
    ['light-mode', 'light-mode-text', 'light-mode-color', 'light-mode-button', 'light-mode-disabled'].forEach(c => document.body.classList.toggle(c));

    //Update the cookie
    updateCookie();
}

//Cookie functions
function updateCookie() {

    //Clear current cookie
    //deleteAllCookies();

    //Start compiling the cookie
    var cookie = '';

    //Add code fields to the cookie
    var fields = Array.prototype.slice.call(document.getElementsByClassName("code_input"));
    fields.forEach(f => cookie += isHexOk(f.value) ? f.value + ',': '');
    cookie = cookie.slice(0, -1);

    //Add the entered input to the cookie
    cookie += '|' + document.getElementById('main_enter_box').value;

    //Add dark mode to cookie
    cookie += '|' + darkMode;

    //Don't care if the cookie is empty
    if (cookie == '') return;

    document.cookie = cookie + '; samesite=none; secure; max-age=31536000; path=/';
}

//Clear all existing cookies
function deleteAllCookies() {
    document.cookie.split(";").forEach(c => {
        let eqPos = c.indexOf("=");
        let name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=; samesite=none; secure; max-age=-1; path=/";
    });
}

//Parse an existing cookie
function handleCookie() {

    var cookie = document.cookie;
    console.log("Cookie: " + cookie);
    if (cookie == '') {
        checkInput();
        return;
    }

    var codes = cookie.split('|')[0].split(',');
    var input = cookie.split('|')[1];
    var dark = cookie.split('|')[2];

    //Handle codes in cookie
    var fields = Array.prototype.slice.call(document.getElementsByClassName("code_input"));
    fields.forEach((f, i) => {
        if (codes[i] && isHexOk(codes[i])) f.value = codes[i];
        f.dispatchEvent(new Event('change'));
    });

    //Handle input in cookie
    if (input) document.getElementById('main_enter_box').value = input;

    //Handle dark mode in cookie
    if (dark == 'false') toggleLightMode();

    checkInput();
}

class Setting {

    constructor(name, description, initValue, options) {
        this.name = name;
        this.description = description;
        this.value = initValue;
        this.options = options;
    }

    get value() {
        return this.value;
    }

    setValue(value) {
        this.value ??= value;
    }

    // Do nothing by default, "override" in instances
    execute() {
        return;
    }
}