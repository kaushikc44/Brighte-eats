// @ts-nocheck
import { useState } from 'react'
import { UserSchema } from '@brighte/shared'

const API = 'http://localhost:3001'

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    postcode: '',
    service: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const set = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const toggleService = (s) => {
    const current = form.service
    if (current.includes(s)) {
      set('service', current.filter(v => v !== s))
    } else {
      set('service', [...current, s])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    setError('')

    const result = UserSchema.safeParse(form)
    if (!result.success) {
      const firstError = result.error.issues[0].message
      setError(firstError)
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
      setForm({ name: '', email: '', mobile: '', postcode: '', service: [] })
    } catch (err) {
      setError(err.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-card">
      <h2>Register Interest</h2>
      {success && <p className="message success">{success}</p>}
      {error && <p className="message error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
        </label>
        <label>
          Mobile
          <input type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="0400 000 000" />
        </label>
        <label>
          Postcode
          <input type="text" value={form.postcode} onChange={e => set('postcode', e.target.value)} placeholder="2000" maxLength={4} />
        </label>

        <fieldset>
          <legend>Services</legend>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.service.includes('delivery')} onChange={() => toggleService('delivery')} /> Delivery
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.service.includes('pick-up')} onChange={() => toggleService('pick-up')} /> Pick-up
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.service.includes('payment')} onChange={() => toggleService('payment')} /> Payment
          </label>
        </fieldset>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Interest'}
        </button>
      </form>
    </div>
  )
}
