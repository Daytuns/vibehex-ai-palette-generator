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
        palette.forEach(color => {
            const swatch = document.createElement("div");
            swatch.style.backgroundColor = color;
            swatch.style.width = "50px";
            swatch.style.height = "50px";
            swatch.style.marginRight = "10px";
            colorsDiv.appendChild(swatch);
        });
        document.body.appendChild(colorsDiv);
    } else {
        console.error(data.error);
    }
});
