import CategoryWrapper from '@/components/categories/CategoryWrapper'
import React from 'react'
export default function Page({ params }) {
    return (
        <CategoryWrapper id={params.id} />
    )
}
