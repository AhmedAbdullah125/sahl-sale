"use client";
import AuctionDetailsWrapper from '@/components/Auctions/AuctionDetailsWrapper';
import { useParams } from 'next/navigation';
export default function Page() {
    const params = useParams();
    const id = params.id as string;
    return (
        <AuctionDetailsWrapper id={id} />
    )
}
