import {useState} from "react"
import {api} from "@/axios/api"

const useQuery=(url:string)=>{
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")

    async function fetchData(){
        setError("")
        setLoading(true)
        try{
            const res= await api.get(url)
            return res.data

        }catch(error){
            if(error instanceof Error) setError(error.message)
        }finally{
            setLoading(false)
        }
    }

    return {fetchData,loading,error}
}

export default useQuery