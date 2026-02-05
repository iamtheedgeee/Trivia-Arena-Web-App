import {useState} from "react"
import {api} from "@/axios/api"

const useQuery=<T>(url:string)=>{
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")

    async function fetchData(){
        setError("")
        setLoading(true)
        try{
            const res= await api.get(url)
            return res.data as {[x:string]:T}
        }catch(error){
            if(error instanceof Error) setError(error.message)
        }finally{
            setLoading(false)
        }
    }
    return {fetchData,loading,error}
}

export default useQuery