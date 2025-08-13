"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Message } from "@/model/User";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  // const handleDeleteConfirm = async () => {
  //   const response = await axios.delete<ApiResponse>(
  //     `/api/delete-message/${message._id}`
  //   );

  //   toast(response.data.message);
  // };

  const date = new Date(message.createdAt);

  return (
    <Card className="w-[400px] overflow-hidden m-0 bg-gray-900 border-none shadow-md shadow-gray-700 text-white  ">
      <CardTitle className="ml-0 mt-[-25px] bg-white text-black rounded-br-lg p-2 h-fit w-fit">Message</CardTitle>
      <CardContent className="mt-[-10px] p-4 min-h-52 max-h-52 whitespace-pre-wrap break-words  overflow-y-auto scroll-m-0 scrollbar-custom">
        {message.content}
      </CardContent>
      <CardFooter className="w-[398px] h-1">
        <div className="w-full flex row justify-between">
          <div className="text-bold text-muted-foreground">{date.toLocaleString()}</div>
          <CardAction>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-fit h-fit ">
                 Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onMessageDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
        </div>
      </CardFooter>
    </Card>
  );
}
