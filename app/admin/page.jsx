'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase/supabaseClient';
import styles from './styles/AdminDashboard.module.css';

export default function AdminDashboardHome() {
  const [showForm, setShowForm] = useState(false);
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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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
    await supabase.from('products').insert([payload]);
    setShowForm(false);
    setForm({
      name: '',
      price: '',
      description: '',
      images: [],
      category: '',
      stock: 0,
    });
    router.push('/admin/products');
  }

  return (
    <div className={styles.adminWrap}>
      <div className={styles.admin_flex}>
        <h2>관리자 대시보드</h2>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          로그아웃
        </button>
      </div>
      <button className={styles.addBtn} onClick={() => setShowForm(true)}>
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
            이미지를 올려주세요. 여러 장 업로드/입력 가능
          </p>
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
            <button type="submit">등록</button>
            <button type="button" onClick={() => setShowForm(false)}>
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
