








"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'
import { ChatContext } from '../context/chatcontext';

function page() {

    const {
        setpath,
        pathname
    } = useContext(ChatContext);
    const pathnamee = usePathname()

    console.log('pathname', pathname)

    let route = useRouter()



    useEffect(() => {


        try {
            setpath(pathnamee)
            console.log('setpathnae')
        } catch (error) {
            console.log('errpr')
        }
    }, [])

    return (
        <div>video

            <button onClick={() => route.push('/demo')}>
                go nowtttt
            </button>
        </div>
    )
}

export default page