import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getDB } from '../db'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'

const Login = () => {
  const [name, setName] = useState('')
  const { login, user: currentUser } = useAuth((auth) => auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) navigate('/plan')
  }, [currentUser])

  const handleLogin = async () => {
    if (!name.trim()) return

    const db = await getDB()
    const existing = await db.users.findOne({ selector: { name } }).exec()

    let user

    if (existing) {
      user = existing.toJSON()
    } else {
      user = { id: uuidv4(), name }
      await db.users.insert(user)
    }

    login(user)
    navigate('/plan')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Construction Planner 🏗️
        </h1>

        <label htmlFor="username" className="text-slate-300 text-sm">
          Enter Name
        </label>
        <input
          id="username"
          type="text"
          className="w-full mt-1 mb-4 p-3 rounded-lg bg-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g. Site Supervisor"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin()
          }}
        />
        <Button
          variant='contained'
          color='blue-500'
          disabled={!name}
          onClick={handleLogin}
          className="w-full !rounded-lg"
        >
          Continue →
        </Button>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Offline-first task planner for your construction site.
        </p>
      </div>
    </div>
  )
}

export default Login;