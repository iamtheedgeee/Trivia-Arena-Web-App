import CategoryGrid from "@/components/CategoryGrid"
import Logo from "@/components/Logo"
import SearchInput from "@/components/SearchInput"
import CategoryProvider from "@/hooks/CategoryContext";
import categories from "@/categories.json"
export default async function Home(){
  try{
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
    console.log(error)
    return <div>Database error</div>
  }
  
}
 