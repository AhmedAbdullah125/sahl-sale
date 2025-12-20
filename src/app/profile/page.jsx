'use client'
import React, { useEffect } from 'react'
// import { CounterContext } from '@/app/Context/CounterContext';
import Image from 'next/image'
import logo from '@/src/images/logo.png'
export default function Profile() {

    return (

        <div className="img-empty">
            <Image src={logo} alt='B3' className='logo-in-footer'></Image>
        </div>
    )
}
