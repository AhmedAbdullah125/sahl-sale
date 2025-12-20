import EditAdWrapper from '@/components/product/EditAdWrapper'
import React from 'react'
export default function Page({ params }) {
    return (
        <EditAdWrapper id={params.id} />
    )
}
