'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import logo from '@/src/images/freeLogo.png'
export default function Profile() {

    return (

        <div className="img-empty">
            <Image src={logo} alt='B3' className='logo-in-profile'></Image>
        </div>
    )
}
