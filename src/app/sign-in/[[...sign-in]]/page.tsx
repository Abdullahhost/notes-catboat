import { SignIn } from '@clerk/nextjs'
import { Metadata } from 'next'

import React from 'react'


export const metadata: Metadata = {
    title: 'Code helper - sign-in'
}

const SignInPage = () => {
    return (
        <div className='h-screen flex items-center justify-center '>
            <SignIn appearance={{ variables: { colorPrimary: '#0F172A' } }} />
        </div>
    )
}

export default SignInPage
