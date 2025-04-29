import os
import jwt
from typing import List, Union, Optional
from pymongo import MongoClient

from pydantic import BaseModel, Field
from dotenv import load_dotenv
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException,status, Response

from fastapi.middleware.cors import CORSMiddleware

from uuid import uuid4

import bcrypt


from fastapi import Query
from pymongo import ASCENDING, DESCENDING
from bson import ObjectId

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
    expiration_Date: Optional[datetime] = Field(default_factory=lambda: datetime.now() + timedelta(days=365))
    type: Optional[str] = Field(default="general")
    title: Optional[str] = Field(default="")
    details: Optional[str] = Field(default="")

    class Config:
        extra = "allow"  # Allow extra fields

class ClaimsNotification(BaseModel):
    insured_Name:str
    claimant_Name:str
    task_Type:str
    due_Date:datetime
    line_Business:str
    description:str

class BaseNotification(BaseModel):
    notification_id:int
    Sender_id:str
    Sender_email:str
    App_type:str
    is_Read:bool
    is_Archived:bool
    is_Drafted: bool = False
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
def get_notification_user(user_id: str):
    # Find all user notifications for this user
    user_notifications = list(userNotifications_collection.find({"user_id": user_id}, {"_id": 0}))
    
    # Extract notification IDs
    notification_ids_list = [notif["notification_id"] for notif in user_notifications]
    
    # If no notifications found, return empty list instead of error
    if not notification_ids_list:
        return []
    
    # Find all notifications with these IDs
    user_notif = list(notifications_collection.find({"notification_id": {"$in": notification_ids_list}, "is_Active": True}, {"_id": 0}))
    return user_notif

@app.get("/notifications/sent/user/{user_id}",response_model=List[dict])
def get_sent_notification_user(user_id: str):
    try:
        # Always use user_id as a string for Sender_id
        # Find all active notifications sent by this user
        sent_notifications = list(notifications_collection.find(
            {"Sender_id": user_id, "is_Active": True}, 
            {"_id": 0}
        ))
        
        # If no notifications found, return empty list
        if not sent_notifications:
            return []
        
        # Process each notification
        for notif in sent_notifications:
            notif_id = notif["notification_id"]
            
            # Get all recipients for this notification
            all_recipients = list(userNotifications_collection.find(
                {"notification_id": notif_id}, 
                {"_id": 0}
            ))
            
            # Extract user IDs
            all_user_ids = [recipient["user_id"] for recipient in all_recipients]
            
            # Get user emails with error handling
            all_user_emails = []
            for user_id in all_user_ids:
                try:
                    # Convert string ID to ObjectId
                    object_id = ObjectId(user_id)
                    # Get the user document with all fields except password
                    user = user_collection.find_one({"_id": object_id}, {"_id": 0, "password": 0})
                    
                    if user:
                        # Check if user exists and has an email
                        if "email" in user and user["email"]:
                            all_user_emails.append(user["email"])
                        else:
                            # If no email found, try to use username or a fallback
                            if "username" in user and user["username"]:
                                all_user_emails.append(user["username"])
                            else:
                                all_user_emails.append(f"User {user_id}")
                    else:
                        all_user_emails.append(f"User {user_id}")
                except Exception as e:
                    print(f"Error getting user {user_id}: {str(e)}")
                    all_user_emails.append(f"User {user_id}")
            
            notif["sent_to"] = all_user_emails
        
        return sent_notifications
    except Exception as e:
        # Log the error and return an empty list
        print(f"Error in get_sent_notification_user: {str(e)}")
        return []

#Create a notification depending on type
@app.post("/notifications/{notification_type}")
def create_notification(notification_type: str, notification_data: dict):
    # Validate notification data
    if "Recipient_id" not in notification_data or not notification_data["Recipient_id"]:
        raise HTTPException(status_code=400, detail="Recipient_id is required and cannot be empty")
    
    # Generate a unique notification ID
    notifID = uuid4().int >> 96

    base_fields = {
        "notification_id": notifID,
        "Sender_id": 0,
        "App_type": "DuckPond",
        "is_Read": False,
        "is_Archived": False,
        "is_Active": True,
        "is_Drafted": notification_data.get("is_Drafted", False),
        "date_Created": datetime.now(),
        "notification_type": notification_type,
        "subject": notification_data.get("title") or notification_data.get("subject") or "Untitled",
        "details": {}
    }

    # Process notification based on type
    if notification_type == "policy":
        notification = BaseNotification(**{
            **base_fields,
            **notification_data,
            "details": PolicyNotification(**notification_data.get("details", {}))
        })
    elif notification_type == "claims":
        # Convert ISO string to datetime for claims notification
        if "details" in notification_data and "due_Date" in notification_data["details"]:
            notification_data["details"]["due_Date"] = datetime.fromisoformat(notification_data["details"]["due_Date"].replace("Z", "+00:00"))
        notification = BaseNotification(**{
            **base_fields,
            **notification_data,
            "details": ClaimsNotification(**notification_data.get("details", {}))
        })
    elif notification_type == "news":
        # Handle news notification data
        news_details = notification_data.get("details", {})
        if isinstance(news_details, str):
            news_details = {"details": news_details}
        elif not isinstance(news_details, dict):
            news_details = {"details": str(news_details)}
        
        # Ensure all required fields are present
        news_data = {
            "expiration_Date": news_details.get("expiration_Date", datetime.now() + timedelta(days=365)),
            "type": news_details.get("type", "general"),
            "title": news_details.get("title", ""),
            "details": news_details.get("details", "")
        }
        
        notification = BaseNotification(**{
            **base_fields,
            **notification_data,
            "details": NewsNotification(**news_data)
        })
    else:
        raise HTTPException(status_code=400, detail="Invalid notification type")

    # Enforce is_Active = True even if it's missing or overridden
    notification_dict = notification.model_dump()
    notification_dict["is_Active"] = True

    # Create user notification entries
    try:
        # First, insert the notification
        notifications_collection.insert_one(notification_dict)
        
        # Then, create simplified user notification entries with only notification_id and user_id
        userNotifs = []
        for userId in notification_data["Recipient_id"]:
            userNotifs.append({
                "notification_id": notifID,
                "user_id": userId
            })
        
        # Insert all user notifications in a single operation
        if userNotifs:
            userNotifications_collection.insert_many(userNotifs)

        return {"message": "Notification added successfully", "notification_id": notifID}
    except Exception as e:
        # If there's an error, attempt to clean up
        notifications_collection.delete_one({"notification_id": notifID})
        raise HTTPException(status_code=500, detail=f"Error creating notification: {str(e)}")

