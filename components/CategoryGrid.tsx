"use client"
import { useCatgoryContext } from "@/hooks/CategoryContext"
import CategoryCard from "./CategoryCard"
export default function CategoryGrid(){
    const {currentList}=useCatgoryContext()
    return(
        <div className="grid grid-cols-3 gap-3">
            {currentList.length>0?currentList.map((category)=>{
                return <CategoryCard category={category} key={category.id}/>
            }):<div>No Results</div>}
        </div>
    )
        
    
}