import { useEffect, useState } from 'react';
import axios from 'axios';

function TestComponent() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/test`)
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return <h1>{message}</h1>;
}
export default TestComponent;