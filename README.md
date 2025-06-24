# AI Palette Generator

This is a fun and simple full-stack web app that generates color palettes based on your vibe. You type in a prompt like "sunset over the ocean" or "cyberpunk neon", and the app gives you a beautiful color palette inspired by that mood.

Built with:

- **Frontend:** HTML, CSS, and JavaScript (Vanilla)
- **Backend:** Node.js with Express
- **AI:** Uses an AI API to generate color palettes from text prompts

---

## How It Works

1. The user types a prompt describing a vibe or mood.
2. The frontend sends a POST request to the backend with the prompt.
3. The backend sends the prompt to the AI model and receives a generated palette.
4. The palette is returned as a JSON response and displayed on the frontend.
5. Each color block can be clicked to copy the hex code to the clipboard.

---

## Project Structure

<pre>
ai-palette-generator/
├── client/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── vibehex-backend/
│   └── server.js
├── .env
├── package.json
├── .gitignore
├── LICENSE
└── README.md
</pre>


---

### `LICENSE` (All Rights Reserved)

```markdown
All rights reserved.

Copyright (c) 2025 Dayton Baldizón

```
