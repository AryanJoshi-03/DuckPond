import os
from typing import List
from pymongo import MongoClient
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from datetime import datetime
from fastapi import FastAPI, HTTPException

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["notifications"]
collection = db["notifications"]

app = FastAPI()

# def insert_notification_test(user_id):
#     notification = { 
#         "user_id": user_id
#     }
#     collection.insert_one(notification)
#     return "Notification added successfully"

class PolicyNotification(BaseModel):
    policy_id:int 
    userId:int  
    subject:str
    body:str
    is_Read:bool = False
    is_Archived:bool = False
    is_Active:bool = True


class NewsNotification(BaseModel):
    userId:int
    is_Read:bool = False
    created_Date:datetime
    expiration_Date:datetime
    type:str
    title:str
    details:str
    is_Active:bool = True


class ClaimsNotification(BaseModel):
    userID:int
    insured_Name:str
    claimant_Name:str
    task_Type:str
    username:str
    due_Date:datetime
    line_Business:str
    description:str
    priority:int
    is_Completed:bool = False
    is_Active:bool = True


#Get all notifications
@app.get("/notifications", response_model=List[dict])
def get_all_notifications():
    return list(collection.find({"is_Active":True}, {"_id": 0}))

#Get notification depending on user_id **CAN CHANGE**
@app.get("/notifications/user/{user_id}",response_model=dict)
def get_notification_user(user_id:int):
    user_notif = list(collection.find({"user_Id":user_id,"is_Active":True}, {"_id":0}))
    if not user_notif:
        raise HTTPException(status_code=404,detail=f"No notification found for user_id '{user_id}'.")
    return user_notif

#Create a notification depending on type
@app.post("/notifications/{notification_type}")
def create_notification(notification_type:str, notification_data:dict):
    if notification_type not in ["policy", "news","claims"]:
        raise HTTPException(status_code=400,detail = f"Invalid notification type '{notification_type}. Must be 'policy', 'news', or 'claims'.")

    if notification_type == "policy":
        notification = PolicyNotification(**notification_data)
    elif notification_type == "claims":
        notification = ClaimsNotification(**notification_data)
    elif notification_type == "news":
        notification = NewsNotification(**notification_data)

    notification_dict = notification.model_dump()
    notification_dict["type"] = notification_type
    collection.insert_one(notification_dict)
    return {"Message":"Notification added successfully"}

@app.patch("/notifications/{notification_id}")
def soft_delete_Notif(notification_id:int):
    res = collection.update_one({"_id":notification_id}, {"$set":{"is_Active":False}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404,detail="Notification not found")
    return {"Message" :"Notification deleted successfully"}