"use client"
import {createContext,useContext, useRef, useState} from "react"
interface Category{
    name:string;
    id:string;
}
interface CategoryContextProperties{
    currentList:Category[],
    search:(input:string)=>void,
}

const CategoryContext=createContext<CategoryContextProperties | null>(null)
export default function CategoryProvider({categoryList,children}:{categoryList:Category[],children:React.ReactNode}){
    const [currentList,setCurrentList]=useState(categoryList)
    const categories=useRef(categoryList)
    

    function search(input:string){
        if(!input){
            setCurrentList(categories.current)
            return
        }
        const match:Category[]=[]
        categories.current.forEach((category)=>{
            if(category.name.toLowerCase().includes(input.toLowerCase())){
                match.push(category)
            }
        })
        setCurrentList(match)
    }

    const value={currentList,search}
    return(
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    )
}

export function useCatgoryContext(){
    const context=useContext(CategoryContext)
    if(!context) throw new Error("No context: Category Context. What a Tragedy indeed")
    return context
}