"use client"
import EditAdWrapper from '@/components/product/EditAdWrapper'
import { useParams } from 'next/navigation'
import React from 'react'

export default function Page() {
    const params = useParams()
    const id = params.id as string
    return (
        <EditAdWrapper id={id} />
    )
}
