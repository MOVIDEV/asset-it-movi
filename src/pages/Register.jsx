import { useState } from 'react';
import axios from 'axios';

export default function Register({ setActiveView }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/register', formData);
      if (res.data.success) {
        alert('Registrasi Berhasil! Silakan login dengan akun baru Anda.');
        setActiveView('login'); // Pindah kembali ke halaman login
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Daftar Akun Baru</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">Sistem Manajemen Aset IT & Digital</p>
        
        <form onSubmit={handleRegister} className="space-y-4 text-sm">
          <div>
            <label className="font-medium text-gray-600">Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              placeholder="budi_it" 
              className="w-full mt-1 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="font-medium text-gray-600">Email Aktif</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="budi@perusahaan.com" 
              className="w-full mt-1 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="font-medium text-gray-600">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••" 
              className="w-full mt-1 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <button 
            onClick={() => setActiveView('login')} 
            className="text-blue-600 font-semibold hover:underline"
          >
            Login di sini
          </button>
        </div>
      </div>
    </div>
  );
}