import {useState} from "react"
import {signIn} from "next-auth/react"
import { api } from "@/axios/api";
type Mode= "login" |"signup"
interface FormValues{
    username?: string;
    email:string;
    password:string;
}
const useAuthForm=(mode:Mode)=>{
    const [loading,setLoading]= useState(false)
    const [error,setError]=useState("")

    async function handleSubmit(values:FormValues){
        setLoading(true)
        setError("")
 
        try{
            if(mode==="login"){
                const result=await signIn("credentials",{
                    redirect:true,
                    email:values.email,
                    password: values.password,
                    callbackUrl:"/"
                })
                if(result?.ok) setError("Login Success")
                else if(result?.error) setError(result.error)
            }else{
                const res=await api.post('/api/auth/signup',values)
                const {user}=res.data
                setError("Sign up success logging in...")
                const result=await signIn("credentials",{
                    redirect:true,
                    email:user.email,
                    password:values.password,
                    callbackUrl:"/"
                })
                if(result?.ok) setError("Login Success")
                else if(result?.error) setError(result.error)
            }
        } catch(error){
            if(error instanceof Error) setError(error.message)
        } finally{
            setLoading(false)
        }
    }

    return {handleSubmit, loading, error}
}

export default useAuthForm