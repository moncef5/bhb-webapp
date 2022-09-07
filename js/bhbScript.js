let rawInList = Array.from(document.getElementsByClassName("code_input"));
let colorPickerList = Array.from(document.getElementsByClassName("color_picker"));

//Register listeners for code inputs
rawInList.forEach((rawIn, index) => {

    //Onchange, determine new associated color picker color, and update fields if applicable
    rawIn.onchange = rawIn.onkeyup = rawIn.onchange = function () {
        colorPickerList[index].value = (isHexOk(this.value) ? '#' + this.value : this.getAttribute('initial-value'));
        unlockFields();
        checkInput();
    };

    //Handle tab and shift tab presses from code inputs
    rawIn.addEventListener('keydown', function (e) {
        if (e.keyCode == 9) {
            e.preventDefault();
            if (e.shiftKey && index > 0) document.getElementById('code_input' + (index - 1)).focus();
            else if (index < 5) {
                if (!(n = document.getElementById('code_input' + (index + 1))).disabled) n.focus();
                else document.getElementById('main_enter_box').focus();
            }
            else if (index == 5) document.getElementById('main_enter_box').focus();
        }
    });

    //Only allow valid hex chars as codes
    var enterTypes = ['keydown', 'keyup', 'keypress', 'paste', 'cut'];
    enterTypes.forEach(function(type) {
        rawIn.addEventListener(type, function (e) {

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
    //Set the default value of the color picker
    colorPicker.value = (darkMode ? "#000000" : "#FFFFFF");
    //Onchange, set the value of the associated code input, and unlock fields. This will also trigger the onchange event for the code input.
    colorPicker.addEventListener('change', function () {
        document.getElementById('code_input' + index).value = this.value.replace('#', '');
        unlockFields();
    });
});

//Unlock code fields, where applicable
unlockFields();
//Check inputs on BHB
checkInput();