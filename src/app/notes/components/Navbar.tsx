"use client"

import Image from 'next/image'
import React, { useState } from 'react'

import logo from '@/assets/coderstuckLogobyDesigner.png'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

import AddEditNoteDialog from '@/components/AddEditNoteDialog'
import { ModeToggle } from '@/components/DarkThemeBtn'

import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'
import AiChatButton from '@/components/AiChatButton'

const Navbar = () => {

    const [showDialogBox, setShowDialogBos] = useState(false)

    const { theme } = useTheme();


    return (
        <>
            <nav className="mx-auto max-w-[78rem] shadow  dark:shadow-slate-700 px-4 py-3">
                <div className='flex gap-3 items-center justify-between'>
                    <div>
                        <Link href={"/notes"}>
                            <Image className='rounded-full' style={{ userSelect: "none" }} src={logo} alt='Logo iamge' width={45} height={45} />
                        </Link>
                    </div>
                    <div className='flex items-center gap-4'>
                        <UserButton afterSignOutUrl='/'
                            appearance={{
                                baseTheme: theme === "dark" ? dark : undefined,
                                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } }
                            }}
                        />

                        <ModeToggle />
                        <Button onClick={() => setShowDialogBos(true)} size={"sm"} style={{ userSelect: 'none' }} >
                            <Plus size={20} className='mr-1' />
                            Add note
                        </Button>
                        <AiChatButton />
                    </div>
                </div>
            </nav>

            <AddEditNoteDialog open={showDialogBox} setOpen={setShowDialogBos} />

        </>
    )
}

export default Navbar
