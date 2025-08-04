import  { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"
import { User } from "next-auth"

export const authOptions:NextAuthOptions=({
  providers: [
    CredentialsProvider({
      id:"credentials",
      name:"Credentials",
      credentials: {
        identifier: { label: "Username",type:"text",placeholder:"jgaurav" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<User> {
        await dbConnect();
        try {
          if (!credentials) {
            throw new Error("No credentials provided");
          }
          const user = await UserModel.findOne({
            $or: [
                    {email:credentials.identifier},
                    {username:credentials.identifier }
                ]
            });

            if(!user){
                throw new Error("no user found with this email/username")
            }
            if(!user.isVerified){
                throw new Error("please verify your account")
            }
            const isCorrectPassword = await bcrypt.compare(credentials.password,user.password);

            if(isCorrectPassword){
                return user as User;
            }
            else{
                throw new Error("Incorrect password")
            }
          }
          catch(error){
            if (error instanceof Error) {
              throw error;
            } else {
              throw new Error(String(error));
            }
          }
      },
    }),
  ],
  callbacks:{
    async jwt({token,user}){

        if(user){
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessages = user.isAcceptingMessages
            token.username = user.username
         }
 
        return token
    },
    async session({session,token}) {

        if(token){
            session.user._id = token._id?.toString()
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
        }
        return session
    }
    
  },
  pages:{
    signIn:'/signin',
  },
  session:{
    strategy:'jwt'
  },
  secret:process.env.NEXT_AUTH_SECRET_KEY
})