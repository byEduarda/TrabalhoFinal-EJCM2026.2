import './UserImg.css'
import type { UserProfile } from '../../pages/perfil'

export function UserImg({ profile }: { profile: UserProfile }) {
    const initials = `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase()
    const memberSince = new Date(profile.createdAt).getFullYear()

    return (
      <div className="infoUser">

                    <h1 className="sigla">{initials}</h1>

                <div className="dataUser">
                    <h1 className="Name">{profile.firstName} {profile.lastName}</h1>
                    <p className="email">{profile.email}</p>
                    <div className="ordeAndDate">
                        <p className="P1">3 Order </p>
                        <p className="P1">Member since {memberSince}</p>
                    </div>
                </div>
            </div>
    )
}
