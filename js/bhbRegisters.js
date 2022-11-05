var rawInList = Array.from(document.getElementsByClassName("code_input"));
var colorPickerList = Array.from(document.getElementsByClassName("color_picker"));

//Register listeners for code inputs
rawInList.forEach((rawIn, index) => {

    //Onchange, determine new associated color picker color, and update fields if applicable
    var types = ['keyup', 'change'];
    types.forEach(t => {
        rawIn.addEventListener(t, function(){
            unlockFields();
            colorPickerList[index].value = (isHexOk(rawIn.value.toLowerCase()) ? '#' + rawIn.value.toLowerCase() : colorPickerList[index].getAttribute('initial-value'));
            checkInput();
        });
    });

    //Handle tab and shift tab presses from code inputs
    rawIn.addEventListener('keydown', function (e) {
        if (e.keyCode == 9) {
            e.preventDefault();
            if (e.shiftKey && index > 0) document.getElementById('code_input' + (index - 1)).focus();
            else if (index < 5) {
                let n = document.getElementById('code_input' + (index + 1));
                if (!(n.disabled)) n.focus();
                else document.getElementById('main_enter_box').focus();
            }
            else if (index == 5) document.getElementById('main_enter_box').focus();
        }
    });

    //Only allow valid hex chars as codes
    var enterTypes = ['keydown', 'keypress', 'paste', 'cut'];
    enterTypes.forEach(function(type) {
        rawIn.addEventListener(type, function (e) {

            //Allow cut and paste, which trigger this
            if(e.keyCode == undefined) return true;

            // Allow: backspace, delete, tab
            if ([46, 8, 9].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
                ((e.keyCode == 65 || e.keyCode == 86 || e.keyCode == 88 || e.keyCode == 67) && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }

            e = e || window.event;
            var key = e.keyCode || e.charCode;

            if (key == 8 || key == 9 || key == 13 || key == 46 || key == 37 || key == 39) {
                return true;
            }

            //Input can only be 6 chars long, and must match the valid regex
            if (this.value.length >= 6 || !/^[A-Fa-f0-9]+$/.test(String.fromCharCode(key))) {
                e.preventDefault();
                return false;
            }
        });
    });

});

//Register listeners for color pickers
colorPickerList.forEach((colorPicker, index) => {
    //Onchange, set the value of the associated code input, and unlock fields. This will also trigger the onchange event for the code input.
    colorPicker.addEventListener('change', function () {
        document.getElementById('code_input' + index).value = this.value.replace('#', '');
        unlockFields();
        checkInput();
    });
});

//Register the listener for justification boxes
var justificationList = Array.from(document.getElementsByClassName("just_picker"));
justificationList.forEach((justPicker,) => {
    //Onchange, update the cookie
    justPicker.addEventListener('change', function() {
        checkInput();
        updateCookie();
    });
});