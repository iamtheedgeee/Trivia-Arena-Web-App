"use client"
import BaseForm from "@/components/BaseForm";
import useAuthForm from "@/hooks/useAuthForm";

export default function Login(){
    const {handleSubmit,loading,error}=useAuthForm("login")
    
    return <BaseForm mode="login" onSubmit={handleSubmit} loading={loading} error={error}/>
}