import Image from "next/image";
import Link from "next/link";
export function LogoImage({w=20,h=20}){
    return <Link href="/"><div className={`relative`} style={{width:w,height:h}}>
                <Image 
                    src="/arena.png" 
                    fill 
                    className="object-contain"
                    alt="Logo"/>
            </div>
            </Link>
}
export default function Logo(){
    return(
        <div className="flex flex-col justify-center items-center">
            <LogoImage w={50} h={50}/>
            <h1 className="text-primary">Trivia Arena Web App</h1>
      </div>
    )
}
