import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["notifications"]
collection = db["notifications"]

def insert_notification_test(user_id):
    notification = { 
        "user_id": user_id
    }
    collection.insert_one(notification)
    return "Notification added successfully"

def get_notifications_test():
    return list(collection.find({}, {"_id": 0}))