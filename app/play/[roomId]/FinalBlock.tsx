import Logo from "@/components/Logo";
import { Score } from "./reducer";

export default function FinalBlock({scores}:{scores:Score[]}){
    return (
        <div className="flex justify-center items-center h-full p-3 sm:px-25 md:px-40 lg:px-80 xl:px-120">
            <div className="p-2 rounded-md border w-full flex flex-col gap-2">
                <Logo/>
                <div className="text-gray-400 font-mono text-xs">
                    FINAL STANDINGS
                </div>
                <div className="w-full flex flex-col gap-1.5 justify-around">
                    {scores.sort((a,b)=>a.points-b.points).map((score,index)=>{
                        return(
                            <div className="w-full rounded-md flex" key={score.player.id}>
                                <div className="flex-9/12 p-2 rounded-l-md flex gap-3 item-center border border-gray-200">
                                    <div className="text-gray-400">
                                        {index+1}
                                    </div>
                                    <div>
                                        {score.player.name}
                                    </div>
                                </div>
                                <div className="flex-1/4 p-2 text-center rounded-r-md bg-gray-700 text-white">
                                    {score.points}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}