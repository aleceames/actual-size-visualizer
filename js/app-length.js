
const lengthInput_textarea = document.getElementById("text-area");
const inchButton = document.getElementById("inch-button");
const centimeterButton = document.getElementById("centimeter-button");
const screenSize_textarea = document.getElementById("screen-size-input");
const greyOut = document.getElementById("grey-out");
const input = document.getElementById("input");
const goButton = document.getElementById("go");

let screenPixelWidth = screen.width;
let screenPixelHeight = screen.height;
let screenPixelDiagonal = Math.sqrt((Math.pow(screenPixelHeight, 2)) + (Math.pow(screenPixelWidth, 2)));

let screenInchDiagonal;
let PPI;
let browserWidthInches;


guessDiagonal();
calculatePPI();
determineLength();
generateLinesAndNumbers(browserWidthInches);

window.onresize = onResize;

screenSize_textarea.addEventListener("input", setScreenSize);
lengthInput_textarea.addEventListener("input", setLength);

inchButton.onclick = function(){switchUnits("inch")};
centimeterButton.onclick = function(){switchUnits("centimeter")};

function setScreenSize () {
    screenInchDiagonal = screenSize_textarea.value;

    calculatePPI();
    determineLength();
    deleteRectangleElements();
    generateLinesAndNumbers(browserWidthInches);
}

function switchUnits(unit) {

    const inchColor = getComputedStyle(inchButton).getPropertyValue("background-color");
    const centimeterColor = getComputedStyle(centimeterButton).getPropertyValue("background-color");


    switch (unit) {
        // inch is pressed
        case "inch":
            if (inchColor == "rgb(0, 170, 17)") {
                // do nothing because it's already selected
                break;
            }
            if (centimeterColor == "rgb(0, 170, 17)") {
                // centimeters to inches
                PPI = PPI / 0.393701;
                let browserWidthInches= Math.round(window.innerWidth / PPI);
                deleteRectangleElements();
                determineLength();     
                generateLinesAndNumbers(browserWidthInches);
                setLength();

                centimeterButton.style.background = "none";
                centimeterButton.style.backgroundColor = "none";
                centimeterButton.style.boxShadow = "none";

                inchButton.style.backgroundColor = "rgb(0, 170, 17)";
                inchButton.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.4)";
                break;
            }
            break;
        // centimeter is pressed
        case "centimeter":
            if (inchColor == "rgb(0, 170, 17)") {
                // inches to centimeters
                PPI = PPI * 0.393701;
                let browserWidthCentimeters= Math.round(window.innerWidth / PPI);
                deleteRectangleElements();
                determineLength();     
                generateLinesAndNumbers(browserWidthCentimeters);
                setLength();

                inchButton.style.background = "none";
                inchButton.style.backgroundColor = "none";
                inchButton.style.boxShadow = "none";

                centimeterButton.style.backgroundColor = "rgb(0, 170, 17)";
                centimeterButton.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.4)";
                break;
            }
            if (centimeterColor == "rgb(0, 170, 17)") {
                // do nothing because it's already selected
                break;
            }
             
        
            break;    
    }
}

function deleteRectangleElements () {
    var rectangleChildren = document.getElementById("rectangle");
    while (rectangleChildren.firstChild) {
        rectangleChildren.removeChild(rectangleChildren.firstChild);
    }           
}

function onResize () {
    determineLength();
    generateLinesAndNumbers(browserWidthInches);
}

function setLength () {

    document.getElementById("rectangle").style.width = (lengthInput_textarea.value * PPI) + "px";
    document.getElementById("horizontal-line").style.width = (lengthInput_textarea.value * PPI) + "px";
    document.getElementById("overflow").style.width = (lengthInput_textarea.value * PPI) + 9 + "px";

    generateLinesAndNumbers(Math.round(lengthInput_textarea.value));

    window.onresize = null;
}

