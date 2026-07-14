import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from './features/auth/pages/Login'
import { Register } from './features/auth/pages/Register'
import { Otp } from './features/auth/pages/otp'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<Otp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
