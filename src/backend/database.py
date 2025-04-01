import os
from typing import List, Optional, Union
from pymongo import MongoClient
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from datetime import datetime
from fastapi import FastAPI, HTTPException
from bcrypt import bcrypt

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["notifications"]
collection = db["notifications"]
user_collections = db["users"]

app = FastAPI()

# def insert_notification_test(user_id):
#     notification = { 
#         "user_id": user_id
#     }
#     collection.insert_one(notification)
#     return "Notification added successfully"

class PolicyNotification(BaseModel):
    policy_id:int 
    subject:str
    body:str

class NewsNotification(BaseModel):
    expiration_Date:datetime
    type:str
    title:str
    details:str

class ClaimsNotification(BaseModel):
    insured_Name:str
    claimant_Name:str
    task_Type:str
    due_Date:datetime
    line_Business:str
    description:str

class BaseNotification(BaseModel):
    notification_id: int
    recipient_id: int
    sender_id: int
    app_type: str
    is_read: Optional[bool] = None  
    is_archived: Optional[bool] = None
    date_created: datetime
    subject: str
    details: Union[PolicyNotification, NewsNotification, ClaimsNotification]  # Embedded document

class UserCreate(BaseModel):
    username:str
    password:str

class UserLogin(BaseModel):
    username:str
    password:str

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
    collection.insert_one(notification_dict)
    return {"Message":"Notification added successfully"}

@app.patch("/notifications/{notification_id}")
def soft_delete_Notif(notification_id:int):
    res = collection.update_one({"_id":notification_id}, {"$set":{"is_Active":False}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404,detail="Notification not found")
    return {"Message" :"Notification deleted successfully"}


# Work in progress 
@app.patch("notifications/{notification_id}")
def update_Notifs(notification_id:int,attribute:str):
    if attribute not in ["is_Read","is_Archived"]:
        raise HTTPException(status_code=400,detail=f"Invalid attribute '{attribute}', must be 'is_Read' or 'is_Archived'.")
    notification = collection.find_one({"_id":notification_id,"is_Active":True},{attribute:1})
    new_val = not notification.get(attribute)
    res = collection.update_one({"_id":notification_id, "is_Active":True},{"$set":{attribute:new_val}})
    if res.matched_count ==0:
        raise HTTPException(status_code=404,detail="Notification not found")
    return {"Message":f"'{attribute}' toggled to {new_val}"}

#Need to make endpoints for USER created ID's USERNAME and hash PASSWORD
@app.post("/register")
def createUser(user: UserCreate):
    existed_username = user_collections.find_one({"username":user.username})
    if existed_username:
        raise HTTPException(status_code=400,detail="Username already taken.")
    user_data = {
        "username":user.username,
        "password":user.password
    }
    user_collections.insert_one(user_data)
    return{"Message":"User registered successfully."}

