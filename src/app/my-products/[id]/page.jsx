import ProductWrapper from '@/components/product/ProductWrapper'
import React from 'react'
export default function Page({ params }) {
    return (
        <ProductWrapper id={params.id} />
    )
}
