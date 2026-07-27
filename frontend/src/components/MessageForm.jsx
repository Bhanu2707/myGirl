import { useState } from 'react';
import { burstParticles } from '../hooks/useParticles';
import { useScrollReveal } from '../hooks/useScrollReveal';

const DEFAULT_TO = 'prakashbhanu9550@gmail.com';
const DEFAULT_FROM = 'prakash0h4@gmail.com';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function nowLocalDatetimeValue() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function MessageForm() {
  const [ref, inView] = useScrollReveal(0.2);
  const [fromEmail, setFromEmail] = useState(DEFAULT_FROM);
  const [toEmail, setToEmail] = useState(DEFAULT_TO);
  const [message, setMessage] = useState('');
  const [sendAt, setSendAt] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorText, setErrorText] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorText('');

    try {
      const res = await fetch(`${API_BASE}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromEmail, toEmail, message, sendAt }),
      });
      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || 'Something went wrong scheduling that message.');
      }

      // success: reset fields, restore default To address
      setFromEmail(DEFAULT_FROM);
      setToEmail(DEFAULT_TO);
      setMessage('');
      setSendAt('');
      setStatus('success');
      burstParticles(['✦', '♡'], window.innerWidth / 2, 12);
    } catch (err) {
      setStatus('error');
      setErrorText(err.message || 'Could not schedule the message. Please try again.');
      // fields are left untouched on failure
    }
  }

  return (
    <section id="message-form">
      <div ref={ref} className={`section-head reveal ${inView ? 'in-view' : ''}`}>
        <p className="eyebrow">For later</p>
        <h2>Send a Message Through Time</h2>
        <div className="section-line" />
      </div>

      <form className={`message-form reveal ${inView ? 'in-view' : ''}`} onSubmit={handleSubmit}>
        <label htmlFor="fromEmail">From</label>
        <input
          id="fromEmail"
          type="email"
          required
          value={fromEmail}
          // onChange={(e) => setFromEmail(e.target.value)}
          // placeholder="you@example.com"
        />

        <label htmlFor="toEmail">To</label>
        <input
          id="toEmail"
          type="email"
          required
          value={toEmail}
          // onChange={(e) => setToEmail(e.target.value)}
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write whatever you want future-us to read..."
        />

        <label htmlFor="sendAt">Send on</label>
        <input
          id="sendAt"
          type="datetime-local"
          required
          min={nowLocalDatetimeValue()}
          max="9999-12-31T23:59"
          value={sendAt}
          onChange={(e) => setSendAt(e.target.value)}
        />

        <button className="glow-btn" type="submit" disabled={status === 'sending'} style={{ marginTop: '1.6rem' }}>
          {status === 'sending' ? 'Scheduling...' : 'Send'}
        </button>

        {status === 'success' && (
          <p className="form-note">You can send more messages anytime, whenever you want — and I'll be there.</p>
        )}
        {status === 'error' && (
          <p className="form-error">{errorText}</p>
        )}
      </form>
    </section>
  );
}
