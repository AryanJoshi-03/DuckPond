"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

const schemaSignIn = z.object({
  identifier: z.string().min(1, { message: "Username or email is required" }),
  password: z.string().min(1, { message: "Password is required" })
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

export async function signInUserAction(prevState: any, formData: FormData) {
  console.log("Hello From Sign In User Action");

  const validatedFields = schemaSignIn.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      data: "bad",
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Sign In.",
    };
  }

  // Determine if identifier is email or username
  const identifier = validatedFields.data.identifier;
  const isEmail = identifier.includes("@");
  
  // Prepare login data
  const loginData = {
    username: isEmail ? "" : identifier,
    email: isEmail ? identifier : "",
    password: validatedFields.data.password,
    user_ID: 0 // This will be set by the backend
  };
  console.log(loginData)
  try {
    const response = await fetch(`http://127.0.0.1:8000/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        ...prevState,
        data: "bad",
        message: responseData.detail || "Invalid username/email or password",
        invalidCredentials: true
      };
    }

    // Return success with token and redirect flag
    return {
      ...prevState,
      data: "ok",
      message: "Sign in successful!",
      token: responseData.token, // Include the token in the response
      redirect: "/home"
    };
    
  } catch (error) {
    return {
      ...prevState,
      data: "bad",
      message: "Network error",
    };
  }
}

export async function signOutUserAction() {
  try {
    // Clear the token cookie on the server side
    const cookieStore = await cookies();
    cookieStore.set('token', '', { 
      expires: new Date(0),
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Return success with redirect to sign-in page
    return {
      data: "ok",
      message: "Signed out successfully",
      redirect: "/signin"
    };
  } catch (error) {
    return {
      data: "bad",
      message: "Error signing out",
      error: error
    };
  }
}






