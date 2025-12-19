// Test script for Hugging Face Inference API integration
import axios from 'axios';

async function testHuggingFaceAPI() {
  try {
    const response = await axios.post('http://localhost:3002/api/chat', {
      message: 'Hello, how are you?',
      model: 'huggingface'
    });
    
    console.log('Hugging Face API Response:', response.data);
  } catch (error) {
    console.error('Error testing Hugging Face API:', error.response?.data || error.message);
  }
}

testHuggingFaceAPI();