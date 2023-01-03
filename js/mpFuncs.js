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
    div2.innerHTML = '';

// Create a document fragment to hold the span elements
const fragment = document.createDocumentFragment();

// Create a regular expression to match formatting codes and non-formatted text
const formatRegex = /&#[0-9a-fA-F]{6}|&[0-9a-fA-F]{1}|&|[^&]/g;

// Start off by assuming the color is black
let curColor = '000000';

// Use the exec method to iterate over the matches
let match;
while ((match = formatRegex.exec(input)) !== null) {
  if (match[0] === '&') {
    const span = document.createElement('span');
    span.style = "color: #" + curColor + ";";
    span.innerText = '&';
    fragment.appendChild(span);
    continue;
  } else if (match[0][0] === '&') {
    if (match[0][1] === '#') {
      curColor = match[0].slice(2, 8);
    } else if (/^[0-9a-fA-F]$/.test(match[0][1])) {
      curColor = cs2Lookup[match[0][1].toLowerCase()].replace('#', '');
    } else {
      const span = document.createElement('span');
      span.style = "color: #" + curColor + ";";
      span.innerText = '&';
      fragment.appendChild(span);
      curColor = '000000';
    }
  } else {
    const span = document.createElement('span');
    span.style = "color: #" + curColor + ";";
    span.innerText = match[0];
    fragment.appendChild(span);
  }
}

// Append the span elements to the div2 element
div2.appendChild(fragment);

    //Show the preview if there is something to show, else hide the entire div
    const displayValue = div2.innerHTML == '' ? 'none' : 'block';
    div.style.display = displayValue;
    div.style.border = displayValue == 'none' ? '0px solid black' : '3px solid black';
    label.style.display = displayValue;
    Array.from(document.getElementsByClassName('mp-cond-break')).forEach(b => b.style.display = displayValue == 'none' ? 'none' : 'inline');
}