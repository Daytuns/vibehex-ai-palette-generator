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



document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    for (let i=0; i<5;i++){
        document.getElementById(`${divs[i].id}`).style.backgroundColor = "#EAEEF1";
        document.getElementById(`${divs[i].id}Head`).textContent = "";
    }

    const loader = document.getElementById("loader");
    loader.style.display = "block"; 

    const vibe = document.querySelector("input[type='text']").value.trim();

    if (!vibe) {
        alert("Please enter a vibe before submitting.");
        loader.style.display = "none";
        return;
    }
    

    const response = await fetch("http://localhost:5000/generate-palette", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ vibe })
    });

    const data = await response.json();
    console.log("Raw response from Gemini:", data.palette);

    // Clean the response by removing code block markers and fixing quotes
    let palette = data.palette.replace(/```[\s\S]*?```/g, match => match.replace(/```(python)?\n?/, "").replace(/```/, "")).replace(/'/g, '"');
    
    console.log("Clean response from Gemini:", palette);

    if (palette) {
        try {
            // Parse the palette if it's a valid JSON string
            palette = JSON.parse(palette);
        } catch (error) {
            palette = []; // Handle unexpected formats
            console.error("Error parsing palette:", error);
        }

        console.log("Generated Palette:", palette);
        // Display the palette
        const colorsDiv = document.createElement("div");
        colorsDiv.style.display = "flex";
        colorsDiv.id = "colorsDiv";
        // palette.forEach(color => {
        //     const swatch = document.createElement("div");
        //     swatch.style.backgroundColor = color;
        //     swatch.style.width = "50px";
        //     swatch.style.height = "50px";
        //     swatch.style.marginRight = "10px";
        //     colorsDiv.appendChild(swatch);
        // });
        document.body.appendChild(colorsDiv);
        for (let i=0; i<5;i++){
            document.getElementById(`${divs[i].id}`).style.backgroundColor = palette[i];
            document.getElementById(`${divs[i].id}Head`).textContent = palette[i];
            const rgb = hexToRgb(palette[i]);
            // const brightness = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
            
            document.getElementById(`${divs[i].id}`).style.color = getTextColor(rgb);


            // if (brightness > 220) {
            //     document.getElementById(`${divs[i].id}`).style.color = "#000000";
            // } else {
            //     document.getElementById(`${divs[i].id}`).style.color = "#ffffff";
            // }
        }
    } else {
        console.error(data.error);
    }

    loader.style.display = "none";

});


