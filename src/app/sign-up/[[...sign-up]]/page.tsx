import { SignUp } from '@clerk/nextjs'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
    title: 'Code helper - sign-up'
}


const SignUpPage = () => {
    return (
        <div className='h-screen flex items-center justify-center '>
            <SignUp appearance={{ variables: { colorPrimary: '#0F172A' } }} />
        </div>
    )
}

export default SignUpPage