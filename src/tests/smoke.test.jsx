import { render, screen } from '@testing-library/react';
test('Testing Library environment is configured',()=>{render(<h1>АгроМаркет</h1>);expect(screen.getByRole('heading',{name:'АгроМаркет'})).toBeInTheDocument();});
