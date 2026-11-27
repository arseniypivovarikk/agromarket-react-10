import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
vi.mock('./components/AuthPanel',()=>({default:()=> <div>Auth stub</div>}));
vi.mock('./components/Header',()=>({default:()=> <div>Header stub</div>}));
vi.mock('./components/Footer',()=>({default:()=> <div>Footer stub</div>}));
vi.mock('./components/ContactForm',()=>({default:()=> <div>Contact stub</div>}));
vi.mock('./components/AdminProductForm',()=>({default:()=> <div>Admin stub</div>}));
const goods=[{id:2,name:'Мёд гречишный',price:3500,category:'Мёд'}];
describe('App catalog screen',()=>{
 test('shows loading before response',()=>{vi.spyOn(globalThis,'fetch').mockReturnValue(new Promise(()=>{}));render(<App/>);expect(screen.getByText(/загрузка/i)).toBeInTheDocument();});
 test('renders products returned by API',async()=>{vi.spyOn(globalThis,'fetch').mockResolvedValue({ok:true,json:async()=>goods});render(<App/>);expect(await screen.findByText('Мёд гречишный')).toBeInTheDocument();});
 test('shows error when API responds not ok',async()=>{vi.spyOn(globalThis,'fetch').mockResolvedValue({ok:false,status:503});render(<App/>);expect(await screen.findByText(/не удалось загрузить товары/i)).toBeInTheDocument();});
 test('search filters product out',async()=>{vi.spyOn(globalThis,'fetch').mockResolvedValue({ok:true,json:async()=>goods});render(<App/>);await screen.findByText('Мёд гречишный');await userEvent.setup().type(screen.getByPlaceholderText(/поиск товара/i),'zzz');expect(screen.queryByText('Мёд гречишный')).not.toBeInTheDocument();});
});
test('empty catalog',async()=>{vi.spyOn(globalThis,'fetch').mockResolvedValue({ok:true,json:async()=>[]});render(<App/>);expect(await screen.findByText('Товаров пока нет')).toBeInTheDocument();});
test('network failure',async()=>{vi.spyOn(globalThis,'fetch').mockRejectedValue(new TypeError('Failed to fetch'));render(<App/>);expect(await screen.findByText(/не удалось загрузить товары/i)).toBeInTheDocument();});
