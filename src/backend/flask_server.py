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
                {"role": "system", "content": """You are an expert notification assistant. You must respond ONLY in valid JSON format that matches the following structure:
{
  "notificationType": "policy|news|claims",
  "title": "Notification Title",
  "body": "Notification Body",
  "flag": "normal|important|info",
  "policyId": "123",  // for policy notifications
  "expirationDate": "2024-12-31",  // for news notifications
  "type": "News Type",
  "newsdetails": "News Details",
  "insuredName": "John Doe",  // for claims notifications
  "claimantName": "Jane Smith",
  "taskType": "Task Type",
  "dueDate": "2024-12-31",
  "lineBusiness": "Business Line",
  "description": "Claim Description",
  "selectedUsers": ["user1", "user2"]  // optional
}

Rules:
1. Only include fields relevant to the notification type
2. Dates must be in YYYY-MM-DD format
3. Flag must be one of: normal, important, info
4. notificationType must be one of: policy, news, claims
5. Do not include any explanatory text, only the JSON object
6. Ensure all required fields for the notification type are included"""},
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
