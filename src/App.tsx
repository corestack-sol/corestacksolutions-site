import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useResumeData } from './hooks/useResumeData'
import type { Language } from './types'
import Header from './Components/Header'
import About from './Components/About'
import Resume from './Components/Resume'
import Portfolio from './Components/Portfolio'
import Testimonials from './Components/Testimonials'
import Contact from './Components/Contact'
import Footer from './Components/Footer'
import PolicyQRResidence from './Components/PolicyQRResidence'

function MainPage() {
  const [language, setLanguage] = useState<Language>('EN')
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/privacy-policy" element={<PolicyQRResidence />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
