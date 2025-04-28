from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
 
@app.route('/ai', methods=['POST'])
def generate_email():
    data = request.json
    prompt = data.get('prompt')

    print(prompt)

    if not prompt:
        return jsonify({'error': 'Missing required fields.'}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert email assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500,
        )

        ai_message = response.choices[0].message.content
        print(ai_message)
        return jsonify({'response': ai_message})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Something went wrong generating a response.'}), 500

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)
