import  { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"

export const authOptions:NextAuthOptions=({
  providers: [
    CredentialsProvider({
      id:"credentials",
      name:"Credentials",
      credentials: {
        email: { label: "Username",type:"email",placeholder:"jgaurav" },
        password: { label: "Password", type: "password" },
      },
   async authorize(credentials:any):Promise<any>{
        await dbConnect()
        try {
            const user = await UserModel.findOne({
                $or:[
                    {email:credentials.identifier.email},
                    {username:credentials.identifier.username }
                ]
            });

            if(!user){
                throw new Error("no user found with this email")
            }
            if(!user.isVerified){
                throw new Error("please verify your account")
            }
            const isCorrectPassword = await bcrypt.compare(credentials.password,user.password);

            if(isCorrectPassword){
                return user;
            }
            else{
                throw new Error("Incorrect password")
            }
          }
          catch(err:any){
            throw new Error(err)
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