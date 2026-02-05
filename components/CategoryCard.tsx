"use client";
import {Gem} from "lucide-react"
import Link from "next/link";

export default function CategoryCard({category}:{category:{name:string,id:string}}){
    return(
        <Link href={`/${category.name}`}>
        <div className="flex flex-col justify-center items-center p-1 h-20 rounded-xl bg-primary text-primary-foreground cursor-pointer">
            <Gem size="1.5em"/>
            <div className="text-center text-xs">{category.name}</div>
        </div>
        </Link>
    )
}