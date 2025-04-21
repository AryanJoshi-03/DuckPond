"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { signInUserAction } from "@/data/actions/auth-actions";
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

export function SigninForm() {
  const router = useRouter();
  const [formState, formAction] = useActionState(
    signInUserAction,
    INITIAL_STATE
  );
  
  // State to store form values
  const [formValues, setFormValues] = useState({
    identifier: "",
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

  // Show error toast if credentials are invalid
  useEffect(() => {
    if (formState?.data === "bad") {
      if (formState?.invalidCredentials) {
        toast.error(formState.message, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  }, [formState]);

  // Handle redirect and cookie setting after successful sign in
  useEffect(() => {
    if (formState?.data === "ok" && formState?.redirect) {
      // Set the token in cookies
      if (formState.token) {
        document.cookie = `token=${formState.token}; path=/; secure; samesite=lax`;
        console.log('Token set in cookies:', formState.token);
      }

      // Show success toast
      toast.success('Sign in successful! Redirecting...', {
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
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your details to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="username or email"
                value={formValues.identifier}
                onChange={handleInputChange}
                className={formState?.invalidCredentials ? "border-red-500" : ""}
              />
              <ZodErrors error={formState?.zodErrors?.identifier} />
              {formState?.invalidCredentials && (
                <p className="text-sm text-red-500">Invalid username/email or password</p>
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
                className={formState?.invalidCredentials ? "border-red-500" : ""}
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <button className="w-full">Sign In</button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Don't have an account?
          <Link className="underline ml-2" href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}