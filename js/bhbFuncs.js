function copyFunctionBhb() {
    document.getElementById('main_output_box').style.display = 'inline';
    document.getElementById('main_output_box').select();
    document.execCommand('copy');
    document.getElementById('main_output_box').style.display = 'none';
}

function findSplitLengths(word, numSplits) {

    //List of lengths of each split
    var solutions = [];

    var roughSolution = parseInt(Math.ceil(parseFloat(word.length) / numSplits), 10);
    var remaining = word.length;

    var reduced = false;

    for (var i = 0; i < numSplits; ++i) {
        var x = (roughSolution - 1) * (numSplits - i);
        if (!reduced && x === remaining) {
            roughSolution -= 1;
            reduced = true;
        }

        solutions.push(roughSolution);
        remaining -= roughSolution;
    }

    return solutions;
}

function findSplits(rightJustified, splitsLengths, input) {

    var result = [];
    if (rightJustified) splitsLengths = splitsLengths.reverse();

    var newIndex = 0;
    for (var i = 0; i < splitsLengths.length; i++) {
        result[i] = input.substring(newIndex, newIndex + splitsLengths[i]);
        newIndex += splitsLengths[i];
    }

    return result;
}

function blendTwo(hexOne, hexTwo, input) {

    //Start to compile the output
    var output = "";

    //Put the R, G, and B values for each into an array
    let componentsOne = [hexR(hexOne), hexG(hexOne), hexB(hexOne)];
    let componentsDif = [hexR(hexTwo) - hexR(hexOne), hexG(hexTwo) - hexG(hexOne), hexB(hexTwo) - hexB(hexOne)];

    //Loop through each step
    for (var j = 0; j <= (input.length - 1); ++j) {
        //Append the signifier
        output += "&#";
        //Append each hex value's parts
        componentsOne.forEach((c, i) => output += padHex(c + (componentsDif[i] * (j / (input.length - 1)))).toUpperCase());
        //Append the index character to the output
        output += input[j];
    }

    return output;
}

function blendMain(howManyCodes, input, codeList) {

    //Get the "Right justified" setting from the HTML
    var rightJustified = document.getElementById("right_just").checked;

    //Create an output
    var output = "";
    //Find the splits of the input
    var splits = findSplits(rightJustified, findSplitLengths(input, (howManyCodes - 1)), input);

    //Compile the output
    for (var i = 0, codeIndex = 0; i < splits.length; i++, codeIndex++) {
        if (i !== (splits.length - 1)) splits[i] = (splits[i] + splits[i + 1].substring(0, 1));

        var addendum = blendTwo(codeList[codeIndex], codeList[codeIndex + 1], splits[i]);
        output += (i !== (splits.length - 1) ? addendum.substring(0, addendum.length - 9) : addendum);
    }

    return output;
}

function padHex(input) {
    var convertedHex = Math.round(input).toString(16);
    return convertedHex.length == 1 ? "0" + convertedHex : convertedHex;
}

function hexR(hex) { return parseInt(hex.substring(0, 2), 16) }
function hexG(hex) { return parseInt(hex.substring(2, 4), 16) }
function hexB(hex) { return parseInt(hex.substring(4, 6), 16) }

function slotMachine() {

    var codeBoxesArr = Array.prototype.slice.call(document.getElementsByClassName("code_input"));
    var colorPickerArr = Array.prototype.slice.call(document.getElementsByClassName("color_picker"));
    var intProgress = 0;

    animate({//Timing loop
        duration: 2520,
        timing: function (timeFraction) {
            return timeFraction;
        },
        draw: function (progress) {
            if (progress % 2 != 0) {
                for (var j = 5; j >= Math.floor(intProgress / 40); --j) {
                    codeBoxesArr[j].value = randomHexColor();
                    colorPickerArr[j].value = "#" + codeBoxesArr[j].value;
                    if (intProgress < 10) unlockFields();
                    checkInput();
                }
            }
            sleep(4);
            intProgress++;
        }
    });
}

