"use client";

import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/ui/profile-card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: session } = useSession();
  const [isEditable, setIsEditable] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState(session?.user.username);
  const debouncedUsername = useDebounceCallback(setUsername, 400);
  const router = useRouter();
  console.log("session is====>", session?.user);

  const form = useForm({
    values: {
      username: session?.user.username,
      email: session?.user.email,
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );

          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/update-details", data);

      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error in signup of user", error);
      toast.error(`error in signup ${axiosError.response?.data.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className=" flex flex-col mt-12   min-h-screen bg-transparent  items-center ">
        <ProfileCard className="mb-10" />
        <div className="w-[50vw] p-6 text-white shadow-sm shadow-amber-400 rounded-2xl">
          <div className="flex flex-col ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className={`border-none  mt-2 ${!isEditable ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 focus-visible:ring-0" : "bg-gray-400 text-black"}  `}
                          placeholder="Enter username"
                          {...field}
                          readOnly={!isEditable}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            debouncedUsername(e.target.value);
                          }}
                        />
                      </FormControl>
                      {isCheckingUsername && (
                        <Loader className="animate-spin" />
                      )}
                      <p
                        className={`text-sm ${usernameMessage === "username is unique" ? "text-green-400" : "text-red-400"}`}
                      >
                        {" "}
                        {usernameMessage}
                      </p>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className={`border-none mt-2  ${!isEditable ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 focus-visible:ring-0" : "bg-gray-400 text-black"} `}
                          placeholder="Enter Email"
                          {...field}
                          readOnly={!isEditable}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={!isEditable || isSubmitting}
                  className="mt-6 mx-4 shadow-sm bg-gradient-to-r  from-gray-400 via-gray-600 to-gray-900 bg-[length:200%_100%]   bg-right hover:bg-left  hover:text-black transition-all ease-in-out duration-400"
                >
                  Submit
                </Button>
              </form>
            </Form>
            <div>
              <Button
                disabled={isEditable || isSubmitting}
                className="mt-6 mx-4 shadow-sm bg-gradient-to-r  from-gray-400 via-gray-600 to-gray-900 bg-[length:200%_100%]   bg-right hover:bg-left  hover:text-black transition-all ease-in-out duration-400"
                onClick={() => setIsEditable(!isEditable)}
              >
                Edit
              </Button>
              {isEditable ? (
                <Button
                  disabled={isSubmitting}
                  className="mt-6 mx-4 border-2 bg-black border-gray-600 text-red-400 shadow-sm hover:bg-gradient-to-r  from-gray-400 via-gray-600 to-black bg-[length:200%_100%]   bg-right hover:bg-left  hover:text-black transition-all ease-in-out duration-400"
                  onClick={() => setIsEditable(!isEditable)}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
