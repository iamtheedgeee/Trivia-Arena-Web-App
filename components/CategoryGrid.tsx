"use client"

import useQuery from "@/hooks/useQuery"
import CategoryCard from "./CategoryCard"
import { useEffect, useState } from "react"
interface Category{
    name:string;
    id:string;
}
export default function CategoryGrid(){
    const [categories,setCategories]=useState<Category[]>([])
    const {loading,error,fetchData}=useQuery('/api/category')
    async function getCategories(){
        const data=await fetchData()
        setCategories(data.categories as Category[])
    }
    useEffect(()=>{
        getCategories()
    },[])
    if(loading) return <div className="text-blue-500">Loading.....</div>
    if(error) return <div className="text-red-400">{error}</div>
    return(
        <div className="flex flex-wrap gap-5">
            {categories.length>0?categories.map((category)=>{
                return <CategoryCard category={category} key={category.id}/>
            }):<div>Empty</div>}
        </div>
    )
        
    
}