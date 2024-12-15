import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function Loading() {
    return (
        <div className="flex justify-center items-center gap-2 bg-primary_color w-full text-xl text-center font-extrabold py-1 px-2 rounded-md">
            <AiOutlineLoading3Quarters className="animate-spin" />
            Carregando...
        </div>
    );
}
