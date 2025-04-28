import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from database import app  # Assuming the FastAPI app is in the database.py file
import bcrypt

client = TestClient(app)

# Mocking database collections using MagicMock
mock_notifications_collection = MagicMock()
mock_userNotifications_collection = MagicMock()
mock_user_collection = MagicMock()

# Use a fixture to mock out the database collections for the whole test
@pytest.fixture(scope="module", autouse=True)
def mock_database():
    with patch("database.notifications_collection", mock_notifications_collection), \
         patch("database.userNotifications_collection", mock_userNotifications_collection), \
         patch("database.user_collection", mock_user_collection):
        yield


def test_login_user():
    # Mock user login data and MongoDB behavior
    mock_user = {
        "_id": "12345",  # This is an ObjectId in MongoDB, but we treat it as a string here
        "username": "johndoe",
        "email": "johndoe@example.com",
        "password": bcrypt.hashpw("testpassword".encode('utf-8'), bcrypt.gensalt()),  # Mock a hashed password
        "first_Name": "John",  # Add missing field
        "last_Name": "Doe",    # Add missing field
        "user_Type": "Employee"
    }

    # Mocking the return value of find_one to simulate MongoDB
    mock_user_collection.find_one.return_value = mock_user  # Mock the return value of find_one

    # Test data for login
    login_data = {
        "user_ID": 12345,  # Ensure this matches the test user's ID as an integer
        "email": "johndoe@example.com",  # Provide email as required
        "username": "johndoe",  # Provide username as required
        "password": "testpassword"  # Ensure this matches the test user's password
    }

    # Make the POST request with login data
    response = client.post("/login", json=login_data)

    # Debugging output to see what the response returns
    print(response.json())

    # Assert that the response status code is 200 (OK)
    assert response.status_code == 200  # Should return a status code 200 if login is successful

    # Optionally, check for the presence of the token or other fields in the response
    assert "token" in response.json()  # Should return a token if login is successful


def test_get_notifications_user():
    # Mock user and notification data
    user_id = "68056825f8e85224148070e1"
    mock_notification = {
        "notification_id": 1,
        "Sender_id": "sender",
        "Sender_email": "sender@example.com",
        "App_type": "DuckPond",
        "is_Read": False,
        "is_Archived": False,
        "date_Created": "2025-04-21T01:56:44.950+00:00",
        "subject": "Test Notification",
        "notification_type": "policy",
        "flag": "important",
        "details": {"policy_id": 1, "body": "Test policy notification"},
        "is_Active": True
    }

    # Mock the user-notification relationship
    mock_userNotifications_collection.find.return_value = [{"notification_id": 1, "user_id": user_id}]
    mock_notifications_collection.find.return_value = [mock_notification]

    # Fetch notifications for the user
    response = client.get(f"/notifications/user/{user_id}")

    assert response.status_code == 200
    assert len(response.json()) > 0  # Should return at least one notification


def test_create_notification():
    notification_data = {
        "Sender_id": "12345",
        "Sender_email": "sender@example.com",
        "App_type": "DuckPond",
        "is_Read": False,
        "is_Archived": False,
        "date_Created": "2025-04-21T01:56:44.950+00:00",
        "subject": "Test Notification",
        "notification_type": "policy",
        "flag": "important",
        "details": {"policy_id": 1, "body": "Test policy notification"},
        "Recipient_id": ["68056825f8e85224148070e1"]  # Add recipient IDs
    }

    # Mock insert behavior
    mock_notifications_collection.insert_one.return_value = MagicMock(inserted_id="notification_id_123")
    mock_userNotifications_collection.insert_many.return_value = None  # Simulate successful insertion

    response = client.post("/notifications/policy", json=notification_data)

    assert response.status_code == 200
    assert "notification_id" in response.json()  # Should return the ID of the created notification


def test_soft_delete_notification():
    notification_id = 1  # Example ID

    # Mock the update_one method to simulate successful soft deletion
    mock_notifications_collection.update_one.return_value = MagicMock(matched_count=1)

    response = client.patch(f"/notifications/{notification_id}")

    assert response.status_code == 200  # Should return status code 200


def test_search_notifications():
    search_query = "Search"
    mock_notification = {
        "notification_id": 1,
        "Sender_id": "sender",
        "Sender_email": "sender@example.com",
        "App_type": "DuckPond",
        "is_Read": False,
        "is_Archived": False,
        "date_Created": "2025-04-21T01:56:44.950+00:00",
        "subject": "Search Test",
        "notification_type": "policy",
        "flag": "important",
        "details": {"policy_id": 1, "body": "Search test policy notification"},
        "is_Active": True
    }

    # Mock the search results
    mock_notifications_collection.find.return_value = [mock_notification]

    response = client.get(f"/notifications/search?query={search_query}")

    assert response.status_code == 200
    assert len(response.json()) > 0  # Should return at least one matching notification