function findScheme(input){
    var scheme = cs2Schemes.find(s => s.name == input);
    return scheme;
}

function checkInputCS2() { 
    var input = document.getElementById('cs2_enter_box').value;
    var scheme = document.getElementById('cs2_scheme_select').value;

    if(input != '' && scheme != 'default') var cs2Output = buildPreviewCS2(input, findScheme(scheme));
    else cs2Output = buildPreviewCS2("", 'default');

    updateBHBCookies();
    document.getElementById('cs2_output_box').value = cs2Output;
}

function copyFunctionCS2(){
    document.getElementById('cs2_output_box').style.display = 'inline';
    document.getElementById('cs2_output_box').select();
    document.execCommand('copy');
    document.getElementById('cs2_output_box').style.display = 'none';
}

function buildPreviewCS2(input, scheme) {
    
    scheme.index = 0;

    var div = document.getElementById('cs2_preview_box');
    var div2 = document.getElementById('cs2_preview_label_container');
    var copyButton = document.getElementById('cs2_copy_button');
    var label = document.getElementById('cs2_preview_box_label');

    //Clear old preview
    while (div2.firstChild) {
        div2.removeChild(div2.firstChild);
    }

    var charSplit = input.split('');
    var compOut = '';

    if (scheme != 'default') {

        //Create an addendum for font
        var fontAddendum = document.getElementById('font_select').value != 'default' ? " font-family: " + document.getElementById('font_select').value + ";" : "";

        //Create new preview
        charSplit.forEach(c => {

            let nextColor = scheme.nextCode();

            var label = document.createElement('label');
            label.style = "color: " + nextColor.hex + ";" + fontAddendum;
            label.innerText = c;

            if(c == ' ') scheme.index--;

            div2.appendChild(label);

            compOut += "&" + (nextColor.value.length == 6 ? ("#" + nextColor.value) : nextColor.value) + c;
        });
    }

    //Show the preview if there is something to show, else hide the entire div
    const showElements = (div2.innerHTML != '');

    div.style.display = showElements ? 'block' : 'none';
    div.style.border = showElements ? '3px solid black' : '0px solid black';
    label.style.display = showElements ? 'inline' : 'none';
    copyButton.style.display = showElements ? 'inline' : 'none';
    Array.from(document.getElementsByClassName('cs2-cond-break')).forEach(b => b.style.display = showElements ? 'inline' : 'none');

    /*
    if (div2.innerHTML == '') {
        div.style.display = 'none';
        div.style.border = '0px solid black';
        label.style.display = 'none';
        copyButton.style.display = 'none';
        Array.from(document.getElementsByClassName('cs2-cond-break')).forEach(b => b.style.display = 'none');
    }
    else {
        div.style.display = 'block';
        div.style.border = '3px solid black';
        label.style.display = 'inline';
        copyButton.style.display = 'inline';
        Array.from(document.getElementsByClassName('cs2-cond-break')).forEach(b => b.style.display = 'inline');
    }
*/
    return compOut;
}