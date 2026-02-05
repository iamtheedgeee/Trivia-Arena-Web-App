import { GemIcon } from "lucide-react";

export default function CategoryTitle({name}:{name:string}){
    return (
        <div className="rounded-2xl text-secondary-foreground p-1.5 bg-gray-300 flex gap-1.5 items-center">
            <GemIcon size="1em"/> {name}
        </div>
    )
}