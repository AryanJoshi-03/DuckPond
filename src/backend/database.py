import os
from typing import List, Union
from pymongo import MongoClient

from pydantic import BaseModel, Field
from dotenv import load_dotenv
from datetime import datetime

from fastapi import FastAPI, HTTPException

from fastapi.middleware.cors import CORSMiddleware

from uuid import uuid4

import bcrypt


from fastapi import Query
from pymongo import ASCENDING, DESCENDING

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["notifications"]
notifications_collection = db["notifications"]
userNotifications_collection = db["userNotifications"]
user_collection = db["users"]

app = FastAPI()

notifications_collection.update_many(
    {"is_Active": {"$exists": False}},
    {"$set": {"is_Active": True}}
)

# for doc in notifications.find():
#     print(doc)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PolicyNotification(BaseModel):
    policy_id:int 
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
    notification_id:int
    Sender_id:int
    App_type:str
    is_Read:bool
    is_Archived:bool
    date_Created:datetime
    subject:str
    notification_type:str
    flag:str
    details: Union[PolicyNotification, NewsNotification, ClaimsNotification]
    
class UserCreate(BaseModel):
    first_Name:str
    last_Name:str
    email:str
    username:str
    password:str
    user_Type:str = Field(default="Employee")

class UserLogin(BaseModel):
    user_ID:int
    email:str
    username:str
    password:str



#Get all notifications
@app.get("/notifications/", response_model=List[dict])
def get_all_notifications():
    return list(notifications_collection.find({"is_Active":True}, {"_id": 0}))

#Get notification depending on user_id **CAN CHANGE**
@app.get("/notifications/user/{user_id}",response_model=List[dict])
def get_notification_user(user_id: int):
    notification_ids_list = [notif["notification_id"] for notif in list(userNotifications_collection.find({"user_id": user_id}, {"_id": 0}))]
    user_notif = list(notifications_collection.find({"notification_id": {"$in": notification_ids_list}, "is_Active": True}, {"_id": 0}))
    if not user_notif:
        raise HTTPException(status_code=404, detail=f"No notification found for user_id '{user_id}'.")
    return user_notif

#Create a notification depending on type
@app.post("/notifications/{notification_type}")
def create_notification(notification_type: str, notification_data: dict):
    notifID = uuid4().int >> 96

    base_fields = {
        "notification_id": notifID,
        "Sender_id": 0,
        "App_type": "DuckPond",
        "is_Read": False,
        "is_Archived": False,
        "is_Active": True,
        "date_Created": datetime.now(),
        "notification_type":notification_type,
        "subject": notification_data.get("title") or notification_data.get("subject") or "Untitled",
        "details":{}
    }

    if notification_type == "policy":
        notification = BaseNotification(**{
            **base_fields,
            **notification_data,
            "details": PolicyNotification(**notification_data["details"])
        })
    elif notification_type == "claims":
        notification = BaseNotification(**{
            **base_fields,
            **notification_data,
            "details": ClaimsNotification(**notification_data["details"])
        })
    elif notification_type == "news":
        notification = BaseNotification(**{
            **base_fields,
            **notification_data,
            "details": NewsNotification(**notification_data["details"])
        })
    else:
        raise HTTPException(status_code=400, detail="Invalid notification type")

    # Enforce is_Active = True even if it's missing or overridden
    notification_dict = notification.model_dump()
    notification_dict["is_Active"] = True

    userNotifs = []
    for userId in notification_data["Recipient_id"]:
        userNotifs.append(
        {
            "notification_id": notifID,
            "user_id":userId
        })
    userNotifications_collection.insert_many(userNotifs)

    notifications_collection.insert_one(notification_dict)
    return {"message": "Notification added successfully"}

@app.patch("/notifications/{notification_id}")
def soft_delete_Notif(notification_id:int):
    res = notifications_collection.update_one({"_id":notification_id}, {"$set":{"is_Active":False}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404,detail="Notification not found")
    return {"Message" :"Notification deleted successfully"}


# Work in progress 
@app.patch("notifications/{notification_id}")
def update_Notifs(notification_id:int,attribute:str):
    if attribute not in ["is_Read","is_Archived"]:
        raise HTTPException(status_code=400,detail=f"Invalid attribute '{attribute}', must be 'is_Read' or 'is_Archived'.")
    notification = notifications_collection.find_one({"_id":notification_id,"is_Active":True},{attribute:1})
    new_val = not notification.get(attribute)
    res = notifications_collection.update_one({"_id":notification_id, "is_Active":True},{"$set":{attribute:new_val}})
    if res.matched_count ==0:
        raise HTTPException(status_code=404,detail="Notification not found")
    return {"Message":f"'{attribute}' toggled to {new_val}"}

# Need to make endpoints for USER created ID's USERNAME and hash PASSWORD
@app.post("/signup")
def createUser(user: UserCreate):
    
    # print(f"Received user data: {user.dict()}")  # Add this line

    existed_username = user_collection.find_one({"username":user.username,"email":user.email})
    if existed_username:
        raise HTTPException(status_code=400,detail="Username already taken.")
    password = user.password
    bytes = password.encode('utf-8')
    hashed_pw = bcrypt.hashpw(bytes,bcrypt.gensalt())
    user_data = {
        "first_Name":user.first_Name,
        "last_Name":user.last_Name,
        "email":user.email,
        "username":user.username,
        "password":hashed_pw,
        "user_Type":"Employee"
    }
    user_collection.insert_one(user_data)
    return{"Message":"User registered successfully."}

@app.post("/login")
def loginUser(user: UserLogin):
    user_data = user_collection.find_one({"username":user.username,"email":user.email})
    if not user_data:
        raise HTTPException(status_code=400,detail="Invalid username or password.")
    hashed_pw = user_data["password"]
    if bcrypt.checkpw(user.password.encode('utf-8'),hashed_pw):
        return {"Message":"Login successful."}
    else:
        raise HTTPException(status_code=400,detail="Invalid username or password.")

# Andrew Bell Search bar function help from chat
# Create a text index on all string fields

@app.get("/notifications/search", response_model=List[dict])
def fieldwise_search(query: str):
    # Define the fields to search in
    fields_to_search = [
        "subject", "title", "details", "description",
        "body", "insured_Name", "claimant_Name", "task_Type"
    ]

    # Create the $or regex query
    regex_query = {
        "$or": [
            {field: {"$regex": query, "$options": "i"}} for field in fields_to_search
        ],
        "is_Active": True
    }

    # Run the query
    results = list(collection.find(regex_query, {"_id": 0}))
    return results