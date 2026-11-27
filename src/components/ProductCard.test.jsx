import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from './ProductCard';
const product={id:2,name:'Мёд гречишный',price:3500,category:'Мёд'};
describe('ProductCard',()=>{
 test('renders title',()=>{render(<ProductCard product={product} onAdd={()=>{}}/>);expect(screen.getByRole('heading',{name:product.name})).toBeInTheDocument();});
 test('shows price',()=>{render(<ProductCard product={product} onAdd={()=>{}}/>);expect(screen.getByText(/3500\s*тг/i)).toBeInTheDocument();});
 test('button calls onAdd with product',async()=>{const user=userEvent.setup(),onAdd=vi.fn();render(<ProductCard product={product} onAdd={onAdd}/>);await user.click(screen.getByRole('button',{name:/в корзину/i}));expect(onAdd).toHaveBeenCalledTimes(1);expect(onAdd).toHaveBeenCalledWith(product);});
 test('featured badge appears',()=>{render(<ProductCard product={product} onAdd={()=>{}} featured/>);expect(screen.getByText(/товар недели/i)).toBeInTheDocument();});
});
