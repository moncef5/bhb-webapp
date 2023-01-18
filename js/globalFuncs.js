let darkMode = true;

let darkPreview = "#7A7A7A";
let lightPreview = "#FFFFFF";

let bhbOutput = '';
let cs2Output = '';

function randomHexColor() {
    return Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
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
    return (hex.length == 6 && !isNaN(parseInt(hex, 16)));
}

function toggleLightMode() {
    //Update variable
    darkMode = !darkMode;

    //Toggle light-mode CSS elements
    document.body.classList.toggle('light-mode');

    //Update the cookie
    updateBHBCookies();
}

//Cookie functions
function updateBHBCookies() {

    //Only set the cookie if the user has accepted cookies
    let cookie_consent = getCookie('user_cookie_consent');

    //If the user has not accepted cookies, or has not interacted with the prompt, do not set any cookies
    if (cookie_consent == '0' || cookie_consent == '' || cookie_consent == undefined) {
        setCookie('user_cookie_consent', '0');
        return;
    }

    //Start compiling the cookie
    var inputs = '';

    //Add code fields to the cookie
    var fields = Array.prototype.slice.call(document.getElementsByClassName("code_input"));
    //For each field, if the value exists, or there is a value after it, add the field.
    // after checking was done to prevent 'disabled' fields from being excluded from the cookie
    fields.forEach((f, i) => inputs += ((isHexOk(f.value) || f.value == '' && i < 5 && fields[i + 1].value != '' ) ? f.value + ',': ''));
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

    //Add MP input to the cookie
    setCookie('mp_input', document.getElementById('mp_enter_box').value);

    //Add font to the cookie
    setCookie('font_select', document.getElementById('font_select').value);
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
function handleBHBCookies() {

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
    var mpinput = getCookie('mp_input');

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

    //Handle MP input in cookie
    if (mpinput) document.getElementById('mp_enter_box').value = mpinput;

    //Handle dark mode in cookie
    if (dark == 'false') toggleLightMode();

    //Handle font in cookie
    var font = getCookie('font_select');
    if (document.querySelector(`option[value="${font}"]`)) document.getElementById('font_select').value = font;

    checkInput();
    checkInputCS2();
}

// Create cookie
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + "; samesite=none; secure; max-age=31536000; path=/";
}

//Delete cookie
function deleteCookie(cname) {
    const d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=;samesite=none;secure;" + expires + ";path=/";
}

//Read cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(const element of ca) {
        let c = element;
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Set cookie consent
function acceptCookieConsent(){
    deleteCookie('user_cookie_consent');
    setCookie('user_cookie_consent', 1);
    document.getElementById("cookieNotice").style.display = "none";
}

function declineCookieConsent(){
    deleteAllCookies();
    deleteCookie('user_cookie_consent');
    setCookie('user_cookie_consent', 0);
    document.getElementById("cookieNotice").style.display = "none";
}

//Reload all previews
function fontChanged(oldvalue){

    if(document.getElementById('font_select').value == 'Upload'){

        var url = prompt('Enter the URL of the font file:');
        if (url == null || url == '') document.getElementById('font_select').value = oldvalue;
        else{
            var name = prompt("Enter the name of the font:");
            if (name == null || name == '') document.getElementById('font_select').value = oldvalue;
            else{
                const style = document.createElement('style');
                style.innerHTML = `
                  @font-face {
                    font-family: ${name};
                    src: url(${url});
                  }
                `;
                document.head.appendChild(style);
    
                var newOpt = document.createElement('option');
                newOpt.value = name;
                newOpt.innerHTML = name;
                //Insert before the last option
                document.getElementById('font_select').insertBefore(newOpt, document.getElementById('font_select').lastElementChild);
                //Select the new option
                document.getElementById('font_select').value = name;
            }
        }
    }

    checkInputMP();
    checkInputCS2();
    checkInput();

    updateBHBCookies();
}

document.getElementById("cookieNotice").style.display = (getCookie("user_cookie_consent") == "" ? "block" : "none");