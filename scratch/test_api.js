const SERVER = 'http://188.212.99.215:8080';

async function run() {
  console.log('--- 1. Testing Admin Login ---');
  const loginRes = await fetch(`${SERVER}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin' })
  });
  if (!loginRes.ok) {
    console.error('Admin login failed:', loginRes.status, await loginRes.text());
    return;
  }
  const token = await loginRes.text();
  console.log('Admin Token:', token.substring(0, 30) + '...');

  console.log('\n--- 2. Updating Silver Price from TGJU ---');
  const priceRes = await fetch(`${SERVER}/api/admin/update-silver-price`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Silver Price Update:', await priceRes.text());

  console.log('\n--- 3. Testing Adding Stone Product ---');
  const formDataStone = new FormData();
  formDataStone.append('name', 'سنگ فیروزه نیشابور اصل');
  formDataStone.append('pricingMethod', 'METHOD_4_STONE_ONLY');
  formDataStone.append('stonePrice', '850000');
  formDataStone.append('stockQuantity', '15');
  formDataStone.append('badge', 'SPECIAL_OFFER');
  formDataStone.append('isVisible', 'true');

  const addStoneRes = await fetch(`${SERVER}/api/admin/products`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formDataStone
  });
  console.log('Add Stone status:', addStoneRes.status);
  const stoneData = await addStoneRes.json();
  console.log('Added Stone:', stoneData);

  console.log('\n--- 4. Adding Silver Ring with Stone ---');
  const formDataRing = new FormData();
  formDataRing.append('name', 'انگشتر نقره دست‌ساز نگین فیروزه نیشابور');
  formDataRing.append('pricingMethod', 'METHOD_1_SILVER_MAKING_STONE');
  formDataRing.append('weight', '7.85');
  formDataRing.append('makingChargePercentage', '20');
  formDataRing.append('stockQuantity', '8');
  formDataRing.append('badge', 'BEST_SELLER');
  formDataRing.append('isVisible', 'true');

  const addRingRes = await fetch(`${SERVER}/api/admin/products?stoneId=${stoneData.id}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formDataRing
  });
  console.log('Add Ring status:', addRingRes.status);
  const ringData = await addRingRes.json();
  console.log('Added Ring:', ringData);

  console.log('\n--- 5. Testing Public /api/products ---');
  const publicRes = await fetch(`${SERVER}/api/products`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Public Products Status:', publicRes.status);
  const publicProducts = await publicRes.json();
  console.log('Public Products List:', JSON.stringify(publicProducts, null, 2));

  console.log('\n--- 6. Testing /api/products/silver-price ---');
  const livePriceRes = await fetch(`${SERVER}/api/products/silver-price`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Live Silver Price Status:', livePriceRes.status);
  console.log('Live Silver Price Body:', await livePriceRes.json());
}

run().catch(console.error);
