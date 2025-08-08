// Simple test for upload endpoint
const fetch = require('node-fetch');

async function testUpload() {
  try {
    const response = await fetch('http://localhost:5001/api/upload/test');
    if (response.ok) {
      const result = await response.json();
      console.log('Upload test successful:', result);
    } else {
      console.log('Upload test failed with status:', response.status);
    }
  } catch (error) {
    console.error('Upload test error:', error.message);
  }
}

testUpload();
