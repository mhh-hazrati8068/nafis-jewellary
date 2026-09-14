const SERVER = 'http://nafiseebadijewellery.com';

async function testUpdateAndDelete() {
  const adminLoginRes = await fetch(`${SERVER}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin' })
  });
  const adminToken = await adminLoginRes.text();

  const fd = new FormData();
  fd.append('title', 'راهنمای جامع نگهداری و تمیز کردن زیورآلات نقره و سنگ‌های قیمتی');
  fd.append('slug', 'silver-and-gemstone-care-guide');
  fd.append('summary', 'چگونه از درخشش و جلای ماندگار نقره ۹۲۵ و سنگ‌های اصیل فیروزه و عقیق محافظت کنیم؟');
  fd.append('content', 'زیورآلات نقره به دلیل زیبایی و اصالت خود، جایگاه ویژه‌ای در دنیای جواهرات دارند.');

  const updateRes = await fetch(`${SERVER}/api/admin/articles/1`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: fd
  });
  console.log('Update status:', updateRes.status, await updateRes.json());
}

testUpdateAndDelete().catch(console.error);
