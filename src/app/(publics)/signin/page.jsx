import { LoginForm } from "@/components/ui/forms/signin-form";
import { Logo } from "@/components/ui/logo";

export default function Signin() {
    return (
        <>
            <section className="w-full h-dvh flex justify-evenly items-center gap-10">
                <div className="max-md:flex-col flex justify-between items-center gap-6 w-[768px]">
                    <div className="flex flex-col justify-center items-center">
                        <Logo width={100} height={100} />
                        <h1 className="text-primary_color text-5xl font-extrabold">
                            ShopTurbo
                        </h1>
                        <p>Descomplique suas vendas.</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="mb-8 text-2xl font-extrabold">
                            Entre na sua conta
                        </h2>
                        <LoginForm />
                    </div>
                </div>
            </section>
        </>
    );
}
