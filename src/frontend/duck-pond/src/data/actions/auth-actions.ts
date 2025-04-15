"use server";

import { z } from "zod";

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
  
  // return {
  //   ...prevState,
  //   data: "ok",
  //   firstname: formData.get("firstname"),
  //   lastname: formData.get("lastname"),
  //   username: formData.get("username"),
  //   password: formData.get("password"),
  //   email: formData.get("email"),
  // };

  // 2. Send to backend
  try {
    const response = await fetch(`http://127.0.0.1:8000/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        ...prevState,
        data: "bad",
        message: error.message || "Registration failed",
      };
    }

    // const user = await response.json();
    return {
      ...prevState,
      data: "ok",
      // user,  // Pass backend response to formState
      message: "Registration successful!",
    };

  } catch (error) {
    return {
      ...prevState,
      data: "bad",
      message: "Network error",
    };
  }
}






