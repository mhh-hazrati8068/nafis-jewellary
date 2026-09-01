const SERVER = 'http://188.212.99.215:8080';

async function testCustomerFlow() {
  console.log('--- 1. Testing Send Code ---');
  const phone = '09123456789';
  const sendRes = await fetch(`${SERVER}/api/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: phone })
  });
  const sendText = await sendRes.text();
  console.log('Send Code Response:', sendText);

  // If SMS fails or in test mode, the backend returns "SMS failed, but code saved for testing in console: XXXXX"
  let code = '12345';
  const match = sendText.match(/(\d{5})/);
  if (match) {
    code = match[1];
    console.log('Extracted OTP code:', code);
  }

  console.log('\n--- 2. Testing Verify Code ---');
  const verifyRes = await fetch(`${SERVER}/api/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: phone, code: code })
  });
  console.log('Verify Status:', verifyRes.status);
  const userToken = await verifyRes.text();
  console.log('Customer JWT Token:', userToken.substring(0, 30) + '...');

  console.log('\n--- 3. Testing Get Profile ---');
  const profileRes = await fetch(`${SERVER}/api/users/profile`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  console.log('Profile Status:', profileRes.status);
  const profile = await profileRes.json();
  console.log('Customer Profile:', profile);

  console.log('\n--- 4. Updating Profile ---');
  const updateProfRes = await fetch(`${SERVER}/api/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      firstName: 'محمد',
      lastName: 'رضایی',
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      postalCode: '1987654321'
    })
  });
  console.log('Update Profile Status:', updateProfRes.status, await updateProfRes.text());

  console.log('\n--- 5. Placing Order (Checkout) ---');
  const checkoutRes = await fetch(`${SERVER}/api/invoices/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      cartItems: { 2: 1 }, // 1 quantity of product ID 2
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      postalCode: '1987654321'
    })
  });
  console.log('Checkout Status:', checkoutRes.status);
  const invoice = await checkoutRes.json();
  console.log('Created Invoice:', invoice);

  console.log('\n--- 6. Customer Order History ---');
  const ordersRes = await fetch(`${SERVER}/api/invoices/my-orders`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  console.log('My Orders Status:', ordersRes.status);
  const orders = await ordersRes.json();
  console.log('My Orders Count:', orders.length);

  console.log('\n--- 7. Mock Payment for Invoice ---');
  const payRes = await fetch(`${SERVER}/api/invoices/${invoice.id}/pay`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  console.log('Payment Status:', payRes.status, await payRes.text());

  console.log('\n--- 8. Admin Verification of Orders ---');
  const adminLoginRes = await fetch(`${SERVER}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin' })
  });
  const adminToken = await adminLoginRes.text();

  const adminInvoicesRes = await fetch(`${SERVER}/api/admin/invoices`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const adminInvoices = await adminInvoicesRes.json();
  console.log('Admin Invoices Count:', adminInvoices.length);
  console.log('Latest Admin Invoice Status & Paid:', adminInvoices[0].orderStatus, adminInvoices[0].paid);
}

testCustomerFlow().catch(console.error);
