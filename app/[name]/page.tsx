import GameTest from "@/components/GameTest";
import StartButton from "@/components/StartButton";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

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
        if(!category) return <div>Not Found</div>
        
        return(
            <div>
                Welcome to the Page of {category?.name}
                <StartButton category={category?.name}/>
                {/*<GameTest category={category?.name}/>*/}
            </div>
        )
    } catch(error){
        console.log(error)
        return <div>Database Error....tabun</div>
    }
}