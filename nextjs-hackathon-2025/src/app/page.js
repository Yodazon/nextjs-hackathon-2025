import Image from "next/image";
import Link from "next/link";
import { RiVoiceprintFill } from "react-icons/ri";

export default function Home() {
  return (
    <div className="grid grid-rows min-h-screen">
      <header className="bg-gray-400">This if for a header</header>

      <main className="flex flex-col space-y-4 p-4">
        <div
          id="conversation-box"
          className="h-[60vh] w-2/3 border-black border-2 rounded-lg p-4 overflow-y-auto mx-auto "
        >
          This is where the conversation will appear
        </div>
        <div id="chat-box" className="w-2/3 mx-auto ">
          <div className="bg-blue-200 p-4 rounded-lg  grid grid-cols-[auto_1fr_auto]">
            <Link href="" className="bg-gray-400 p-2 rounded-xl block w-8">
              <RiVoiceprintFill />
            </Link>

            <p className="mt-2 px-10">Recorded text would appear here</p>
            <Link href="" className="bg-gray-400 p-2 rounded-xl block w-15">
              Send
            </Link>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center bg-gray-400">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
