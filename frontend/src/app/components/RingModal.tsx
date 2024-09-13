"use client";
import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import TextInput from "@/app/components/TextInput";
import Button from "@/app/components/Button";
import Api from "@/services/api";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {ForgedBy} from "@/utils/forgedByEnum";

interface IRingModal {
    mode: "create" | "edit";
    initiaData?: {
        id: string;
        nome: string;
        poder: string;
        portador: string;
        forjadoPor: string;
        imagem: string;
    };
    modalOpen: boolean;
    setModalOpen: any;
    setRings?: any;
}

export default function RingModal({mode, initiaData, modalOpen, setModalOpen, setRings}: IRingModal) {
    const router = useRouter();
    const session = useSession();
    const user: any = session.data;

    const [name, setName] = useState(initiaData?.nome || "");
    const [power, setPower] = useState(initiaData?.poder || "");
    const [carrier, setCarrier] = useState(initiaData?.portador || "");
    const [forgedBy, setForgedBy] = useState(initiaData?.forjadoPor || "");
    const [image, setImage] = useState(initiaData?.imagem || "");


    const handleCreateRing = async () => {
            if (!user) return;
            const api = new Api(user.token);
            if (mode == "create") {
                const ring = await api.createRing({
                    nome: name,
                    poder: power,
                    portador: carrier,
                    forjadoPor: forgedBy,
                    imagem: image,
                });
                if (ring) {
                    setRings((prevState: any) => {
                        return [...prevState, ring];
                    });
                }
            } else {
                if (initiaData) {
                    const ring = await api.updateRing({
                        id: initiaData?.id,
                        nome: name,
                        poder: power,
                        portador: carrier,
                        forjadoPor: forgedBy,
                        imagem: image,
                    });
                    // @ts-ignore
                    if (ring) {
                        setRings((prevState: any) => {
                            return [...prevState, ring];
                        });
                    }
                }
            }
            router.refresh();
            setModalOpen(false);
        }
    ;

    return (
        <div
            className={
                "w-screen h-screen absolute top-0 z-10 flex backdrop-blur-sm bg-black bg-opacity-30 justify-center items-center"
            }
            style={{display: modalOpen ? "flex" : "none"}}
        >
            <div
                className={
                    "bg-white flex p-10 shadow border relative rounded-lg max-w-[450px] w-full justify-center items-center gap-3 flex-col"
                }
            >
                <button onClick={() => setModalOpen(false)} className={"text-end absolute top-5 right-8 text-2xl"}>
                    {" × "}
                </button>
                <h2 className={"text-2xl font-semibold"}>{mode == "create" ? "Novo Anel" : "Editar Anel"}</h2>
                <div className={"w-full"}>
                    <p className={"text-lg text-gray-600 font-medium"}> Dados do Anel </p>
                    <TextInput

                        state={{current: name, setValue: setName}}
                        type={"text"}
                        label={`Nome: `}
                    ></TextInput>
                    <TextInput
                        state={{current: power, setValue: setPower}}
                        type={"text"}
                        label={"Poder: "}
                    ></TextInput>
                    <TextInput
                        state={{current: carrier, setValue: setCarrier}}
                        type={"text"}
                        label={"Portador: "}
                    ></TextInput>

                    <label>Forjado Por:</label>

                    <select onChange={(value) => {
                        setForgedBy(value.currentTarget.value)
                    }} value={forgedBy} name="forgedBy" id="cars">
                        {
                            ForgedBy.map(
                                (forged, index) => (
                                    <option key={index} value={forged}>
                                        {forged}
                                    </option>
                                )
                            )
                        }
                    </select>

                    <TextInput
                        state={{current: image, setValue: setImage}}
                        type={"text"}
                        label={"Imagem:"}
                    ></TextInput>
                </div>
                <div className={"flex flex-row justify-end gap-2"}>
                    <div className={"flex flex-col w-full items-center mt-4"}>
                        <Button
                            color={"white"}
                            border
                            label={"Cancelar"}
                            textColor={"gray-500"}
                            onClick={() => setModalOpen(false)}
                        />
                    </div>
                    <div className={"flex flex-col w-full items-center mt-4"}>
                        <Button
                            color={"#0066ce"}
                            border
                            label={"Salvar"}
                            onClick={handleCreateRing}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
