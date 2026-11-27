import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ContactForm from './components/ContactForm';
import AuthPanel from './components/AuthPanel';
import AdminProductForm from './components/AdminProductForm';
import { API_URL, apiFetch } from './api.js';



function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } });
  useEffect(() => { if (!localStorage.getItem('token')) return; apiFetch('/auth/me').then(setUser).catch(() => { setUser(null); localStorage.removeItem('user'); }); }, []);
  function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); }

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Сервер ответил со статусом ' + response.status);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить товары. Проверьте, запущен ли agromarket-server на порту 3000.');
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  function handleAddToCart() { setCartCount(n => n + 1); }
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return <>
    <Header cartCount={cartCount} />
    <main className="page">
      <section className="hero"><span>ФЕРМЕРСКИЕ ПРОДУКТЫ • КАЗАХСТАН</span><h1>Свежие продукты<br/>от местных фермеров</h1><p>Откройте вкус родного края. Выбирайте продукты местных хозяйств и оформляйте заявки напрямую.</p><a href="#catalog">Перейти в каталог →</a></section>
      <div className="benefits"><span>01 · От местных фермеров</span><span>02 · Свежие продукты</span><span>03 · Оптовые заявки</span></div>
      <section id="catalog" className="catalog">
        <div className="catalog-toolbar">
          <h2>Каталог</h2>
          <input type="search" placeholder="Поиск товара..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        {loading && <p className="status">Загрузка...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && filteredProducts.length === 0 && <p>Товаров пока нет</p>}
        {!loading && !error && <div className="product-grid">
          {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={handleAddToCart} featured={product.id === 1} />)}
        </div>}
      </section>
      <aside id="delivery" className="sidebar">
        <h3>Доставка</h3>
        <ul><li>Астана — на следующий день</li><li>Акмолинская область — 2–3 дня</li><li>Бесплатно от 20 000 тг</li></ul>
      </aside>
          <div id="account" className="page-auth"><AuthPanel user={user} onAuth={setUser} onLogout={logout} />{user?.role === 'admin' && <AdminProductForm onAdded={(p) => setProducts((old) => [...old, p])} />}</div>
      <ContactForm user={user} />
    </main>
    <Footer />
  </>;
}
export default App;
