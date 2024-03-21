"use client"
import { Button } from './ui/button'
import { Bot } from 'lucide-react'
import { AiChatBox } from './AiChatBox'
import { useState } from 'react'

const AiChatButton = () => {
    const [showChatBox, setShowChatBox] = useState<boolean>(false);
    return (
        <div>
            <Button onClick={() => setShowChatBox(!showChatBox)} size={"sm"} style={{ userSelect: 'none' }} >
                <Bot size={20} className='mr-1' />
                Ai Chat
            </Button>

            <AiChatBox open={showChatBox} onClose={() => setShowChatBox(false)} />
        </div>
    )
}

export default AiChatButton
