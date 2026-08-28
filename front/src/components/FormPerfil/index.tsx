import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import type { UserProfile } from '../../pages/perfil'
import './FormPerfil.css'

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
}

function toFormData(profile: UserProfile): FormData {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone ?? '',
    dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : '',
    gender: profile.gender ?? '',
  }
}

export function FormPerfil({ profile, onSaved }: { profile: UserProfile; onSaved: (profile: UserProfile) => void }) {
  const { user, updateUser } = useContext(AuthContext)
  const [formData, setFormData] = useState<FormData>(toFormData(profile))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCancel = () => {
    setFormData(toFormData(profile))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError(null)
    setSaving(true)
    try {
      const response = await api.patch(`/users/${user.id}`, formData)
      onSaved(response.data)
      updateUser({ firstName: response.data.firstName, lastName: response.data.lastName, email: response.data.email })
    } catch {
      setError('Não foi possível salvar as alterações.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Personal Information</h1>
      {error && <p className="form-perfil-error">{error}</p>}
      <div className="in_Form">
        <div className="divForms">
          <div className="labelInput">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>

          <div className="labelInput">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>

          <div className="labelInput">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
          </div>
        </div>
        <div className="divForms">
          <div className="labelInput">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="labelInput">
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="labelInput">
            <label htmlFor="gender">Gender</label>
            <input type="text" id="gender" name="gender" value={formData.gender} onChange={handleChange} />
          </div>
        </div>
      </div>
      <div className="divButtom">
        <button className="ButtonSave" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button className="ButtonCancel" type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
