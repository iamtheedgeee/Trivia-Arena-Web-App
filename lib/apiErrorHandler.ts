import {NextApiResponse,NextApiRequest} from "next"

export class CustomApiError extends Error{
    statusCode:number
    constructor(statusCode:number,message:string){
        super(message)
        this.statusCode=statusCode
    }
}

export async function onError(error:unknown,req:NextApiRequest,res:NextApiResponse){
    console.log("Backend Error",error)
    let status=500
    let message="Internal Server Error"
    if(error instanceof CustomApiError){
        message=error.message
        status=error.statusCode
    }
    else if(error instanceof Error){
        message=error.message
    }
    else{
        message="Unknown Error"
    }
    res.status(status).json(
        {
            success:false,
            error:message
        }
    )
}

export async function onNoMatch(req:NextApiRequest,res:NextApiResponse){
    res.status(404).json({
        success:false,
        error:"Method Not Matched"
    })
}

