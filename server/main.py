import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import google.generativeai as genai

# Load .env file
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create Flask app
app = Flask(__name__)
CORS(app)

# Instantiate Gemini model (correct name)
model = genai.GenerativeModel("models/gemini-2.0-flash")
# for model in genai.list_models():
#     print(model.name)

@app.route("/generate-palette", methods=["POST"])
def generate_palette():
    data = request.get_json()
    vibe = data.get("vibe")

    if not vibe:
        return jsonify({"error": "No vibe provided"}), 400

    prompt = (
    f"Only return a Python list of 5 hexadecimal color codes that match this vibe: '{vibe}'. "
    "No explanation. No labels. Just the list."
)


    try:
        response = model.generate_content(prompt)
        result = response.text.strip()
        return jsonify({"palette": result})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
