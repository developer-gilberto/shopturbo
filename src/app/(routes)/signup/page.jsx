import { SignupForm } from "@/components/ui/forms/signup-form";
import { Logo } from "@/components/ui/logo";

export default function Signup() {
    return (
        <>
            <section className="w-full h-dvh flex justify-evenly items-center gap-10">
                <div className=" max-md:flex-col flex justify-between items-center gap-6 w-[768px]">
                    <div className="flex flex-col justify-center items-center gap-1">
                        <Logo width={75} height={75} />
                        <h1 className="text-primary_color text-5xl font-extrabold">
                            ShopTurbo
                        </h1>
                        <p>
                            Descomplique suas vendas.
                        </p>
                    </div>
                    <SignupForm />
                </div>
            </section>
        </>
    );
}
