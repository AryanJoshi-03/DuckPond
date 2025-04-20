"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

const schemaRegister = z.object({
  username: z.string()
    .min(3, { message: "Username must be between 3 and 20 characters" })
    .max(20, { message: "Username must be between 3 and 20 characters" }),
  password: z.string()
    .min(6, { message: "Password must be between 6 and 100 characters" })
    .max(100, { message: "Password must be between 6 and 100 characters" }),
  email: z.string().email({
    message: "Please enter a valid email address"}),

  first_Name: z.string()
    .min(1, { message: "Must be at least 1 character" })
    .max(50, { message: "Cannot exceed 50 characters" }),
  last_Name: z.string()
    .min(1, { message: "Must be at least 1 character" })
    .max(50, { message: "Cannot exceed 50 characters" })
})

export async function registerUserAction(prevState: any, formData: FormData) {
  console.log("Hello From Register User Action");

  const validatedFields = schemaRegister.safeParse({
    first_Name: formData.get("first_Name"),
    last_Name: formData.get("last_Name"),
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      data: "bad",
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }
  
  // 2. Send to backend
  try {
    const response = await fetch(`http://127.0.0.1:8000/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      // Check if the error is due to existing user
      if (responseData.detail && responseData.detail.includes("already taken")) {
        // Check if the error is specifically for username or email
        const errorMessage = responseData.detail.toLowerCase();
        
        if (errorMessage.includes("username")) {
          return {
            ...prevState,
            data: "bad",
            message: "Username already exists. Please choose a different username.",
            existingUsernameError: true
          };
        } else if (errorMessage.includes("email")) {
          return {
            ...prevState,
            data: "bad",
            message: "Email already exists. Please use a different email address.",
            existingEmailError: true
          };
        } else {
          return {
            ...prevState,
            data: "bad",
            message: "Username or email already exists. Please try a different one.",
            existingUserError: true
          };
        }
      }
      
      return {
        ...prevState,
        data: "bad",
        message: responseData.message || "Registration failed",
      };
    }

    // Return success with redirect flag
    return {
      ...prevState,
      data: "ok",
      message: "Registration successful!",
      redirect: "/signin"
    };
    
  } catch (error) {
    return {
      ...prevState,
      data: "bad",
      message: "Network error",
    };
  }
}






