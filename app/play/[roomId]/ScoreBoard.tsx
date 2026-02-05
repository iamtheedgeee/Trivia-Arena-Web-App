import { LogoImage } from "@/components/Logo"
import { Score, State } from "./reducer"
export default function ScoreBoard({scores}:{scores:Score[]}){
    return(
        <div className="flex items-center gap-3 max-w-full overflow-x-auto p-3 border-b ">
            <LogoImage h={20} w={20}/>
            {scores.length>0 && scores.map((score)=>{
                return <div key={score.player.id} className="rounded-2xl p-1.5 border border-primary ">
                    {`${score.player.name} ${score.points}`}
                </div>
            })}
        </div>
    )
}