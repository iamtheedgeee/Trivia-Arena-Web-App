import axios, {AxiosError, AxiosInstance} from "axios"
interface errorObject{
    error:string;
}
export const api:AxiosInstance= axios.create()

api.interceptors.response.use(
    (res)=>res,
    (error:AxiosError)=>{
        if(error.response){
            const message=(error.response.data as errorObject).error || "Something Went wrong"
            console.log(message)
            throw new Error(message)
        }
        throw new Error("Network Error")
    }
)