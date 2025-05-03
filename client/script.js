const firstDiv = document.getElementById('one');
const secondDiv = document.getElementById('two');
const thirdDiv = document.getElementById('three');
const fourthDiv = document.getElementById('four');
const fifthDiv = document.getElementById('five');
const divs = [firstDiv, secondDiv, thirdDiv, fourthDiv, fifthDiv];

const form = document.getElementById("vibe-form");
const input = document.getElementById("vibe-input");

input.addEventListener("focus", () => {
    form.classList.add("focused");
});

input.addEventListener("blur", () => {
    form.classList.remove("focused");
});

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function getLuminance(r, g, b) {
    const [R, G, B] = [r, g, b].map(c => {
        c /= 255;
        return c <= 0.03928
            ? c / 12.92
            : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function getContrast(rgb1, rgb2) {
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function getTextColor(bgColor) {
    const black = { r: 0, g: 0, b: 0 };
    const white = { r: 255, g: 255, b: 255 };

    const contrastWithBlack = getContrast(bgColor, black);
    const contrastWithWhite = getContrast(bgColor, white);

    // Return the color that gives better contrast
    return contrastWithBlack > contrastWithWhite ? "#000000" : "#ffffff";
}


initial_colors = ['#F2F0EB', '#E8E2DC', '#D1CFC7', '#333333', '#EB4747'];
const loader = document.getElementById("loader");
// loader.style.display = "none";

const colorsDiv = document.createElement("div");
colorsDiv.style.display = "flex";
colorsDiv.id = "colorsDiv";
document.body.appendChild(colorsDiv);

for (let i=0; i<5;i++){
    divs[i].classList.add("specificColor")
    document.getElementById(`${divs[i].id}`).style.backgroundColor = initial_colors[i];
    document.getElementById(`${divs[i].id}Head`).textContent = initial_colors[i];
    const rgb = hexToRgb(initial_colors[i]);
    document.getElementById(`${divs[i].id}`).style.color = getTextColor(rgb);

    divs[i].addEventListener("click", () => {
        divs[i].a
        navigator.clipboard.writeText(initial_colors[i]).then(() => {
            //alert("Copied: " + initial_colors[i]);
            const copiedAlert = document.createElement("div");
            copiedAlert.style.display = "flex";
            copiedAlert.id = "alertDiv";
            copiedAlert.textContent = "Copied to Clipboard."
            document.body.appendChild(copiedAlert);
            setTimeout(function() {
                copiedAlert.remove();
            }, 3000);
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    });
}


document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();


    for (let i = 0; i < 5; i++) {
        document.getElementById(`${divs[i].id}`).style.backgroundColor = "#EAEEF1";
        document.getElementById(`${divs[i].id}Head`).textContent = "";
    }

    loader.style.display = "block";

    requestAnimationFrame(() => {
        fetchPalette(); // this ensures the loader is shown before fetch starts
    });
});


async function fetchPalette() {
    const vibe = document.querySelector("input[type='text']").value.trim();

    if (!vibe) {
        alert("Please enter a vibe before submitting.");
        loader.style.display = "none";
        return;
    }

    const response = await fetch("http://localhost:5000/generate-palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe })
    });

    const data = await response.json();

    let palette = data.palette.replace(/```[\s\S]*?```/g, match => 
        match.replace(/```(python)?\n?/, "").replace(/```/, "")
    ).replace(/'/g, '"');

    try {
        palette = JSON.parse(palette);
    } catch (error) {
        console.error("Error parsing palette:", error);
        palette = [];
    }

    if (palette.length === 5) {
        for (let i = 0; i < 5; i++) {
            const color = palette[i];
            const div = divs[i];
            const head = document.getElementById(`${div.id}Head`);
    
            div.style.backgroundColor = color;
            head.textContent = color;
    
            const rgb = hexToRgb(color);
            div.style.color = getTextColor(rgb);
    
            // Remove any previous click listener first (optional)
            const newDiv = div.cloneNode(true);
            div.parentNode.replaceChild(newDiv, div);
    
            // Reassign the element in the array to keep it updated
            divs[i] = newDiv;
    
            // Add clipboard copy behavior
            newDiv.addEventListener("click", () => {
                navigator.clipboard.writeText(color).then(() => {
                    const copiedAlert = document.createElement("div");
                    copiedAlert.style.display = "flex";
                    copiedAlert.id = "alertDiv";
                    copiedAlert.textContent = "Copied to Clipboard."
                    document.body.appendChild(copiedAlert);
                    setTimeout(function() {
                    copiedAlert.remove();
                    }, 3000);
                }).catch(err => {
                    console.error("Failed to copy: ", err);
                });
            });
        }
    }
     else {
        console.error("Unexpected palette:", data);
    }

    loader.style.display = "none";
}




