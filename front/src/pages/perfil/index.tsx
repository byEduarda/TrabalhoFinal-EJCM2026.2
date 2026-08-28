import { useContext, useEffect, useState } from "react"
import "./perfil.css"
import { UserImg } from "../../components/UserImg"
import { BarraPerfil } from "../../components/BarraPerfil"
import { FormPerfil } from "../../components/FormPerfil"
import { FooterForm } from "../../components/FooterForm"
import { AuthContext } from "../../contexts/AuthContext"
import { api } from "../../services/api"

export type UserProfile = {
    firstName: string
    lastName: string
    email: string
    phone: string | null
    dateOfBirth: string | null
    gender: string | null
    createdAt: string
}

export function Perfil() {
    const { user } = useContext(AuthContext)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) return
        let active = true

        api
            .get(`/users/${user.id}`)
            .then((response) => {
                if (active) setProfile(response.data)
            })
            .catch(() => {
                if (active) setError("Não foi possível carregar o perfil.")
            })

        return () => {
            active = false
        }
    }, [user])

    if (!user) {
        return (
            <main className="shape">
                <p>Faça login para ver seu perfil.</p>
            </main>
        )
    }

    if (error) {
        return (
            <main className="shape">
                <p>{error}</p>
            </main>
        )
    }

    if (!profile) {
        return (
            <main className="shape">
                <p>Carregando perfil...</p>
            </main>
        )
    }

    return (
        <main className="shape">
            <div className="left">
                <UserImg profile={profile} />
            </div>
            <div className="squer">
                <BarraPerfil />
                <FormPerfil profile={profile} onSaved={setProfile} />
                <FooterForm />
            </div>
        </main>
    )
}
