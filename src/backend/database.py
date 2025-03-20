import os
from pymongo import MongoClient
from pydantic import BaseModel
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

class PolicyNotification(BaseModel):
    policy_id:str
    userId:str
    subject:str
    body:str
    is_Read:bool = False
    is_Archived:bool = False

class NewsNotification(BaseModel):
    userId:str
    is_Read:bool = False
    created_Date:str
    expiration_Date:str
    type:str
    title:str
    details:str

class ClaimsNotification(BaseModel):
    insured_Name:str
    claimant_Name:str
    task_Type:str
    username:str
    due_Date:str
    line_Business:str
    description:str
    priority:str
    is_Completed:bool = False




def get_notifications_test():
    return list(collection.find({}, {"_id": 0}))