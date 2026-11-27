import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
async function submit(){render(<ContactForm/>);const u=userEvent.setup();await u.type(screen.getByLabelText('Имя / организация'),'Тест');await u.type(screen.getByLabelText('Email'),'test@example.com');await u.type(screen.getByLabelText('Объём заказа, кг'),'10');await u.click(screen.getByRole('button',{name:'Отправить заявку'}));}
test('JWT sent with order',async()=>{localStorage.setItem('token','test-token');const spy=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('{"id":1}',{status:201}));await submit();expect(await screen.findByRole('status')).toHaveTextContent('принята');expect(spy.mock.calls[0][1].headers.Authorization).toBe('Bearer test-token');});
test('401 clears token and shows error',async()=>{localStorage.setItem('token','test-token');vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('{"error":"Войдите заново"}',{status:401}));await submit();expect(await screen.findByRole('status')).toHaveTextContent('Войдите заново');expect(localStorage.getItem('token')).toBeNull();});
