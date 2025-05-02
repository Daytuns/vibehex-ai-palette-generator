
const firstDiv = document.getElementById('one');
const secondDiv = document.getElementById('two');
const thirdDiv = document.getElementById('three');
const fourthDiv = document.getElementById('four');
const fifthDiv = document.getElementById('five');
const divs = [firstDiv, secondDiv, thirdDiv, fourthDiv, fifthDiv];


document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const vibe = document.querySelector("input[type='text']").value;

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
        palette.forEach(color => {
            const swatch = document.createElement("div");
            swatch.style.backgroundColor = color;
            swatch.style.width = "50px";
            swatch.style.height = "50px";
            swatch.style.marginRight = "10px";
            colorsDiv.appendChild(swatch);
        });
        document.body.appendChild(colorsDiv);
        for (let i=0; i<5;i++){
            document.getElementById(`${divs[i].id}`).style.backgroundColor = palette[i];
            document.getElementById(`${divs[i].id}Head`).textContent = palette[i];
        }
    } else {
        console.error(data.error);
    }

});


