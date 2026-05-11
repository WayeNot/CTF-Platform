"use client";

import { FaFire } from "react-icons/fa"
import Link from "next/link"
import { useNavData } from "@/stores/store";

export default function Home() {

    const { isGuest } = useNavData()

    const update = "Last updated : " + "11/05/2026"

    const tools = [
        { name: "Open Source Intelligence - Renseignement d’Origine Sources Ouvertes" },
        { name: "Identity", tools: [
            {name: "Google", description: "Google is where you will find the most information regarding the identity of a person or a place.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1280px-Google_2015_logo.svg.png", link: "https://www.google.com/"},
            {name: "Bing", description: "It is important to search on several different search engines because this can reveal information not indexed by other search engines.", image: "https://logos-world.net/wp-content/uploads/2021/02/Bing-Emblem.png", link: "https://www.bing.com/"},
            {name: "Pipl", description: "It allows you to obtain information about a person or company by cross-referencing several databases.", image: "http://pipl.com/hubfs/pipl-logo-white%20copy.svg", link: "https://pipl.com/"},
        ] },
        { name: "Username", tools: [
            {name: "Sherlock", description: "Hunt down social media accounts by username across 400+ social networks", image: "https://github.com/sherlock-project/sherlock/raw/master/docs/images/sherlock-logo.png", link: "https://github.com/sherlock-project/sherlock"},
            {name: "Whatsmyname", description: "Search usernames, nicknames, and email addresses across 1500+ platforms.", image: "https://github.com/WebBreacher/WhatsMyName/blob/main/whatsmyname.png?raw=true", link: "https://www.whatsmyname.app/"},
            {name: "Maigret", description: "Maigret collects a dossier on a person by username only, checking for accounts on a huge number of sites and gathering all the available information from web pages. No API keys required.", image: "https://raw.githubusercontent.com/soxoj/maigret/main/static/maigret.png", link: "https://github.com/soxoj/maigret"},
        ] },
        { name: "Email", tools: [
            {name: "Holehe", description: "Holehe checks if an email is attached to an account on sites like twitter, instagram, imgur and more than 120 others.", image: "https://camo.githubusercontent.com/f87194cbc19e597f1f38b4029140272ac664ec07507028d457c5d26087ff8c5a/68747470733a2f2f66696c65732e636174626f782e6d6f652f3577653279612e706e67", link: "https://github.com/megadose/holehe"},
            {name: "Epios Email", description: "Founded by a cybersecurity and OSINT specialist with more than 10 years of experience, Epieos provides training, investigation and software services to organisations and individuals. We facilitate their efforts to collect and analyse open source information.", image: "https://investigators-toolbox.com/wp-content/uploads/2021/05/epieos.png", link: "https://epieos.com/"},
            {name: "MailboxValidator", description: "Validate and clean your email list by detecting disposable emails, invalid emails, mail server and much more.", image: "https://mailboxvalidator.hexa-soft.com/images/mailboxvalidator_logo.png", link: "https://www.mailboxvalidator.com/demo"},
            {name: "HaveIBeenPwned", description: "Check if an email address is in a data breach", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fhaveibeenpwned.com%2FImages%2FOpenGraphPreview.jpg&f=1&nofb=1&ipt=9b966eb5e4d6a48af173430d662f7299d9874cd3e97c1ce9585a3f0f98b97b23", link: "https://haveibeenpwned.com/"},
        ] },
        { name: "Phone Number", tools: [
            {name: "Epios Phone", description: "Founded by a cybersecurity and OSINT specialist with more than 10 years of experience, Epieos provides training, investigation and software services to organisations and individuals. We facilitate their efforts to collect and analyse open source information.", image: "https://investigators-toolbox.com/wp-content/uploads/2021/05/epieos.png", link: "https://epieos.com/"},
            {name: "Ignorant", description: "ignorant allows you to check if a phone number is used on different sites like snapchat, instagram.", image: "", link: "https://github.com/megadose/ignorant"},
            {name: "PhoneInfoga", description: "PhoneInfoga is one of the most advanced tools to scan international phone numbers. It allows you to first gather basic information such as country, area, carrier and line type, then use various techniques to try to find the VoIP provider or identify the owner. It works with a collection of scanners that must be configured in order for the tool to be effective. PhoneInfoga doesn't automate everything, it's just there to help investigating on phone numbers.", image: "https://github.com/sundowndev/phoneinfoga/raw/master/docs/images/banner.png", link: "https://github.com/sundowndev/PhoneInfoga"},
        ] },
        { name: "Social Media", tools: [
            {name: "Toutatis", description: "Toutatis is a tool that allows you to extract information from instagrams accounts such as e-mails, phone numbers and more", image: "", link: "https://github.com/megadose/toutatis"},
            {name: "Inflact", description: "The service is a smart solution for those who are looking for an anon Insta profile viewer.", image: "https://inflact.com/new/img/logo-inflact.svg", link: "https://inflact.com/instagram-viewer/profile/"},
            {name: "Wayback Tweets", description: "Retrieves archived tweets CDX data from the Wayback Machine", image: "https://waybacktweets.claromes.com/_static/parthenon.png", link: "https://github.com/claromes/waybacktweets"},
            {name: "", description: "", image: "", link: ""},
        ] },
        { name: "Companies", tools: [
            {name: "Test", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
        ] },
        { name: "Geoint", tools: [
            {name: "Test", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
        ] },
    ]
    return (
        <div>
            <div className="sm:hidden fixed inset-0 bg-black z-50 flex items-center justify-center">
                    <h2 className="text-white text-xl text-center">
                        The mobile version is coming soon.
                    </h2>
            </div>

            <div className="hidden lg:block"></div>

                {isGuest ? (
                    <div>
                        {tools.map((v, k) => (
                            <div key={k} className="blur-[6px] pointer-events-none select-none">
                                <h2 className="text-white/70 text-xl text-[30px] mt-10 ml-20 font-mono font-bold">{v.name}</h2>
                                <hr className="mt-5 mx-20 text-white/70" />
                            </div>
                        ))}
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                            <div className="w-fit max-w-fit bg-[#1e1e2f] rounded-2xl shadow-2xl p-6 animate-fadeIn">
                                <Link href="/accounts/login" className="inset-0 flex items-center justify-center gap-3 text-white/40 p-4 rounded-lg w-full border border-orange-600 text-[20px] text-center cursor-pointer hover:text-white/20 transition duration-500"><FaFire className="text-orange-500" /> Connectez-vous pour sauvegarder votre progression<FaFire className="text-orange-500" /></Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-[20px] text-white/30 font-mono ml-20">- {update}</h2>
                        {tools.map((v, k) => (
                            <div key={k}>
                                <h2 className="text-white/70 text-xl text-[30px] mt-10 ml-20 font-mono font-bold">{v.name}</h2>
                                <hr className="mt-5 mx-20 text-white/70" />
                                {v?.tools?.map((value, key) => (
                                    <div key={key} className="border-2 border-white/30 my-10 mx-30 p-5">
                                        <div className="flex justify-between">
                                            <p className="text-white/70 text-[25px] font-mono font-bold">{value.name}</p>
                                            <img src={value?.image} className="w-50"></img>
                                        </div>
                                        <p className="text-white/70 font-mono mt-5">{value.description}</p>
                                        <a target="_blank" className="text-white/70 underline font-mono hover:text-white transition duration-500" href={value.link}>Try the tool</a>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
    );
}