function clearAll() {
    Array.prototype.slice.call(document.getElementsByClassName("code_input")).forEach(i => i.value = '');
    Array.prototype.slice.call(document.getElementsByClassName("color_picker")).forEach(p => p.value = "#000000");
    checkInput();
    unlockFields();
}

function buildPreviewBhb(input) {
    var div = document.getElementById('preview_box');
    var div2 = document.getElementById('preview_label_container');
    var copyButton = document.getElementById('copy_button');
    var label = document.getElementById('preview_box_label');

    //Clear old preview
    while (div2.firstChild) {
        div2.removeChild(div2.firstChild);
    }

    /*
        Input will be in the form &#FF00FF{char}, etc., where each character will be preceded by a color code
        The following code will split the input into an array of corresponding color codes and characters:

        [#FF00FF[char: A], #00FF00[char: B], #0000FF[char: C], etc.]
    */
    var inputSplit = input.split("&");
    //First index will be empty, shift it out
    inputSplit.shift();

    //Create a label for each character
    inputSplit.forEach(element => {

        var label = document.createElement('label');
        label.style = "color: " + element.substring(0, 7) + ";";
        label.innerText = element.substring(7, 8);

        div2.appendChild(label);
    });

    //Show the preview if there is something to show, else hide the entire div
    if (div2.innerHTML == '') {
        div.style.display = 'none';
        div.style.border = '0px solid black';
        label.style.display = 'none';
        copyButton.style.display = 'none';
        Array.from(document.getElementsByClassName('cond-break')).forEach(b => b.style.display = 'none');
    }
    else {
        div.style.display = 'block';
        div.style.border = '3px solid black';
        label.style.display = 'inline';
        copyButton.style.display = 'inline';
        Array.from(document.getElementsByClassName('cond-break')).forEach(b => b.style.display = 'inline');
    }
}

//Figure out which fields should be enabled/disabled
function unlockFields() {

    var fields = Array.prototype.slice.call(document.getElementsByClassName("code_input"));
    var pickers = Array.prototype.slice.call(document.getElementsByClassName("color_picker"));

    // f=field, i=index
    fields.forEach((f, i) =>{
        if(i + 1 < 6){
            fields[i + 1].disabled = f.value.length == 6 && !f.disabled ? false : true;
            pickers[i + 1].disabled = f.value.length == 6 && !f.disabled ? false : true;
        }
    });

    var shifters = Array.prototype.slice.call(document.getElementsByClassName("color_shifter"));

    shifters.forEach((s, i) => {
        if(i != 0 && fields[i].value.length == 6 && !fields[i].disabled){
            s.disabled  = false;
        }
        else{
            s.disabled = true;
        }
    })
}

/*
    Given an index, swap the code with the code at the index - 1
*/
function shiftColor(index){
    var fields = Array.prototype.slice.call(document.getElementsByClassName("code_input"));
    var pickers = Array.prototype.slice.call(document.getElementsByClassName("color_picker"));
    
    var currentIndexColor = fields[index].value;
    var oneUpIndexColor = fields[index - 1].value;

    fields[index].value = oneUpIndexColor;
    pickers[index].value = "#" + oneUpIndexColor;

    fields[index - 1].value = currentIndexColor;
    pickers[index - 1].value = "#" + currentIndexColor;

    unlockFields();
    checkInput();
}

function checkInput() {
    //Init
    var bhbOutput = '';
    //Need to be at least 2 valid codes
    var validCodes = 0;
    //Compile the code fields
    var codeFields = function () { var x = []; for (var i = 0; i < 6; i++) { x.push(document.getElementById('code_input' + i)); } return x; }();
    //Count number of valid codes
    codeFields.forEach(el => { if (isHexOk(el.value) && !el.disabled) validCodes++; });

    //Build the preview if conditions are met
    if (validCodes >= 2 && (document.getElementById('main_enter_box').value.length >= (validCodes * 2) - 1)) {
        bhbOutput = blendMain(validCodes, document.getElementById('main_enter_box').value, codeFields.map(f => {return(!f.disabled ? f.value : '')}));
    }
    buildPreviewBhb(bhbOutput);

    updateCookie();
    document.getElementById('main_output_box').value = bhbOutput;
}