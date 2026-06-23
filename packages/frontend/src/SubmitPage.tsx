import { useLeadForm } from './hooks/useLeadForm'

export default function SubmitPage() {
  const { form, set, toggleService, submitting, success, error, submit } = useLeadForm()

  return (
    <div className="form-card">
      <h2>Register Interest</h2>
      {success && <p className="message success">{success}</p>}
      {error && <p className="message error">{error}</p>}

      <form onSubmit={submit}>
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
