"use client";

import { useNavData } from "@/stores/store";
import { motion } from "motion/react"
import Link from "next/link";
import Typewriter from 'typewriter-effect';

export default function Home() {
    const { username } = useNavData()
    let date = new Date();

    return (
        <div>
             <div className="sm:hidden fixed inset-0 bg-[#1e1e2f] font-mono z-50 flex items-center justify-center">
                <h2 className="text-white text-xl text-center">
                    The mobile version is coming soon.
                </h2>
            </div>

            <div className="hidden lg:block">
                <div className="text-white/70 text-xl text-[70px] ml-20 font-mono text-left font-bold mt-25">
                    <Typewriter onInit={(tw) => tw.typeString('Welcome to your CTF platform.').pauseFor(800).deleteChars(13).typeString('best CTF platform ;)').stop().start()} />
                </div>
                <div className="border-t-2 border-b-2 border-white/40 ml-20 mr-20 mt-20">
                    <motion.h2 className="text-white/70 text-xl text-[30px] mt-5 ml-10 font-mono text-left opacity-0" animate={{ opacity: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100] }} transition={{ duration: 5 }}>{username}@flagcore {date.toISOString().split('T')[0]} - Session not ready, loading ...</motion.h2>
                    <motion.h2 className="text-white/70 text-xl text-[30px] mt-5 ml-10 font-mono text-left opacity-0" animate={{ opacity: [0, 0, 0, 0, 0, 0, 0, 100, 100, 100] }} transition={{ duration: 5 }}>{username}@flagcore {date.toISOString().split('T')[0]} - Session established with flagcore</motion.h2>
                    <motion.h2 className="text-white/70 text-xl text-[30px] mt-5 mb-5 ml-10 font-mono text-left opacity-0" animate={{ opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 100] }} transition={{ duration: 5 }}>{username}@flagcore {date.toISOString().split('T')[0]} - Session ready for work</motion.h2>
                </div>
            </div>

            <div className="flex items-center justify-center mb-20 mt-20">
                 <Link href="/challenges" className="text-white/70 p-3 text-center text-xl text-[30px] font-mono border-t-2 border-b-2 border-white/40 font-bold transition duration-500 hover:bg-white/70 hover:text-[#1e1e2f]">Start working</Link>   
            </div>
        </div>
    );
}