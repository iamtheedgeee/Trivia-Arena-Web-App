import {Button} from "@/components/ui/button"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { AUTH_OPTIONS } from "./api/auth/[...nextauth]/route"
import { Input } from "@/components/ui/input"
import CategoryGrid from "@/components/CategoryGrid"

interface SearchParams {
  [key: string]: string | string[] | undefined;
}


export default async function Home({searchParams}:{searchParams:Promise<SearchParams>}){
  const params= await searchParams
  const success= params.success
  const session=await getServerSession(AUTH_OPTIONS)  
  if(!session) redirect("/auth/signup")
  return (
    <div>
      <form method="POST" action="/api/category" className="flex">
        <Input type="text" placeholder="Category Name" name="category" className="text-center" required/>
        <Button type="submit">Add</Button>
      </form>
      {success==="true"?<div className="fixed bottom-10 right-10 z-50 w-10 h-10 rounded-full bg-green-500"/>:<div className="fixed bottom-10 right-10 z-50 w-10 h-10 rounded-full bg-red-500"/>}
      <CategoryGrid/>
    </div>
  );
}
