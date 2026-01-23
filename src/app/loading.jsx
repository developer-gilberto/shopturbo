import { IsLoading } from '@/components/ui/isLoading';

export default function Loading() {
    return (
        <div className="w-full h-dvh flex justify-center items-center">
            <IsLoading width="w-80" />
        </div>
    );
}
