"use client";

import ProductWrapper from '@/components/product/ProductWrapper'
import { useParams } from 'next/navigation'
import React from 'react'

export default function Page() {
    const params = useParams()
    const id = params.id as string

    return (
        <ProductWrapper id={id} />
    )
}
