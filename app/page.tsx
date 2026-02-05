import CategoryGrid from "@/components/CategoryGrid"
import Logo from "@/components/Logo"
import SearchInput from "@/components/SearchInput"
import prisma from "@/lib/prisma"
import CategoryProvider from "@/hooks/CategoryContext";
export default async function Home(){
  try{
    const categories=await prisma.category.findMany({
      select:{
        name:true,id:true
      }
    })
    return (
      <div className="flex flex-col gap-y-2 p-3 sm:px-40 lg:px-60">
        <Logo/>
        <CategoryProvider categoryList={categories}>
          <SearchInput/>
          <CategoryGrid/>
        </CategoryProvider>
      </div>
    );
  }catch(error){
    return <div>Database error</div>
  }
  
}
 