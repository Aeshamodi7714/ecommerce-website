async function testFetchOrders() {
  try {
    const res = await fetch('http://localhost:5000/api/admin/all/orders', {
      headers: {
        'Authorization': 'Bearer admin-auth-token-bypass'
      }
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

testFetchOrders();
