import { useState } from 'react'
import { UserSchema } from '@brighte/shared'

const API = 'http://localhost:3003'

interface FormData {
  name: string
  email: string
  mobile: string
  postcode: string
  service: string[]
}

const initialForm: FormData = {
  name: '',
  email: '',
  mobile: '',
  postcode: '',
  service: [],
}

export function useLeadForm() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const set = (field: keyof FormData, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (s: string) => {
    const current = form.service
    if (current.includes(s)) {
      set('service', current.filter(v => v !== s))
    } else {
      set('service', [...current, s])
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    setError('')

    const result = UserSchema.safeParse(form)
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${API}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })
      if (!res.ok) throw new Error('Something went wrong')
      setSuccess('Successfully submitted!')
      setForm(initialForm)
    } catch (err) {
      setError((err as Error).message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setForm(initialForm)
    setSuccess('')
    setError('')
  }

  return { form, set, toggleService, submitting, success, error, submit, reset }
}
