import NextAuth, { Session, User } from "next-auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import Credentials from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

export const AUTH_OPTIONS={
  session:{
    strategy:"jwt" as const
  },
  providers:[
    Credentials({
      name:"Credentials",
      credentials:{
        email:{label:"Email", type:"email"},
        password:{label:"Password", type:"password"}
      },
      async authorize(credentials){
        let user:any
          if(!credentials?.email || !credentials?.password) throw new Error("Email and Password Required")
          const {email,password}=credentials
          try{
            user=await prisma.user.findUnique({where:{email}})
          }catch(error){
            console.log(error)
            throw new Error("Database Error") 
          }

          if(!user) throw new Error("Email not registered")

          const isValid= await bcrypt.compare(password,user.password)
          if(!isValid) throw new Error("Password is Incorrect")

          return {
            id: user.id,
            username: user.username,
            email: user.email
          }
        
    }
    })
  ],
  callbacks:{
    async jwt({token,user}:{token:JWT,user:User}){
      if(user) token.user=user
      return token
    },
    async session({session,token}:{session:Session,token:JWT}){
      session.user=token.user
      return session
    }
  },
  pages:{
    signIn:"/auth/login",
    error:"/auth/login"
  }
}

const handler=NextAuth(AUTH_OPTIONS)

export { handler as GET, handler as POST };

