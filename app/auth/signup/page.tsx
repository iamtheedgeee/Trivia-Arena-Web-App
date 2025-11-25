"use client"
import BaseForm from "@/components/BaseForm";
import useAuthForm from "@/hooks/useAuthForm";

export default function Signup(){
    const {handleSubmit,loading,error}=useAuthForm("signup")
    
    return <BaseForm mode="signup" onSubmit={handleSubmit} loading={loading} error={error}/>
}