import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from './features/auth/pages/Login'
import { Register } from './features/auth/pages/Register'
import { Otp } from './features/auth/pages/otp'
import { AuthProvider } from './features/auth/auth.context'
import { Toaster } from "react-hot-toast";
import Protected from './features/auth/components/Protected';
import Home from './features/interview/pages/Home';
import { InterviewProvider } from './features/interview/interview.context'
import Interview from './features/interview/pages/Interview'
import Settings from './features/auth/pages/Settings';


function App() {

  return (

    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <InterviewProvider>

        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Protected><Home /></Protected>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<Otp />} />
              <Route path='/interview/:interviewId' element={<Protected><Interview /></Protected>} />
              <Route path="/settings" element={<Protected><Settings /></Protected>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </InterviewProvider>
    </>
  )
}

export default App
