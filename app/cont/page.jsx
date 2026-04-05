'use client'

import React, { useContext } from 'react'
import { ChatContext } from '../context/chatcontext';

function page() {

    const { incomingUser, myUsername, currentCall } = useContext(ChatContext);

    console.log('usrdta', incomingUser)
    return (
        <div>page</div>
    )
}

export default page