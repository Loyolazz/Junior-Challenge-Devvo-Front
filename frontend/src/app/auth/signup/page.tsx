"use client";

import { useState } from "react";
import TextInput from "@/app/components/TextInput";
import Image from "next/image";
import logo from "@/../public/logo.svg";
import Button from "@/app/components/Button";
import Link from "next/link";
import Api from "@/services/api";
import { useRouter } from "next/navigation";
import background from "@/../public/background.png";

export default function SignUp() {
    const api = new Api();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) return alert("Preencha todos os campos!");
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return alert("E-Mail Inválido");
        if (!/^.{6,10}$/.test(password)) return alert("A senha deve conter de 6 a 10 caracteres");
        if (password !== confirmPassword) return alert("As senhas não coincidem!");

        setLoading(true);
        const res = await api.createUser({
            name,
            email,
            password,
        });
        setLoading(false);

        if (!res) return alert("Erro ao criar usuário");

        router.push("/auth/signin");
    };

    return (
        <div className="relative w-full h-full min-h-screen flex items-center justify-center">
            <div
                className="absolute inset-0"
                style={{ backgroundImage: `url(${background.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
            <div
                className="relative bg-black flex p-10 shadow border rounded-lg max-w-[450px] w-full justify-center items-center gap-3 flex-col z-10"
            >
                <Image src={logo} alt="logo" width={500} />
                <div className="w-full">
                    <TextInput
                        state={{ current: name, setValue: setName }}
                        type="text"
                        label="Seu nome completo:"
                    />
                    <TextInput
                        regex={/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i}
                        state={{ current: email, setValue: setEmail }}
                        type="email"
                        label="E-mail:"
                    />
                    <TextInput
                        regex={/^.{6,10}$/}
                        state={{ current: password, setValue: setPassword }}
                        type="password"
                        label="Senha:"
                    />
                    <TextInput
                        regex={/^.{6,10}$/}
                        state={{ current: confirmPassword, setValue: setConfirmPassword }}
                        type="password"
                        label="Confirme sua senha:"
                    />
                </div>
                <div className="w-full flex flex-col">
                    <p className="self-end text-amber-500 text-sm">
                        Já possui uma conta?
                        <Link href="/auth/signin" className="text-red-500"> Fazer o login</Link>
                    </p>
                </div>
                <div className="flex flex-col w-full items-center mt-4">
                    <Button
                        onClick={handleSignUp}
                        color="green"
                        label={loading ? "Criando..." : "Criar Conta"}
                        disabled={loading}
                    />
                    {loading && <p className="mt-2 text-cyan-900 text-sm">Aguarde, estamos criando sua conta...</p>}
                </div>
            </div>
        </div>
    );
}
