"use client";

import Link from "next/link";

export default function CategoryCard({category}:{category:{name:string,id:string}}){
    return(
        <Link href={`/${category.name}`}>
        <div className="flex justify-center items-center w-40 h-40 rounded-md bg-red-400 text-yellow-400 cursor-pointer hover:bg-red-500">
            {category.name}
        </div>
        </Link>
    )
}