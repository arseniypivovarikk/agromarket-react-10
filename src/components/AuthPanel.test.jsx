import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthPanel from './AuthPanel';
vi.mock('../api.js',()=>({apiFetch:vi.fn()}));
import { apiFetch } from '../api.js';
describe('AuthPanel',()=>{
 beforeEach(()=>apiFetch.mockReset());
 test('login inputs and button are visible',()=>{render(<AuthPanel user={null} onAuth={()=>{}} onLogout={()=>{}}/>);expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument();expect(screen.getByPlaceholderText(/пароль/i)).toBeInTheDocument();expect(screen.getByRole('button',{name:'Войти'})).toBeInTheDocument();});
 test('switches to registration mode',async()=>{const user=userEvent.setup();render(<AuthPanel user={null} onAuth={()=>{}} onLogout={()=>{}}/>);await user.click(screen.getByRole('button',{name:/создать аккаунт/i}));expect(screen.getByRole('heading',{name:'Регистрация'})).toBeInTheDocument();expect(screen.getByPlaceholderText('Имя')).toBeInTheDocument();});
 test('successful login calls callback and saves token',async()=>{const user=userEvent.setup(),cb=vi.fn();apiFetch.mockResolvedValue({token:'mock-token',user:{name:'Test',role:'buyer'}});render(<AuthPanel user={null} onAuth={cb} onLogout={()=>{}}/>);await user.type(screen.getByPlaceholderText(/e-mail/i),'buyer@test.kz');await user.type(screen.getByPlaceholderText(/пароль/i),'password123');await user.click(screen.getByRole('button',{name:'Войти'}));expect(apiFetch).toHaveBeenCalledWith('/auth/login',expect.objectContaining({method:'POST'}));expect(cb).toHaveBeenCalledWith({name:'Test',role:'buyer'});});
 test('renders login API error',async()=>{const user=userEvent.setup();apiFetch.mockRejectedValue(new Error('Неверный пароль'));render(<AuthPanel user={null} onAuth={()=>{}} onLogout={()=>{}}/>);await user.type(screen.getByPlaceholderText(/e-mail/i),'wrong@test.kz');await user.type(screen.getByPlaceholderText(/пароль/i),'badpass123');await user.click(screen.getByRole('button',{name:'Войти'}));expect(await screen.findByText('Неверный пароль')).toBeInTheDocument();});
 test('logout callback is triggered',async()=>{const user=userEvent.setup(),logout=vi.fn();render(<AuthPanel user={{name:'Покупатель',role:'buyer'}} onAuth={()=>{}} onLogout={logout}/>);await user.click(screen.getByRole('button',{name:'Выйти'}));expect(logout).toHaveBeenCalledTimes(1);});
});