/* guesses the diagonal size of a screen in inches based on the 
diagonal pixel size */
// devices added: Apple, Dell, Google, Microsoft, Lenovo
function guessDiagonal() {

    if (getOS() == 'MacOS') {
        switch (Math.floor(screenPixelDiagonal)) {
            case 2202:
                screenInchDiagonal = 21.5;
                break;
            case 2937:
            case 5874:
                screenInchDiagonal = 27;
                break;
            case 4699:
                screenInchDiagonal = 21.5;
                break;
            case 2716:
                screenInchDiagonal = 12;
                break;
            case 1567:
                screenInchDiagonal = 11.6;
                break;
            case 1509: 
            case 1698: 
            case 3018:
                screenInchDiagonal = 13.3;
                break;
            case 1981:
            case 3396:
                screenInchDiagonal = 15.4;
                break;
            case 2264:
                screenInchDiagonal = 17;
                break;
            default:
                getScreenSize();
                input.addEventListener("change", getScreenSize);
                screenInchDiagonal = 0;
                break;
        }
    } else if(getOS() == 'iOS') {
        switch (Math.floor(screenPixelDiagonal)) {
            case 640:
                screenInchDiagonal = 7.9;
                break;
            case 2780:
            case 1390:
                screenInchDiagonal = 10.5;
                break;
            case 2912:
            case 1456:
                screenInchDiagonal = 11;
                break;
            case 3414:
            case 1707:
                screenInchDiagonal = 12.9;
                break;
            case 576:
            case 1153:
                screenInchDiagonal = 3.5;
                break;
            case 1308:
            case 651:
                screenInchDiagonal = 4;
                break;
            case 1530:
            case 765:
                screenInchDiagonal = 4.7;
                break;
            case 844:
                screenInchDiagonal = 5.5;
                break;
            case 894:
            case 2683:
                screenInchDiagonal = 5.8;
                break;
            case 1974:
                screenInchDiagonal = 6.1;
                break;
            // XR vs XS
            case 987:
                if (devicePixelRatio == 2) {
                    screenInchDiagonal = 6.1;
                } else {
                    screenInchDiagonal = 6.5;
                }
                break;
            case 2961:
                screenInchDiagonal = 6.5;
                break;
            default:
                getScreenSize();
                input.addEventListener("change", getScreenSize);
                screenInchDiagonal = 0;
                break;
        }
    } else if (getOS() == 'Windows') {
        switch (Math.floor(screenPixelDiagonal)) {
            // Dell, Lenovo, Microsoft screens
            // doesn't guess 4404, 2202––too common
            case 1541:
                screenInchDiagonal = 10.1;
            case 2349:
                screenInchDiagonal = 23;
            case 2264:
                screenInchDiagonal = 24;
            case 5874:
                screenInchDiagonal = 27;
            case 3671:
                screenInchDiagonal = 13.3;
            case 1567:
                screenInchDiagonal = 13.3;
            case 2937:
                screenInchDiagonal = 14;
            case 1468:
                screenInchDiagonal = 10.6;
            case 1802:
                screenInchDiagonal = 13.5;
            case 1730:
                screenInchDiagonal = 12;
            case 1644:
                screenInchDiagonal = 12.4;
            default:
                getScreenSize();
                input.addEventListener("change", getScreenSize);
                screenInchDiagonal = 0;
                break;
        }
    } else if (getOS() == 'Android') {

        switch (Math.floor(screenPixelDiagonal)) {
            case 838:
                // Pixel vs PixelXL
                if (devicePixelRatio > 3) {
                    screenInchDiagonal = 5.5;
                } else {
                    screenInchDiagonal = 5;
                }
            
            default:
                    getScreenSize();
                    input.addEventListener("change", getScreenSize);
                    screenInchDiagonal = 0;
                    break;    
        }
    } else {
        // chromebook, linux, etc.
        switch (Math.floor(screenPixelDiagonal)) {
            // Chromebook
            case 1536:
                screenInchDiagonal = 12.9;
            case 3018:
                screenInchDiagonal = 30;

            default:
                getScreenSize();
                input.addEventListener("change", getScreenSize);
                screenInchDiagonal = 0;
                break;
        }
    }
    screenSize_textarea.innerHTML = screenInchDiagonal;       
}

function getOS () {
    let userAgent = window.navigator.userAgent;
    let platform = window.navigator.platform,
    macOSPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'Mac', 'MacOS'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'],
    os = null;

if (macOSPlatforms.indexOf(platform) !== -1) {
  os = 'MacOS';
} else if (iosPlatforms.indexOf(platform) !== -1) {
  os = 'iOS';
} else if (windowsPlatforms.indexOf(platform) !== -1) {
  os = 'Windows';
} else if (/Android/.test(userAgent)) {
  os = 'Android';
} 

return os;
}


function getScreenSize() {

    greyOut.style.display = "block";

    if (IsNumeric(input.value)) {
        goButton.onclick = function () {
            greyOut.style.display = "none";
            screenInchDiagonal = input.value;
            screenSize_textarea.innerHTML = screenInchDiagonal;
            
            calculatePPI();
            determineLength();
            deleteRectangleElements();
            generateLinesAndNumbers(browserWidthInches);
        };
        input.onkeyup = function (event) {
            if (event.keyCode == 13 || event.which == 13) {
            greyOut.style.display = "none";
            screenInchDiagonal = input.value;
            screenSize_textarea.innerHTML = screenInchDiagonal;
            
            calculatePPI();
            determineLength();
            deleteRectangleElements();
            generateLinesAndNumbers(browserWidthInches);
            }
        };
    }
}

function IsNumeric(input)
{
    return (input - 0) == input && (''+input).trim().length > 0;
}


function calculatePPI () {
    PPI = screenPixelDiagonal / screenInchDiagonal;
}

function determineLength () {
    browserWidthInches = (window.innerWidth / PPI);
    lengthInput_textarea.innerHTML = ((window.innerWidth - 30) / PPI).toFixed(2);

    document.getElementById("rectangle").style.width = window.innerWidth - 30 + 'px';
    document.getElementById("horizontal-line").style.width = window.innerWidth - 31 + 'px';
    document.getElementById("overflow").style.width = window.innerWidth - 31 + 'px';
}

function generateLinesAndNumbers (browserWidthInches) {

    for (let i = 0; i < (Math.round(browserWidthInches) + 1); i++) {
        let inchLinePosition = PPI * i;

        let inchLine = document.createElement("div");
        inchLine.setAttribute("class", "inch-line");
        inchLine.style.left = inchLinePosition + "px";

        let halfInchLine = document.createElement("div");
        halfInchLine.setAttribute("class", "half-inch-line");
        halfInchLine.style.left = inchLinePosition + (PPI/2) + "px";

        let scaleNumber = document.createElement("p");
        scaleNumber.setAttribute("class", "number");
        scaleNumber.setAttribute("ID", i);
        
        if (i !== 0) {
            scaleNumber.innerHTML = i;
        }

        if (i > 9) {
            scaleNumber.style.left = -8.5 + "px";
        }   

        inchLine.appendChild(scaleNumber);

        document.getElementById("rectangle").appendChild(inchLine)
        document.getElementById("rectangle").appendChild(halfInchLine);
    }
}
  
