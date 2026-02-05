import { LogoImage } from "@/components/Logo";
import StartButton from "@/components/StartButton";
import prisma from "@/lib/prisma";
import {ArrowLeft} from "lucide-react"
import Link from "next/link";

interface CategoryPageProps{
    params:{
        name:string;
    };
}
export default async function Category({params}:CategoryPageProps){
    try{
        const{name}=await params
        const category= await prisma.category.findUnique({
            where:{
                name:decodeURIComponent(name)
            }
        })
        if(!category) return <div className="flex justify-center items-center">Not Found</div>
        
        return(
            <div className="flex flex-col gap-15 h-full p-3  sm:px-10 lg:px-40 xl:px-60">
                <div className="w-[50%] flex justify-between items-center">
                    <Link href="/"><div><ArrowLeft/></div></Link>
                    <LogoImage h={25} w={25}/>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="icon"></div>
                    <div className="text-5xl font-bold">{category?.name} Trivia</div>
                    <div className="italic text-secondary-foreground">Heres some generic description for your Viewing pleasure as i do not have anyone available</div>
                    <StartButton category={category?.name}/>
                </div>
            </div>
        )
    } catch(error){
        console.log(error)
        return <div>Database Error....Probably</div>
    }
}