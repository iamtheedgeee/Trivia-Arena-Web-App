"use client"
import { useCatgoryContext } from "@/hooks/CategoryContext"
import {SearchIcon,X} from "lucide-react"
import { useEffect, useState } from "react"
export default function SearchInput(){
    const [searchInput,setSearchInput]=useState('')
    const {search}=useCatgoryContext()
    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        setSearchInput(e.target.value)
    }
    useEffect(()=>{
        search(searchInput)
    },[searchInput])
    return (
        <div className="flex p-4 rounded-lg justify-center border gap-x-3 w-[70%] m-auto box-content">
            <div><SearchIcon className="text-primary"/></div>
            <input 
                value={searchInput}
                onChange={handleChange}
                placeholder="Search Categories" type="text" className="border flex-1 focus:bg-none border-none  outline-none"/>
            <div onClick={()=>{setSearchInput('')}}><X className="text-primary cursor-pointer "/></div>
        </div>
    )
}