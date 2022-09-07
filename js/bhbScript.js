//Set default values for color pickers
Array.from(document.getElementsByClassName("color_picker")).forEach(colorPicker => colorPicker.value = (darkMode ? "#000000" : "#FFFFFF"));
//Set default values for code inputs
Array.from(document.getElementsByClassName("code_input")).forEach(codeInput => codeInput.dispatchEvent(new Event('change')));
//Unlock code fields, where applicable
unlockFields();
//Check inputs on BHB
checkInput();