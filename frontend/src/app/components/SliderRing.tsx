'use client'
import React, {useState} from "react";
import Slider from "react-slick";
import RingModal from "@/app/components/RingModal";
import { FaTrash, FaEdit } from 'react-icons/fa';
import Api from "@/../src/services/api"
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

export default function SliderRing({rings, setRings}: any) {
    const router = useRouter();
    const session = useSession();
    const user: any = session.data;

    const [modalOpenEdit, setModalOpenEdit] = useState(false);
    const [selectedRing, setSelectedRing] = useState<any>(null)

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,

    };

    const handleEditClick = (ring: any) => {
        setSelectedRing(ring);
        setModalOpenEdit(true);
    }

    const handleDeletClick = async (ring: any) => {
        const api = new Api(user.token);
        const response = await api.deleteRing(ring.id);
        const updatedRings = rings.filter((r: any) => r.id !== ring.id);
        setRings(updatedRings);
    }

    return (
        <div className={'w-[90%]'}>
            <Slider {...settings}>
                {rings && rings.map((ring: any) => (
                    <div key={ring.id} className={"bg-blue-800 rounded-xl "}>
                        <img src={ring.imagem} alt={ring.nome} width={400} height={200}/>
                        <h3>{ring.nome}</h3> <p>{ring.portador}</p>
                        <p>{ring.poder}</p> <p>{ring.forjadoPor}</p>
                        <div>
                            <button onClick={() => handleEditClick(ring)} >
                                <FaEdit/>
                            </button>
                        </div>
                        <div>
                            <button onClick={() => handleDeletClick(ring)}>
                                <FaTrash/>
                            </button>
                        </div>
                    </div>
                ))}
            </Slider>
            {
                selectedRing && (
                    <RingModal initiaData={selectedRing} setRings={setRings} mode="edit" modalOpen={modalOpenEdit}
                               setModalOpen={setModalOpenEdit}/>
                )
            }
        </div>
    );
}
