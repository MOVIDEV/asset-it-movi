import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DigitalAssets({ userRole }) { // <-- TERIMA PROPS USERROLE
  const [digitalAssets, setDigitalAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    platform: '', username: '', password: '', department: 'Marketing', pic: '', description: ''
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

  const fetchDigitalAssets = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/digital-assets');
      setDigitalAssets(res.data);
    } catch (err) {
      console.error('Gagal memuat aset digital:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDigitalAssets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userRole !== 'admin') {
      alert('Akses ditolak!');
      return;
    }

    if (!formData.platform || !formData.username) {
      alert('Nama Platform/Akun dan Username wajib diisi!');
      return;
    }

    try {
      const payload = { ...formData, updatedAt: getTodayDate() };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/digital-assets/${editId}`, payload);
        alert('Akun digital berhasil diupdate!');
        setIsEditing(false);
        setEditId(null);
        setShowEditModal(false);
      } else {
        await axios.post('http://localhost:5000/api/digital-assets', payload);
        alert('Akun digital berhasil ditambahkan!');
      }

      setFormData({ platform: '', username: '', password: '', department: 'Marketing', pic: '', description: '' });
      fetchDigitalAssets();
    } catch (err) {
      alert('Gagal menyimpan data.');
    }
  };

  const handleOpenEdit = (asset) => {
    if (userRole !== 'admin') return;
    setIsEditing(true);
    setEditId(asset.id);
    setFormData({
      platform: asset.platform,
      username: asset.username,
      password: asset.password,
      department: asset.department || 'Marketing',
      pic: asset.pic || '',
      description: asset.description || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (userRole !== 'admin') {
      alert('Akses ditolak!');
      return;
    }
    if (confirm('Yakin ingin menghapus akun digital ini?')) {
      try {
        await axios.delete(`http://localhost:5000/api/digital-assets/${id}`);
        fetchDigitalAssets();
      } catch (err) {
        alert('Gagal menghapus data.');
      }
    }
  };

  const filteredAssets = digitalAssets.filter(item => 
    item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.pic && item.pic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  return (
    <div className={`grid grid-cols-1 ${userRole === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
      
      {/* Form Tambah Akun Digital (HANYA UNTUK ADMIN) */}
      {userRole === 'admin' && (
        <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-1 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Tambah Akun / Aset Digital</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="font-medium text-gray-600">Nama Akun / Platform</label>
              <input type="text" name="platform" value={formData.platform} onChange={handleChange} placeholder="Contoh: Instagram Movi" className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="font-medium text-gray-600">Username / Email</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="movi.official" className="w-full mt-1 p-2 border rounded-lg outline-none"/>
            </div>
            <div>
              <label className="font-medium text-gray-600">Password</label>
              <input type="text" name="password" value={formData.password} onChange={handleChange} placeholder="Rahasia123" className="w-full mt-1 p-2 border rounded-lg outline-none"/>
            </div>
            <div>
              <label className="font-medium text-gray-600">Departemen</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none">
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HRD">HRD</option>
                <option value="IT Department">IT Department</option>
                <option value="Operational">Operational</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-gray-600">Nama PIC / Penanggung Jawab</label>
              <input type="text" name="pic" value={formData.pic} onChange={handleChange} placeholder="Contoh: Sarah" className="w-full mt-1 p-2 border rounded-lg outline-none"/>
            </div>
            <div>
              <label className="font-medium text-gray-600">Keterangan / Catatan</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Catatan tambahan..." rows="2" className="w-full mt-1 p-2 border rounded-lg outline-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
              Simpan Akun Digital
            </button>
          </form>
        </div>
      )}

      {/* Tabel & Fitur Pencarian */}
      <div className={`bg-white p-6 rounded-xl shadow-md ${userRole === 'admin' ? 'lg:col-span-2' : 'lg:col-span-1'} flex flex-col justify-between`}>
        <div>
          <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Database Akun & Aset Digital</h2>
              {userRole === 'user' && <p className="text-xs text-blue-600 font-medium">Mode Viewer (Hanya bisa melihat detail)</p>}
            </div>
            <input 
              type="text" 
              placeholder="Cari platform, username, atau PIC..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="p-2 border rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-400">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-3">Platform / Akun</th>
                    <th className="p-3">Kredensial</th>
                    <th className="p-3">Dept & PIC</th>
                    <th className="p-3">Update Terakhir</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-400">Belum ada data akun digital.</td>
                    </tr>
                  ) : (
                    currentItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-800">
                          {item.platform}
                          <div className="text-xs text-gray-400 font-normal">{item.department}</div>
                        </td>
                        <td className="p-3 font-mono text-xs text-gray-600">
                          <div>User: {item.username}</div>
                          <div>Pass: ••••••••</div>
                        </td>
                        <td className="p-3 text-xs text-gray-700">
                          <span className="font-semibold">{item.pic || '-'}</span>
                        </td>
                        <td className="p-3 text-xs text-gray-500">
                          {item.updatedAt ? item.updatedAt.split('T')[0] : '-'}
                        </td>
                        <td className="p-3 space-x-1 whitespace-nowrap">
                          <button 
                            onClick={() => { setSelectedAsset(item); setShowDetailModal(true); }}
                            className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium hover:bg-blue-100"
                          >
                            Detail
                          </button>

                          {/* Tombol Edit & Hapus HANYA MUNCUL JIKA ADMIN */}
                          {userRole === 'admin' && (
                            <>
                              <button 
                                onClick={() => handleOpenEdit(item)}
                                className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-medium hover:bg-amber-100"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="text-red-500 bg-red-50 px-2 py-1 rounded text-xs font-medium hover:bg-red-100"
                              >
                                Hapus
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-gray-600">
          <div>Menampilkan halaman {currentPage} dari {totalPages || 1}</div>
          <div className="space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded bg-white disabled:opacity-50"
            >
              Prev
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {showDetailModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Detail Akun Digital</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><b>Platform / Akun:</b> {selectedAsset.platform}</p>
              <p><b>Username:</b> <span className="font-mono">{selectedAsset.username}</span></p>
              <p><b>Password:</b> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-red-600 font-bold">{userRole === 'admin' ? selectedAsset.password : '(gaboleh liat wlee)'}</span></p>
              <p><b>Departemen:</b> {selectedAsset.department}</p>
              <p><b>Penanggung Jawab (PIC):</b> {selectedAsset.pic || '-'}</p>
              <p><b>Update Terakhir:</b> {selectedAsset.updatedAt ? selectedAsset.updatedAt.split('T')[0] : '-'}</p>
              <p><b>Keterangan:</b> {selectedAsset.description || 'Tidak ada catatan.'}</p>
            </div>
            <button 
              onClick={() => setShowDetailModal(false)}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL EDIT (Hanya untuk Admin) */}
      {showEditModal && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Edit Akun Digital</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="font-medium text-gray-600">Nama Akun / Platform</label>
                <input type="text" name="platform" value={formData.platform} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none"/>
              </div>
              <div>
                <label className="font-medium text-gray-600">Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none"/>
              </div>
              <div>
                <label className="font-medium text-gray-600">Password</label>
                <input type="text" name="password" value={formData.password} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none"/>
              </div>
              <div>
                <label className="font-medium text-gray-600">Departemen</label>
                <select name="department" value={formData.department} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none">
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="HRD">HRD</option>
                  <option value="IT Department">IT Department</option>
                  <option value="Operational">Operational</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-gray-600">Nama PIC</label>
                <input type="text" name="pic" value={formData.pic} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none"/>
              </div>
              <div>
                <label className="font-medium text-gray-600">Keterangan</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full mt-1 p-2 border rounded-lg outline-none"></textarea>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2.5 rounded-lg font-medium hover:bg-blue-700">
                  Simpan Perubahan
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-300">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}