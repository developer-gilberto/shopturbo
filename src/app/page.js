import { Button } from '@/components/ui/buttons/btn';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home({ searchParams }) {
    const params = await searchParams;

    const code = params?.code;
    const shopId = params?.shop_id;

    if (code && shopId) redirect(`/callback?code=${code}&shop_id=${shopId}`);

    return (
        <div className="h-dvh flex justify-center items-center">
            <div className="p-8 rounded-lg flex flex-col justify-center items-center max-w-fit mx-auto">
                <div className="flex items-center gap-2 mb-8">
                    <Logo width={100} height={100} />
                    <strong className="text-primary_color text-4xl font-bold">
                        ShopTurbo
                    </strong>
                </div>

                <div className="flex justify-between items-center gap-4 mt-8 border border-[--bg_3] rounded-lg p-4 w-full">
                    <p>Ainda não tem uma conta ShopTurbo?</p>
                    <Link href="/signup">
                        <Button value="Criar conta" />
                    </Link>
                </div>

                <div className="flex justify-between items-center gap-4 mt-8 border border-[--bg_3] rounded-lg p-4 w-full">
                    <p>Já tenho uma conta ShopTurbo.</p>
                    <Link href="/signin">
                        <Button value="Fazer login" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
