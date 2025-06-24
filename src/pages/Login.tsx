const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          type="text"
          placeholder="Enter your name"
          className="mt-4 px-4 py-2 border rounded"
        />
      </div>
    </div>
  )
}

export default Login;