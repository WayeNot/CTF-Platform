"use client"

import InsertFile from "@/components/challenges/InsertFile";
import { useNotif } from "@/components/NotifProvider";
import DropDown from "@/components/ui/DropDown";
import { useApi } from "@/hooks/useApi";
import { default_pp, statusColor } from "@/lib/config";
import { socialMedias, Status, statusBtn } from "@/lib/types"
import { useNavData } from "@/stores/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsDiscord } from "react-icons/bs";

export default function Home() {
    const { call } = useApi();
    const { showNotif } = useNotif()
    const router = useRouter();

    const { user_id, username, mail, bio, role, pp_url, status, socialMedia, updateUsername, updateMail, updateBio, updatePp_url, updateStatus, updateSocialMedia } = useNavData()

    const [displayFiles, setDisplayFiles] = useState(false)

    const [displayStatus, setDisplayStatus] = useState(false)

    const updateProfilePicture = async (selectedFile: File[]) => {
        const formData = new FormData();
        selectedFile.forEach(f => formData.append("files[]", f));
        const res = await call(`/api/upload`, { method: "POST", body: formData })
        setDisplayFiles(false)
        const newPicture = res.files[0];
        updatePp_url(newPicture)
    }

    const updateProfile = async () => {
        await call(`/api/user/${user_id}/updateProfile`, { method: "PATCH", body: JSON.stringify({ username: username, mail: mail, bio: bio, pp_url: pp_url, status: status, social_media: socialMedia }) })
        showNotif("Profile updated successfully", "success")
    }

    const deleteAccount = async () => {
        await call(`/api/user/${user_id}/deleteAccount`, { method: "PATCH" }, ["Account disabled successfully"])
        router.refresh()
        router.push("/accounts/login")
    }

    const selectedStatusOption = statusBtn.find(o => o.value === status) ?? null;

    return (
        <div className="w-3/6 m-auto">
            <div className="flex items-center justify-between font-semibold text-gray-300">
                <h2>Public profile</h2>
                <Link href={`/user/${username}`} className="text-[12px] p-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">Go to your personal profile</Link>
            </div>
            <hr className="text-white/70 w-full my-5 m-auto" />
            <div className="flex items-start gap-8 w-full my-5">
                <div className="flex flex-col gap-5 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-2 w-1/2">
                            <h2 className="font-bold text-white/60">Username ( no space ! )</h2>
                            <input type="text" placeholder={"Your username"} className="p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 active:scale-95" value={username} onChange={e => { const value = e.target.value.replace(/\s/g, ""); updateUsername(value) }} />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <h2 className="font-bold text-white/60">Public mail</h2>
                            <input type="email" placeholder={"Your mail"} className="p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 active:scale-95" value={mail} onChange={e => { const value = e.target.value.replace(/\s/g, ""); updateMail(value) }} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-2 w-1/2">
                            <h2 className="font-bold text-white/60">Display Picture</h2>
                            <input type="email" placeholder={"Your display picture"} className="p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 active:scale-95" value={pp_url} onChange={e => updatePp_url(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <h2 className="font-bold text-white/60">Status</h2>
                            <DropDown<Status> isOnce label="Status" value={selectedStatusOption} isOpen={displayStatus} options={statusBtn} onToggle={() => setDisplayStatus(!displayStatus)} onSelect={(v) => { updateStatus(v.value); setDisplayStatus(false) }} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold text-white/60">Bio</h2>
                        <textarea className="p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 active:scale-95 resize-none h-20" placeholder="Tell us a little bit about yourself" value={bio} onChange={e => updateBio(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-2 w-full">
                            <h2 className="font-bold text-white/60">social media links</h2>
                            <div>
                                {socialMedias.map(social => {
                                    const Icon = social.icon

                                    return (
                                        <div key={social.key} className="flex items-center gap-2 w-full">
                                            <Icon className="text-white/40 text-[25px]"/>
                                            <input type="text" placeholder={`Your ${social.label}`} className="w-full p-2 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 active:scale-95" value={socialMedia[social.key]} onChange={e => updateSocialMedia(social.key, e.target.value)} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={updateProfile} className="text-[12px] w-fit font-semibold text-gray-300 p-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">Update profile</button>
                        <button onClick={deleteAccount} className="text-[12px] w-fit font-semibold text-gray-300 p-2 border border-white/10 bg-red-500/30 hover:bg-red-500/50 hover:text-white transition duration-500 cursor-pointer active:scale-95">Disable my account</button>
                    </div>
                </div>
                <div className="flex flex-col items-start w-fit">
                    <img onClick={() => setDisplayFiles(true)} src={pp_url || default_pp} alt="user logo" className={`max-w-32 object-cover cursor-pointer transition duration-500 active:scale-95 shrink-0 ${statusColor[status ?? "offline"]}`} />
                    <div className="flex flex-col items-start gap-2 mt-2 flex-wrap">
                        {role?.map((v, k) => (
                            <p key={k} className={`${v.color} text-white/40 w-fit text-[12px] p-2`}>{v.label}</p>
                        ))}
                    </div>
                </div>
            </div>
            {displayFiles && <InsertFile multiple={false} onClose={() => setDisplayFiles(false)} onSubmit={updateProfilePicture} />}
        </div>
    )
}