'use client';

import { supabase } from '../../supabase/supabaseClient';
import styles from './styles/AdminDashboard.module.css';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    images: '',
    category: '',
    stock: 0,
  });
  const [user, setUser] = useState(null);
  const router = useRouter();
  const fileInputRef = useRef();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/admin/login');
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function openForm(product = null) {
    setEditProduct(product);
    setShowForm(true);
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        description: product.description,
        images: (product.images || []).join(','),
        category: product.category || '',
        stock: product.stock || 0,
      });
    } else {
      setForm({
        name: '',
        price: '',
        description: '',
        images: '',
        category: '',
        stock: 0,
      });
    }
  }

  function handlePrice(delta) {
    setForm((f) => {
      let price = Number(f.price) || 0;
      price += delta;
      if (price < 0) price = 0;
      return { ...f, price: price };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (editProduct) {
      await supabase.from('products').update(payload).eq('id', editProduct.id);
    } else {
      await supabase.from('products').insert([payload]);
    }
    setShowForm(false);
    setEditProduct(null);
    fetchProducts();
  }

  async function handleDelete(id) {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  }

  function handleStock(delta) {
    setForm((f) => {
      let stock = Number(f.stock) || 0;
      stock += delta;
      if (stock < 0) stock = 0;
      return { ...f, stock };
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  }

  async function handleImageUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploadedUrls = [];
    const user = (await supabase.auth.getUser()).data.user;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}_${Date.now()}_${i}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (error) {
        alert('이미지 업로드 실패: ' + error.message);
        continue;
      }
      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) uploadedUrls.push(publicUrlData.publicUrl);
    }
    setForm((f) => ({
      ...f,
      images: (f.images ? f.images + ',' : '') + uploadedUrls.join(','),
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className={styles.adminWrap}>
      <h1>관리자 대시보드</h1>
      <button onClick={handleLogout} className={styles.logoutBtn}>
        로그아웃
      </button>
      <button className={styles.addBtn} onClick={() => openForm()}>
        상품 등록
      </button>
      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="상품명을 입력해주세요"
            required
          />
          <div className={styles.priceInputWrap}>
            <button
              type="button"
              className={styles.priceBtn}
              onClick={() => handlePrice(-1000)}
            >
              -1,000
            </button>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="가격을 입력해주세요"
              type="number"
              required
              min="0"
              step="1000"
            />
            <button
              type="button"
              className={styles.priceBtn}
              onClick={() => handlePrice(1000)}
            >
              +1,000
            </button>
          </div>
          <p className={styles.text}>
            이미지를 올려주세요. 이미지는 URL 혹은 파일으로 등록 가능합니다.
            파일은 최대 50MB까지 올릴 수 있습니다.
          </p>
          <input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="이미지 URL(여러 개는 ,로 구분)"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageUpload}
            className={styles.fileInput}
          />
          <p className={styles.text}>카테고리</p>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">카테고리를 선택해주세요</option>
            <option value="팔찌">팔찌</option>
            <option value="목걸이">목걸이</option>
          </select>
          <p className={styles.text}>재고</p>
          <div className={styles.stockInputWrap}>
            <button
              type="button"
              className={styles.stockBtn}
              onClick={() => handleStock(-1)}
            >
              -1
            </button>
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="재고를 입력해주세요"
              type="number"
              min="0"
            />
            <button
              type="button"
              className={styles.stockBtn}
              onClick={() => handleStock(1)}
            >
              +1
            </button>
          </div>
          <p className={styles.text}>설명</p>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="상품에 대한 설명을 입력해주세요"
          />
          <div className={styles.formBtns}>
            <button type="submit">{editProduct ? '수정' : '등록'}</button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditProduct(null);
              }}
            >
              취소
            </button>
          </div>
        </form>
      )}
      <div className={styles.tableWrap}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>상품명</th>
                <th>가격</th>
                <th>카테고리</th>
                <th>재고</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.price?.toLocaleString()}원</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className={styles.adminModify_Btn}
                      onClick={() => openForm(p)}
                    >
                      수정
                    </button>
                    <button
                      className={styles.adminDel_Btn}
                      onClick={() => handleDelete(p.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
