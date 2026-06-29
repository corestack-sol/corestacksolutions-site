import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useResumeData } from './hooks/useResumeData'
import type { Language } from './types'
import Header from './Components/Header'
import About from './Components/About'
import Resume from './Components/Resume'
import Services from './Components/Services'
import Portfolio from './Components/Portfolio'
import Testimonials from './Components/Testimonials'
import Contact from './Components/Contact'
import Footer from './Components/Footer'
import PolicyQRResidence from './Components/PolicyQRResidence'
import DeleteAccount from './Components/DeleteAccount'
import ProposalTemplate from './Components/ProposalTemplate'
import DashboardHome from './Components/Dashboard/DashboardHome'
import ProjectDetail from './Components/Dashboard/ProjectDetail'
import { AuthProvider } from './contexts/AuthContext'
import LoginModal from './Components/LoginModal'
import PrivateRoute from './Components/PrivateRoute'
import CorporateIndex from './Components/CorporateIndex'

function MainPage() {
  const [language, setLanguage] = useState<Language>('ES')
  const { data, loading } = useResumeData(language)

  const toggleLanguage = () => setLanguage(l => (l === 'EN' ? 'ES' : 'EN'))

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Header data={data.main} language={language} toggleLanguage={toggleLanguage} />
      <About data={data.main} language={language} />
      <Services language={language} />
      <Resume data={data.resume} language={language} />
      <Portfolio language={language} />
      <Testimonials data={data.testimonials} language={language} />
      <Contact data={data.main} language={language} />
      <Footer data={data.main} />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LoginModal />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/privacy-policy" element={<PolicyQRResidence />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/propuesta" element={<ProposalTemplate />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/:id" element={<ProjectDetail />} />
          <Route
            path="/corporate"
            element={
              <PrivateRoute>
                <CorporateIndex />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
