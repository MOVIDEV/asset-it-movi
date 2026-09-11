import { useState, useEffect } from 'react';
import axios from 'axios';

// Import Komponen & Halaman
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Assets from './pages/Assets';
import DigitalAssets from './pages/DigitalAssets';
import Register from './pages/Register';


function App() {
  const [authView, setAuthView] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'admin' atau 'user'
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activePage, setActivePage] = useState('home');

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', ram: '', storage: '', sn: '', charger: 'Ada (Original)', status: 'Dipakai User', holder: '', description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://api-itas.psl.id/api/login', loginForm);
      if (res.data.success) {
        setIsLoggedIn(true);
        setUserRole(res.data.role); // Tangkap role dari backend ('admin' / 'user')
        fetchAssets();
      }
    } catch (err) {
      alert('Login Gagal! Username atau password salah.');
    }
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://api-itas.psl.id/api/assets');
      setAssets(response.data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userRole !== 'admin') {
      alert('Akses ditolak! Anda adalah User Viewer.');
      return;
    }

    if (!formData.name || !formData.sn) {
      alert('Nama Aset dan SN wajib diisi!');
      return;
    }

    try {
      const payload = {
        ...formData,
        holder: formData.status === 'Hold di IT' ? 'IT Inventory' : formData.holder,
        updatedAt: getTodayDate()
      };

      if (isEditing) {
        await axios.put(`http://api-itas.psl.id/api/assets/${editId}`, payload);
        alert('Aset berhasil diupdate!');
        setIsEditing(false);
        setEditId(null);
        setShowEditModal(false);
      } else {
        await axios.post('http://api-itas.psl.id/api/assets', payload);
        alert('Aset berhasil ditambahkan!');
      }

      setFormData({ name: '', ram: '', storage: '', sn: '', charger: 'Ada (Original)', status: 'Dipakai User', holder: '', description: '' });
      fetchAssets();
    } catch (error) {
      alert('Gagal menyimpan data.');
    }
  };

  const handleOpenEdit = (asset) => {
    if (userRole !== 'admin') return;
    setIsEditing(true);
    setEditId(asset.id);
    setFormData({
      name: asset.name,
      ram: asset.ram || '',
      storage: asset.storage || '',
      sn: asset.sn,
      charger: asset.charger || 'Ada (Original)',
      status: asset.status || 'Dipakai User',
      holder: asset.holder || '',
      description: asset.description || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (userRole !== 'admin') {
      alert('Akses ditolak! Anda tidak memiliki izin menghapus data.');
      return;
    }
    if (confirm('Yakin ingin menghapus aset ini?')) {
      try {
        await axios.delete(`http://api-itas.psl.id/api/assets/${id}`);
        fetchAssets();
      } catch (error) {
        alert('Gagal menghapus data.');
      }
    }
  };

  // if (!isLoggedIn) {
  //   return <Login loginForm={loginForm} setLoginForm={setLoginForm} handleLogin={handleLogin} />;
  // }

  if (!isLoggedIn) {
  if (authView === 'register') {
    return <Register setActiveView={setAuthView} />;
  }
  return <Login loginForm={loginForm} setLoginForm={setLoginForm} handleLogin={handleLogin} setActiveView={setAuthView} />;
}

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <div>
        <Navbar 
          onLogout={() => { setIsLoggedIn(false); setLoginForm({ username: '', password: '' }); }} 
          activePage={activePage} 
          setActivePage={setActivePage} 
        />
        
        <main className="max-w-7xl mx-auto p-6">
          {activePage === 'home' && (
            <Home assets={assets} setActivePage={setActivePage} />
          )}

          {activePage === 'assets' && (
            <Assets 
              userRole={userRole} // <-- KIRIM ROLE KE KOMPONEN ASSETS
              assets={assets}
              loading={loading}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
              handleOpenEdit={handleOpenEdit}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              selectedAsset={selectedAsset}
              setSelectedAsset={setSelectedAsset}
              showDetailModal={showDetailModal}
              setShowDetailModal={setShowDetailModal}
              showEditModal={showEditModal}
              setShowEditModal={setShowEditModal}
            />
          )}

          {activePage === 'digital' && (
            <DigitalAssets userRole={userRole} /> // <-- KIRIM ROLE KE DIGITAL ASSETS
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;