import { useState, useEffect } from 'react'
import type { FullResumeData, Language } from '../types'

export function useResumeData(language: Language) {
  const [data, setData] = useState<FullResumeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const file = language === 'EN' ? '/resumeEN.json' : '/resumeES.json'
    setLoading(true)
    fetch(file)
      .then(res => res.json())
      .then((json: FullResumeData) => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load resume data:', err)
        setLoading(false)
      })
  }, [language])

  return { data, loading }
}
