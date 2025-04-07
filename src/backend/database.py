import os
from typing import List
from pymongo import MongoClient

from pydantic import BaseModel, Field
from dotenv import load_dotenv
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from uuid import uuid4

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["notifications"]
collection = db["notifications"]

app = FastAPI()

collection.update_many(
    {"is_Active": {"$exists": False}},
    {"$set": {"is_Active": True}}
)

for doc in collection.find():
    print(doc)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BaseNotification(BaseModel):
    notification_id:int
    Recipient_id:int
    Sender_id:int
    App_type:str
    is_Read:bool
    is_Archived:bool
    date_Created:datetime
    subject:str

class PolicyNotification(BaseNotification):
    policy_id:int 
    subject:str
    body:str



class NewsNotification(BaseNotification):
    expiration_Date:datetime
    type:str
    title:str
    details:str

class ClaimsNotification(BaseNotification):
    insured_Name:str
    claimant_Name:str
    task_Type:str
    due_Date:datetime
    line_Business:str
    description:str



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
def create_notification(notification_type: str, notification_data: dict):
    base_fields = {
        "notification_id": uuid4().int >> 96,
        "Recipient_id": 1,
        "Sender_id": 0,
        "App_type": "DuckPond",
        "date_Created": datetime.utcnow(),
        "is_Read": False,
        "is_Archived": False,
        "is_Active": True,
        "subject": notification_data.get("title") or notification_data.get("subject") or "Untitled"
    }

    if notification_type == "policy":
        notification = PolicyNotification(**{**base_fields, **notification_data})
    elif notification_type == "claims":
        notification = ClaimsNotification(**{**base_fields, **notification_data})
    elif notification_type == "news":
        notification = NewsNotification(**{**base_fields, **notification_data})
    else:
        raise HTTPException(status_code=400, detail="Invalid notification type")

    # Enforce is_Active = True even if it's missing or overridden
    notification_dict = notification.model_dump()
    notification_dict["is_Active"] = True

    collection.insert_one(notification_dict)
    return {"message": "Notification added successfully"}

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

@app.post("/register")
def createUser(user: UserCreate):
    existed_username = user_collections.find_one({"username":user.username})
    if existed_username:
        raise HTTPException(status_code=400,detail="Username already taken.")
    password = user.password
    bytes = password.encode('utf-8')
    hashed_pw = bcrypt.hashpw(bytes,bcrypt.gensalt())
    user_data = {
        "username":user.username,
        "password":hashed_pw
    }
    user_collections.insert_one(user_data)
    return{"Message":"User registered successfully."}