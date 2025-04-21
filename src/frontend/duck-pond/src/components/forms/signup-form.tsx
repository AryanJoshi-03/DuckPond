"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { registerUserAction } from "@/data/actions/auth-actions";
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

import {
  CardTitle,
  CardDescription,  
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { ZodErrors } from "@/components/custom/zod-errors";

const INITIAL_STATE = {
  data: null,
};

export function SignupForm() {
  const router = useRouter();
  const [formState, formAction] = useActionState(
    registerUserAction,
    INITIAL_STATE
  );
  
  // State to store form values
  const [formValues, setFormValues] = useState({
    first_Name: "",
    last_Name: "",
    username: "",
    email: "",
    password: "",
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  console.log("## will render on client ##");
  console.log(formState);
  console.log("###########################");

  // Show error toast if user already exists
  useEffect(() => {
    if (formState?.data === "bad") {
      if (formState?.existingUsernameError || formState?.existingEmailError || formState?.existingUserError) {
        toast.error(formState.message, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  }, [formState]);

  // Handle redirect after successful registration
  useEffect(() => {
    if (formState?.data === "ok" && formState?.redirect) {
      // Show success toast
      toast.success('Registration successful! Redirecting to sign in...', {
        duration: 3000,
        position: 'top-center',
      });
      
      // Redirect after a short delay to allow the toast to be seen
      const redirectTimer = setTimeout(() => {
        router.push(formState.redirect);
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [formState, router]);
  
  return (
    <div className="w-full max-w-md">
      <Toaster />
      <form action={formAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* First Name Field */}
            <div className="space-y-2">
              <Label htmlFor="first_Name">First Name</Label>
              <Input
                id="first_Name"
                name="first_Name"
                type="text"
                placeholder="John"
                value={formValues.first_Name}
                onChange={handleInputChange}
              />
              <ZodErrors error={formState?.zodErrors?.first_Name} />
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <Label htmlFor="last_Name">Last Name</Label>
              <Input
                id="last_Name"
                name="last_Name"
                type="text"
                placeholder="Doe"
                value={formValues.last_Name}
                onChange={handleInputChange}
              />
              <ZodErrors error={formState?.zodErrors?.last_Name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={formValues.username}
                onChange={handleInputChange}
                className={formState?.existingUsernameError ? "border-red-500" : ""}
              />
              <ZodErrors error={formState?.zodErrors?.username} />
              {formState?.existingUsernameError && (
                <p className="text-sm text-red-500">Username already exists</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formValues.email}
                onChange={handleInputChange}
                className={formState?.existingEmailError ? "border-red-500" : ""}
              />
              <ZodErrors error={formState?.zodErrors?.email} />
              {formState?.existingEmailError && (
                <p className="text-sm text-red-500">Email already exists</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                value={formValues.password}
                onChange={handleInputChange}
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <button className="w-full">Sign Up</button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Have an account?
          <Link className="underline ml-2" href="signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}