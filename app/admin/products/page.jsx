'use client';

import { supabase } from '../../../supabase/supabaseClient';
import styles from '../styles/AdminDashboard.module.css';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    images: [], // string[]
    category: '',
    stock: 0,
  });
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef();
  const router = useRouter();

  function handlePrice(delta) {
    setForm((f) => {
      let price = Number(f.price) || 0;
      price += delta;
      if (price < 0) price = 0;
      return { ...f, price };
    });
  }

  function handleStock(delta) {
    setForm((f) => {
      let stock = Number(f.stock) || 0;
      stock += delta;
      if (stock < 0) stock = 0;
      return { ...f, stock };
    });
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/admin/login');
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

  function openForm(product) {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      images: Array.isArray(product.images)
        ? product.images
        : product.images
        ? product.images.split(',')
        : [],
      category: product.category || '',
      stock: product.stock || 0,
    });
    setImageUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // 이미지 URL 입력 후 추가
  function handleAddImageUrl(e) {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setForm((f) => ({ ...f, images: [...f.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
  }

  // 이미지 삭제
  function handleRemoveImage(idx) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  // 파일 업로드
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
    setForm((f) => ({ ...f, images: [...f.images, ...uploadedUrls] }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images,
    };
    await supabase.from('products').update(payload).eq('id', editProduct.id);
    setEditProduct(null);
    setForm({
      name: '',
      price: '',
      description: '',
      images: [],
      category: '',
      stock: 0,
    });
    setImageUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchProducts();
  }

  async function handleDelete(id) {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  }

  return (
    <div className={styles.adminWrap}>
      <h1>상품 관리</h1>
      {editProduct && (
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
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 8,
            }}
          >
            {form.images.map((img, idx) => (
              <div
                key={img}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <img
                  src={img}
                  alt="업로드 이미지"
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '1px solid #eee',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#222',
                    lineHeight: '18px',
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="이미지 URL 입력 후 추가"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              style={{ minWidth: 60 }}
            >
              추가
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageUpload}
            className={styles.fileInput}
          />
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
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="상품에 대한 설명을 입력해주세요"
          />
          <div className={styles.formBtns}>
            <button type="submit">수정</button>
            <button type="button" onClick={() => setEditProduct(null)}>
              취소
            </button>
          </div>
        </form>
      )}
      <div className={styles.tableWrap}>
        {loading ? (
          <div>로딩 중입니다....</div>
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