@app.patch("/notifications/{notification_id}")
def soft_delete_Notif(notification_id:int):
    res = notifications_collection.update_one({"notification_id": notification_id}, {"$set":{"is_Active":False}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404,detail="Notification not found")
    return {"Message" :"Notification deleted successfully"}


# Mark notification as read
@app.patch("/notifications/{notification_id}/read",status_code=status.HTTP_204_NO_CONTENT,summary="Idempotently mark a notification as read")
def mark_notification_as_read(notification_id: int):
    # This filter matches only active notifications;
    # if none match, update_one will do nothing but not error.
    notifications_collection.update_one(
        {"notification_id": notification_id, "is_Active": True},
        {"$set": {"is_Read": True}}
    )
    # Always return 204 regardless of whether a doc was found/modified.
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Work in progress 
@app.patch("notifications/{notification_id}")
def update_Notifs(notification_id:int,attribute:str):
    if attribute not in ["is_Read","is_Archived"]:
        raise HTTPException(status_code=400,detail=f"Invalid attribute '{attribute}', must be 'is_Read' or 'is_Archived'.")
    notification = notifications_collection.find_one({"notification_id":notification_id,"is_Active":True},{attribute:1})
    new_val = not notification.get(attribute)
    res = notifications_collection.update_one({"notification_id":notification_id, "is_Active":True},{"$set":{attribute:new_val}})
    if res.matched_count ==0:
        raise HTTPException(status_code=404,detail="Notification not found")
    return {"Message":f"'{attribute}' toggled to {new_val}"}


# Need to make endpoints for USER created ID's USERNAME and hash PASSWORD
@app.post("/signup")
def createUser(user: UserCreate):
    
    # print(f"Received user data: {user.dict()}")  # Add this line

    # Check if username already exists
    existed_username = user_collection.find_one({"username": user.username})
    if existed_username:
        raise HTTPException(status_code=400, detail="Username already taken.")
    
    # Check if email already exists
    existed_email = user_collection.find_one({"email": user.email})
    if existed_email:
        raise HTTPException(status_code=400, detail="Email already taken.")
    
    # If both checks pass, proceed with user creation
    password = user.password
    bytes = password.encode('utf-8')
    hashed_pw = bcrypt.hashpw(bytes, bcrypt.gensalt())
    user_data = {
        "first_Name": user.first_Name,
        "last_Name": user.last_Name,
        "email": user.email,
        "username": user.username,
        "password": hashed_pw,
        "user_Type": "Employee"
    }
    user_collection.insert_one(user_data)
    return {"Message": "User registered successfully."}

JWT_SECRET = "your_jwt_secret_key"
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 1440  # 24 hours

@app.post("/login")
def loginUser(user: UserLogin):
    # Check if identifier is email or username
    if user.username != "":  # If username field contains email
        user_data = user_collection.find_one({"username": user.username})
    else:
        user_data = user_collection.find_one({"email": user.email})
    
    if not user_data:
        raise HTTPException(
            status_code=400,
            detail="Invalid username/email or password."
        )
    
    # Verify password
    hashed_pw = user_data["password"]
    if bcrypt.checkpw(user.password.encode('utf-8'), hashed_pw):
        # Generate a token (you might want to use JWT or another token generation method)
        payload = {
            "id": str(user_data["_id"]),
            "email": user_data["email"],
            "first_Name": user_data["first_Name"],
            "last_Name": user_data["last_Name"],
            "username": user_data["username"],
            "exp": datetime.now() + timedelta(minutes=JWT_EXPIRE_MINUTES)
        }
        
        # Generate JWT token
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        # Return user data and token

        return {
            "message": "Login successful.",
            "token": token,
            "user": {
                "id": str(user_data["_id"]),
                "username": user_data["username"],
                "email": user_data["email"],
                "first_Name": user_data["first_Name"],
                "last_Name": user_data["last_Name"],
                "user_Type": user_data["user_Type"]
            }
        }
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid username/email or password."
        )

# Andrew Bell Search bar function help from chat
# Create a text index on all string fields

@app.get("/notifications/search", response_model=List[dict])
def fieldwise_search(query: str):
    # Define the fields to search in
    fields_to_search = [
        "subject",
        "Sender_email",
        "Sender_id",
        "details.body",         
        "details.details",      
        "details.description",  
        "title",                
        "description",          
        "body",                 
        "insured_Name",
        "claimant_Name",
        "task_Type"
    ]

    # Create the $or regex query
    regex_query = {
        "$or": [
            {field: {"$regex": query, "$options": "i"}} for field in fields_to_search
        ],
        "is_Active": True
    }

    # Run the query
    results = list(notifications_collection.find(regex_query, {"_id": 0}))
    
    # Return results (empty list if no notifications are found)
    return results


@app.get("/users", response_model=List[dict])
def get_users():
    users = list(user_collection.find({}, {"password": 0}))  # Exclude passwords
    for user in users:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
    return users
