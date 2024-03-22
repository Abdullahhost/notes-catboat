import { cn } from "@/lib/utils";
import { Bot, Send, Trash, XCircle } from "lucide-react";

import { useEffect, useRef } from "react";
import { useChat } from 'ai/react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Message } from "ai";
import { UserButton } from "@clerk/nextjs";
interface AiChatBoxProps {
    open: boolean;
    onClose: () => void;
}

export const AiChatBox = ({
    open,
    onClose

}: AiChatBoxProps) => {

    const {
        messages,
        input,
        isLoading,
        setMessages,
        handleInputChange,
        handleSubmit,
        error

    } = useChat()


    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const toggleRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current?.scrollHeight
        }
    }, [messages])
    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open])

    useEffect(() => {
        let handler = (e: any) => {
            if (!toggleRef.current?.contains(e.target)) {
                if (open) {
                    onClose();
                }
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });



    const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

    return (
        <>
            <div ref={toggleRef} className={cn("bottom-0 right-0 z-40 w-full max-w-[500px] p-1 xl:right-24 ", open ? "fixed" : "hidden")}>
                <div>
                    <button className="block ms-auto  mb-2" onClick={onClose}>
                        <XCircle size={30} color={"#fff"} />
                    </button>
                </div>
                <div style={{ background: "linear-gradient(#fff1 40% , #0009)" }} className="h-full max:h-[600px] flex flex-col rounded-md border-rborder-t dark:border-neutral-700 backdrop-blur-[2px] shadow-2xl
                 dark:bg-[#0001] relative">
                    {/* <video autoPlay loop muted className="object-cover absolute top-0 left-0 w-full min-h-full -z-10">
                        <source src="/bg1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video> */}
                    <div className="h-full overflow-y-auto" ref={scrollRef}>
                        {messages.map((message) => {

                            return <ChatMessage message={message} key={message.id} />
                        })
                        }

                        {
                            isLoading && lastMessageIsUser && (
                                <ChatMessage
                                    message={{
                                        role: "assistant",
                                        content: "Thinking..."
                                    }}

                                />

                            )
                        }

                        {
                            error && (
                                <ChatMessage
                                    message={{
                                        role: "assistant",
                                        content: "Something went wrong, Try again"
                                    }}
                                />
                            )
                        }

                        {
                            !error && messages.length === 0 && (
                                <div className="h-full flex items-center justify-center gap-3 text-white dark:text-black">
                                    <div className="flex w-full h-2/5 items-center justify-center flex-col gap-3 p-5 bg-[#ffe7001f] rounded-lg shadow-2xl">
                                        <div className="flex items-center justify-center gap-3 bg-black dark:bg-yellow-400 p-4 rounded-xl">

                                            <Bot />
                                            <h2 className="drop-shadow-2xl text-2xl font-bold">Ask The Ai about your Notes</h2>
                                        </div>
                                        <div className="text-center">

                                            <small className="text-neutral-200">You can ask Anything my Ai partner for gathering or increese your knowladge </small>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <form className="flex gap-2 p-4" onSubmit={handleSubmit}>
                        <Button
                            size={"icon"}
                            title="Clear content"
                            type="button"
                            className="shrink-0"
                            variant={"outline"}
                            onClick={() => setMessages([])}
                        >
                            <Trash />
                        </Button>

                        <Input
                            ref={inputRef}
                            value={input} onChange={handleInputChange} placeholder="Say Something..." />

                        <Button type="submit">
                            <Send size={16} />
                        </Button>
                    </form>
                </div>
            </div>

            {/* 00d2ff */}

            {open && <div className="fixed top-0 right-0 w-full h-screen z-30 backdrop-blur-sm bg-[#2357ff9d] dark:bg-[#5558]">

            </div>}

        </>
    )
}


function ChatMessage({ message: { role, content } }: { message: Pick<Message, "role" | "content"> }) {
    return (
        <div className={`mb-2 flex gap-2 px-4 py-4 items-start ${role === "assistant" ? "justify-start" : "justify-end"}`}>
            <div className="contrast-125">{role === "user" ? <UserButton afterSignOutUrl='/'
                appearance={{
                    elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } }
                }}
            /> : <Bot />} </div>
            <div className={`w-fit border px-4 py-2 rounded-sm ${role === "assistant" ? "bg-background" : " bg-neutral-950 text-primary-foreground dark:bg-indigo-700 dark:text-white"}`} >{content}</div>
        </div>
    )
}


