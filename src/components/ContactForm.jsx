import { useState } from 'react';
import { apiFetch } from '../api.js';

function ContactForm({user}) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    setSending(true); setMessage('');
    try {
      const result = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) });
      setMessage(`Заявка №${result.id} принята!`);
      form.reset();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally { setSending(false); }
  }
  return <section id="contact" className="contact">
    <h2>Оптовая заявка</h2>
    <form className="contact-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Имя / организация</label><input id="name" name="name" type="text" required />
      <label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="farmer@mail.kz" />
      <label htmlFor="phone">Телефон</label><input id="phone" name="phone" type="tel" placeholder="+7 7XX XXX XX XX" />
      <label htmlFor="quantity">Объём заказа, кг</label><input id="quantity" name="quantity" type="number" min="10" required />
      <label htmlFor="date">Желаемая дата доставки</label><input id="date" name="date" type="date" />
      <label htmlFor="comment">Комментарий</label><textarea id="comment" name="comment" rows="4" />
      <button type="submit" disabled={sending}>{sending ? 'Отправка…' : 'Отправить заявку'}</button>
    </form>{message && <p role="status">{message}</p>}
  </section>;
}
export default ContactForm;
