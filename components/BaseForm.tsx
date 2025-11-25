import {useState} from "react"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

interface BaseFormProps{
    mode:"login"|"signup";
    onSubmit: (values:{email:string,password:string,username?:string})=>void;
    loading:boolean;
    error:string;
}

export default function BaseForm({mode,onSubmit,loading,error}:BaseFormProps){
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [username,setUsername]=useState("")

    function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        onSubmit({email,password,username:mode==="signup"?username:undefined})
    }

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {mode==="signup" && (
                <Input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required/>
            )}
            <Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
            <Input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required/>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <Button type="submit" disabled={loading}>
                {loading?"Loading...":mode==="login"?"Login":"Signup"}
            </Button>
            <Link href={mode==="login"?"/auth/signup":"/auth/login"}><p className="text-blue-500 text-center font-sm">{mode==="login"?"signup":"login"}</p></Link>
        </form>
    )
}