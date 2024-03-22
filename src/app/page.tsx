import Image from "next/image";

import logo from "@/assets/coderstuckLogobyDesigner.png"
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { auth } from '@clerk/nextjs'
import { redirect } from "next/navigation";

export default function Home() {

  const { userId } = auth();
  if (userId) redirect('/notes')

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Brand Loge" width={100} height={100} />
        <h3 className="font-extrabold text-4xl">CoderStuck</h3>
      </div>
      <div>
        <p className="max-w-prose transition-[1.5s] delay-300 text-center text-sm hover:text-xlg hover:text-lime-700">Hi there👋! it's Abdullah al mamun here to help you to create or store your moment with Ai partner. An intellegent note-taking app with Ai integration, built with openAI, pinecone, NextJs, Shadcn UI, clerk and more! Enjoy it!</p>
      </div>
      <div>
        <Button size={"lg"} asChild>
          <Link href={'/notes'} title="Get Satrted!">
            Open
          </Link>
        </Button>
      </div>
    </main>
  );
}
