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

    const vibe = input.value.trim();
    if (!vibe) {
        alert("Please enter a vibe before submitting.");
        return;
    }

    for (let i = 0; i < 5; i++) {
        document.getElementById(`${divs[i].id}`).style.backgroundColor = "#EAEEF1";
        document.getElementById(`${divs[i].id}Head`).textContent = "";
    }

    loader.style.display = "block";
    requestAnimationFrame(() => {
        fetchPalette(vibe); // pass vibe directly
    });
});



async function fetchPalette(vibe) {
    const prompt = `Only return a Python list of 5 hexadecimal color codes that match this vibe: '${vibe}'. No explanation. No labels. Just the list.`;

    const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    let rawText;
    try {
        rawText = data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error("Invalid response structure:", data);
        loader.style.display = "none";
        return;
    }

    // Clean up the text (remove Python code block wrapping, single quotes, etc.)
    rawText = rawText.replace(/```[\s\S]*?```/g, match => 
        match.replace(/```(python)?\n?/, "").replace(/```/, "")
    ).replace(/'/g, '"');

    let palette;
    try {
        palette = JSON.parse(rawText);
    } catch (error) {
        console.error("Error parsing palette:", rawText);
        loader.style.display = "none";
        return;
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

            const newDiv = div.cloneNode(true);
            div.parentNode.replaceChild(newDiv, div);
            divs[i] = newDiv;

            newDiv.addEventListener("click", () => {
                navigator.clipboard.writeText(color).then(() => {
                    const copiedAlert = document.createElement("div");
                    copiedAlert.style.display = "flex";
                    copiedAlert.id = "alertDiv";
                    copiedAlert.textContent = "Copied to Clipboard.";
                    document.body.appendChild(copiedAlert);
                    setTimeout(() => copiedAlert.remove(), 3000);
                }).catch(err => {
                    console.error("Failed to copy: ", err);
                });
            });
        }
    } else {
        console.error("Unexpected palette:", palette);
    }

    loader.style.display = "none";
}





