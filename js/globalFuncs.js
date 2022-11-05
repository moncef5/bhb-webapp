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

    if (cookie_consent == '0') {
        document.cookie = 'user_cookie_consent=0; samesite=none; secure; path=/';
        return;
    }

    //Start compiling the cookie
    var inputs = '';

    //Add code fields to the cookie
    var fields = Array.prototype.slice.call(document.getElementsByClassName("code_input"));
    fields.forEach(f => inputs += isHexOk(f.value) ? f.value + ',': '');
    inputs = inputs.slice(0, -1);

    //Add color codes to the cookies
    setCookie('bhb_codes', inputs);

    //Add justification to the cookie
    setCookie('justification', document.getElementById('left_just').checked ? 'left' : 'right');

    //Add input to the cookie
    setCookie('bhb_input', document.getElementById('main_enter_box').value);

    //Add dark mode to the cookie
    setCookie('dark_mode', darkMode);

    //Add CS2 scheme to the cookie
    setCookie('cs2_scheme', document.getElementById('cs2_scheme_select').value);

    //Add CS2 input to the cookie
    setCookie('cs2_input', document.getElementById('cs2_enter_box').value);
}

//Clear all existing cookies
function deleteAllCookies(){
    var cookies = document.cookie.split(";");
    for (const cookie of cookies)
        eraseCookie(cookie.split("=")[0]);
}

function eraseCookie(name, domain, path){
    domain = domain || document.domain;
    path = path || "/";
    document.cookie = name + "=; samesite=none; expires=" + +new Date + "; domain=" + domain + "; path=" + path;
}

//Parse an existing cookie
function handleCookie() {

    var cookie = document.cookie;
    if (cookie == '') {
        checkInput();
        return;
    }

    //Bhb inputs
    var codes = getCookie('bhb_codes').split(',');
    var just = getCookie('justification');
    var input = getCookie('bhb_input');
    var dark = getCookie('dark_mode');
    var cs2scheme = getCookie('cs2_scheme');
    //cs2input should only get up to the first semi-colon
    var cs2input = getCookie('cs2_input').split(';')[0];

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