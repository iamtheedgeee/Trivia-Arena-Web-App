import {Button} from "@/components/ui/button"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { AUTH_OPTIONS } from "./api/auth/[...nextauth]/route"
import { signOut } from "next-auth/react"

export default async function Home() {
  const session=await getServerSession(AUTH_OPTIONS)
  console.log(session?.user.user)
  if(!session) redirect("/auth/signup")
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <form method="post" action="/api/auth/signout">
        <Button type="submit">Click me{session?.user.username}</Button>
        </form>
    </div>
  );
}
