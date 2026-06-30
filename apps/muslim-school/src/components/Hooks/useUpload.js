import { useState } from 'react';
import axios from 'axios';

const useUpload = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/images`, formData);
      setUrl(res.data); // Ensure your API responds with the uploaded file URL
      setLoading(false);
    } catch (error) {
      console.error("Upload failed", error);
      setLoading(false);
    }
  };

  return {
    file,
    setFile,
    url,
    loading,
    handleSubmit,
  };
};

export default useUpload;
