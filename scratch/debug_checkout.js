const SERVER = 'http://188.212.99.215:8080';

async function debugCheckout() {
  const phone = '09123456789';
  const sendRes = await fetch(`${SERVER}/api/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: phone })
  });
  const sendText = await sendRes.text();
  const match = sendText.match(/(\d{5})/);
  const code = match ? match[1] : '12345';

  const verifyRes = await fetch(`${SERVER}/api/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: phone, code: code })
  });
  const userToken = await verifyRes.text();

  const checkoutRes = await fetch(`${SERVER}/api/invoices/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      cartItems: { 2: 1 },
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      postalCode: '1987654321'
    })
  });
  console.log('Checkout status:', checkoutRes.status);
  console.log('Checkout body:', await checkoutRes.text());
}

debugCheckout().catch(console.error);
