import CompanyWrapper from '@/components/companies/CompanyWrapper'
import React from 'react'
export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <CompanyWrapper id={id} />
    )
}
