import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getDB } from '../db'
import { userAuth } from '../hooks/useAuth'

const Login = () => {
  const [name, setName] = useState('')
  const login = userAuth(({ login }) => login)
  const navigate = useNavigate()

  const handleLogin = async () => {
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
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Login</h1>
      <input
        type="text"
        className="border p-2 rounded w-64"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go →
      </button>
    </div>
  )
}

export default Login;