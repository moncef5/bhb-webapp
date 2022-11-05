let darkMode = true;

let darkPreview = "#7A7A7A";
let lightPreview = "#FFFFFF";

let bhbOutput = '';
let cs2Output = '';

function randomHexColor() {
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

    //Toggle light-mode CSS elements
    document.body.classList.toggle('light-mode');

    //Update the cookie
    updateCookie();
}

//Cookie functions
function updateCookie() {

    //Only set the cookie if the user has accepted cookies
    let cookie_consent = getCookie('user_cookie_consent');

    //Clear current cookie
    deleteAllCookies();

    if (cookie_consent == '0') {
        document.cookie = 'user_cookie_consent=0; samesite=none; secure; path=/';
        return;
    }

    //Start compiling the cookie
    var cookie = '';

    //Add code fields to the cookie
    var fields = Array.prototype.slice.call(document.getElementsByClassName("code_input"));
    fields.forEach(f => cookie += isHexOk(f.value) ? f.value + ',': '');
    cookie = cookie.slice(0, -1);

    //Add justifications to the cookie
    if(document.getElementById('left_just').checked) cookie += '|left';
    else cookie += '|right';

    //Add the entered input to the cookie
    cookie += '|' + document.getElementById('main_enter_box').value;

    //Add dark mode to cookie
    cookie += '|' + darkMode;

    //Add CS2 scheme to cookie
    cookie += '|' + document.getElementById('cs2_scheme_select').value;

    //Add CS2 input to cookie
    cookie += '|' + document.getElementById('cs2_enter_box').value;

    //Don't care if the cookie is empty
    if (cookie == '') return;

    document.cookie = cookie + '; samesite=none; secure; max-age=31536000; path=/';
}

//Clear all existing cookies
function deleteAllCookies() {
    var cookies = document.cookie.split("; ");
    for (const element of cookies) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(element.split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }
}

//Parse an existing cookie
function handleCookie() {

    var cookie = document.cookie;
    if (cookie == '') {
        checkInput();
        return;
    }

    //Bhb inputs
    var codes = cookie.split('|')[0].split(',');
    var just = cookie.split('|')[1];
    var input = cookie.split('|')[2];
    var dark = cookie.split('|')[3];
    var cs2scheme = cookie.split('|')[4];
    //cs2input should only get up to the first semi-colon
    var cs2input = cookie.split('|')[5].split(';')[0];

    //Handle codes in cookie
    var fields = Array.prototype.slice.call(document.getElementsByClassName("code_input"));
    fields.forEach((f, i) => {
        if (codes[i] && isHexOk(codes[i])) f.value = codes[i];
        f.dispatchEvent(new Event('change'));
    });

    //Handle input in cookie
    if (input) document.getElementById('main_enter_box').value = input;

    if (just){
        if (just == 'left') document.getElementById('left_just').checked = true;
        else document.getElementById('right_just').checked = true;
    }

    //Handle CS2 input in cookie
    if (cs2input) document.getElementById('cs2_enter_box').value = cs2input;

    //Handle CS2 scheme in cookie
    if (cs2scheme) document.getElementById('cs2_scheme_select').value = cs2scheme;

    //Handle dark mode in cookie
    if (dark == 'false') toggleLightMode();

    checkInput();
    checkInputCS2();
}