"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/app/components/Button";
import logo from "../../../public/logo.svg";
import Api from "@/services/api";
import { useSession } from "next-auth/react";
import RingModal from "../components/RingModal";
import SliderRing from "@/app/components/SliderRing";

export default function Dashboard() {
    const session = useSession();
    const user: any = session.data;
    const [modalOpen, setModalOpen] = useState(false);
    const [rings, setRings] = useState([]);

    useEffect(() => {
        if (!user) return;
        const api = new Api(user.token);
        api.getRing().then((response) => {
            if (response.data.error) {
                return;
            }
            setRings(response.data.data);
        });
        console.log(rings);
    }, [user]);

    return (
        <div className={"flex flex-col items-center h-full w-full"}>
            <Image className={"my-10"} src={logo} alt="logo" width={300}/>
            <div className={"w-full bg-gray-200 flex flex-col items-end"}>
                <div className={"py-4 px-8"}>
                    <Button
                        style={"text-[15px] font-light"}
                        color={"#0066ce"}
                        label={"+ Novo Lead"}
                        onClick={() => setModalOpen(true)}
                    />
                </div>
            </div>

            <div className={'w-full flex justify-center flex-col items-center'}>
                <SliderRing rings={rings} setRings={setRings}/>
            </div>

            <RingModal setRings={setRings} mode="create" modalOpen={modalOpen} setModalOpen={setModalOpen}/>
        </div>
    );
}
