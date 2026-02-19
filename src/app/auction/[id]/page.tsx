"use client";
import AuctionDetailsWrapper from '@/components/Auctions/AuctionDetailsWrapper';
import { useParams } from 'next/navigation';
import React from 'react'
export default function Page() {
    const { id } = useParams();
    return (
        <AuctionDetailsWrapper id={id} />
    )
}
