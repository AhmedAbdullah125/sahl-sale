import SubCategoryWrapper from '@/components/categories/SubCategoryWrapper'
import React from 'react'
export default function Page({ params }) {
    return (
        <SubCategoryWrapper id={params.id} />
    )
}
