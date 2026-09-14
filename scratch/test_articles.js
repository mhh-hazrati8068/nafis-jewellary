const SERVER = 'http://nafiseebadijewellery.com';

async function testArticles() {
  // 1. Admin login
  const adminLoginRes = await fetch(`${SERVER}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin' })
  });
  const adminToken = await adminLoginRes.text();
  console.log('Admin login status:', adminLoginRes.status);

  // 2. Test create article with FormData using Blob
  const formData = new FormData();
  const articleData = {
    title: 'راهنمای نگهداری و تمیز کردن زیورآلات نقره و سنگ‌های طبیعی',
    slug: 'silver-and-gemstone-care-guide',
    summary: 'چگونه از درخشش و جلای ماندگار نقره ۹۲۵ و سنگ‌های اصیل فیروزه و عقیق محافظت کنیم؟',
    content: 'زیورآلات نقره به دلیل زیبایی و اصالت خود، جایگاه ویژه‌ای در دنیای جواهرات دارند. برای حفظ درخشش نقره و جلوگیری از اکسید شدن، رعایت نکات نگهداری و شستشوی اصولی ضروری است.\n\n### ۱. دور نگه داشتن از مواد شیمیایی\nعطرها، شوینده‌ها و مواد آرایشی می‌توانند موجب کدر شدن نقره شوند.\n\n### ۲. نحوه نگهداری در جعبه مناسب\nاستفاده از جعبه‌های مخمل و ضد رطوبت به دوام و سلامت سنگ‌های طبیعی و فلز نقره کمک شایانی می‌کند.'
  };
  
  formData.append('article', new Blob([JSON.stringify(articleData)], { type: 'application/json' }));
  
  const createRes = await fetch(`${SERVER}/api/admin/articles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    },
    body: formData
  });
  
  console.log('Create article status (Blob):', createRes.status);
  const respText = await createRes.text();
  console.log('Create article response:', respText);
  
  // If Blob wasn't accepted, try JSON string or flat fields
  if (createRes.status !== 200) {
    const fd2 = new FormData();
    fd2.append('title', articleData.title);
    fd2.append('slug', articleData.slug);
    fd2.append('summary', articleData.summary);
    fd2.append('content', articleData.content);
    const createRes2 = await fetch(`${SERVER}/api/admin/articles`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: fd2
    });
    console.log('Create article status (flat):', createRes2.status, await createRes2.text());
  }

  // Check GET /api/articles
  const articlesRes = await fetch(`${SERVER}/api/articles`);
  console.log('GET /api/articles:', await articlesRes.json());
}

testArticles().catch(console.error);
