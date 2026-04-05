'use client'


import { useRouter } from 'next/router';
import React from 'react'

export default function page() {

    const router = useRouter();
    const { userid } = router.query;
    return (
        <div>page{JSON.stringify(userid)}</div>
    )
}
