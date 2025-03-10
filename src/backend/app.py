import streamlit as st
from database import insert_notification_test, get_notifications_test

st.title("Notifications Dashboard")


if st.button("Add Test Notification"):
    insert_notification_test("1")
    st.success("Notification Added!")


st.subheader("Stored Notifications")
notifications = get_notifications_test()
st.json(notifications)