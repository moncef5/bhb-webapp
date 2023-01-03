function checkInputMP() { 
    var input = document.getElementById('mp_enter_box').value;

    if(input != '') buildPreviewMP(input);
    else buildPreviewMP("");

    updateBHBCookies();
}

function buildPreviewMP(input) {
    var div = document.getElementById('mp_preview_box');
    var div2 = document.getElementById('mp_preview_label_container');
    var label = document.getElementById('mp_preview_box_label');

    //Clear old preview
    while (div2.firstChild) {
        div2.removeChild(div2.firstChild);
    }

    //Create a slicable copy of the input
    var inputCopy = input;

    var finished = false;

    //Start off by assuming the color is black
    var curColor = '000000';

    while(!finished && inputCopy != ""){

        while(inputCopy && inputCopy[0] != '&'){
            var colorLabel = document.createElement('label');
            colorLabel.style = "color: #" + curColor + ";";
            colorLabel.innerText = inputCopy.substring(0, 1);
            div2.appendChild(colorLabel);
            inputCopy = inputCopy.substring(1);
        }

        //If there is no more input, we are done
        if(inputCopy == '') finished = true;

        //Check for hex color code
        if(inputCopy[1] == '#'){
            curColor = inputCopy.substring(2, 8);
            inputCopy = inputCopy.substring(8);
        }
        //See if the next character is a char color code
        else if(findHexFromChar(inputCopy[1]) != ''){
            curColor = findHexFromChar(inputCopy[1]);
            inputCopy = inputCopy.substring(2);
        }
        else{
            let colorLabel = document.createElement('label');
            colorLabel.style = "color: #" + curColor + ";";
            colorLabel.innerText = inputCopy.substring(0, 1);
            div2.appendChild(colorLabel);
            inputCopy = inputCopy.substring(1);
        }
    }

    //Show the preview if there is something to show, else hide the entire div
    if (div2.innerHTML == '') {
        div.style.display = 'none';
        div.style.border = '0px solid black';
        label.style.display = 'none';
        Array.from(document.getElementsByClassName('mp-cond-break')).forEach(b => b.style.display = 'none');
    }
    else {
        div.style.display = 'block';
        div.style.border = '3px solid black';
        label.style.display = 'inline';
        Array.from(document.getElementsByClassName('mp-cond-break')).forEach(b => b.style.display = 'inline');
    }
}