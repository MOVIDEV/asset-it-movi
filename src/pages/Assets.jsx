export default function Assets({
  userRole, assets, loading, formData, handleChange, handleSubmit, handleDelete,
  handleOpenEdit, searchTerm, setSearchTerm, currentPage, setCurrentPage,
  itemsPerPage, selectedAsset, setSelectedAsset, showDetailModal, setShowDetailModal,
  showEditModal, setShowEditModal
}) {
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.sn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (asset.holder && asset.holder.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  return (
    <div className={`grid grid-cols-1 ${userRole === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
      
      {/* Form Tambah Aset (HANYA MUNCUL JIKA ADMIN) */}
      {userRole === 'admin' && (
        <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-1 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Tambah Aset Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="font-medium text-gray-600">Nama Aset / Perangkat</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="MacBook Pro M2" className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-medium text-gray-600">RAM</label>
                <input type="text" name="ram" value={formData.ram} onChange={handleChange} placeholder="16GB" className="w-full mt-1 p-2 border rounded-lg outline-none"/>
              </div>
              <div>
                <label className="font-medium text-gray-600">Storage</label>
                <input type="text" name="storage" value={formData.storage} onChange={handleChange} placeholder="512GB SSD" className="w-full mt-1 p-2 border rounded-lg outline-none"/>
              </div>
            </div>
            <div>
              <label className="font-medium text-gray-600">Serial Number (SN)</label>
              <input type="text" name="sn" value={formData.sn} onChange={handleChange} placeholder="C02G123456" className="w-full mt-1 p-2 border rounded-lg outline-none"/>
            </div>
            <div>
              <label className="font-medium text-gray-600">Kondisi Charger</label>
              <select name="charger" value={formData.charger} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none">
                <option value="Ada (Original)">Ada (Original)</option>
                <option value="Ada (KW/OEM)">Ada (KW/OEM)</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-gray-600">Status Aset</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none">
                <option value="Dipakai User">Dipakai User</option>
                <option value="Hold di IT">Hold di IT (Stok)</option>
                <option value="Dalam Perbaikan">Dalam Perbaikan</option>
              </select>
            </div>
            {formData.status === 'Dipakai User' && (
              <div>
                <label className="font-medium text-gray-600">Nama Pemegang / User</label>
                <input type="text" name="holder" value={formData.holder} onChange={handleChange} placeholder="Budi (Finance)" className="w-full mt-1 p-2 border rounded-lg outline-none"/>
              </div>
            )}
            <div>
              <label className="font-medium text-gray-600">Deskripsi</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Catatan..." rows="2" className="w-full mt-1 p-2 border rounded-lg outline-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
              Simpan Aset
            </button>
          </form>
        </div>
      )}

      {/* Tabel & Fitur Pencarian */}
      <div className={`bg-white p-6 rounded-xl shadow-md ${userRole === 'admin' ? 'lg:col-span-2' : 'lg:col-span-1'} flex flex-col justify-between`}>
        <div>
          <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Daftar Aset IT</h2>
              {userRole === 'user' && <p className="text-xs text-blue-600 font-medium">Mode Viewer (Hanya bisa melihat detail)</p>}
            </div>
            <input 
              type="text" 
              placeholder="Cari nama, SN, atau user..." 
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
                    <th className="p-3">Nama Aset & SN</th>
                    <th className="p-3">Spesifikasi</th>
                    <th className="p-3">Posisi / User</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentAssets.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-400">Tidak ada data ditemukan.</td>
                    </tr>
                  ) : (
                    currentAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium text-gray-800">{asset.name}</div>
                          <div className="text-xs text-gray-400 font-mono">SN: {asset.sn}</div>
                        </td>
                        <td className="p-3 text-gray-600 text-xs">
                          <div>RAM: {asset.ram || '-'}</div>
                          <div>Storage: {asset.storage || '-'}</div>
                        </td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mb-1 ${
                            asset.status === 'Dipakai User' ? 'bg-green-100 text-green-700' :
                            asset.status === 'Hold di IT' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {asset.status}
                          </span>
                          <div className="text-xs text-gray-700">{asset.holder || '-'}</div>
                        </td>
                        <td className="p-3 space-x-1 whitespace-nowrap">
                          <button 
                            onClick={() => { setSelectedAsset(asset); setShowDetailModal(true); }}
                            className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium hover:bg-blue-100"
                          >
                            Detail
                          </button>

                          {/* Tombol Edit & Hapus HANYA MUNCUL JIKA ADMIN */}
                          {userRole === 'admin' && (
                            <>
                              <button 
                                onClick={() => handleOpenEdit(asset)}
                                className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-medium hover:bg-amber-100"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(asset.id)}
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

        {/* Pagination Controls */}
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

      {/* MODAL DETAIL (Bisa diakses Admin maupun User) */}
      {showDetailModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Detail Lengkap Aset</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><b>Nama Aset:</b> {selectedAsset.name}</p>
              <p><b>Serial Number (SN):</b> <span className="font-mono">{selectedAsset.sn}</span></p>
              <p><b>Spesifikasi RAM:</b> {selectedAsset.ram || '-'}</p>
              <p><b>Storage Harddisk:</b> {selectedAsset.storage || '-'}</p>
              <p><b>Kondisi Charger:</b> {selectedAsset.charger}</p>
              <p><b>Status Aset:</b> {selectedAsset.status}</p>
              <p><b>Pemegang / User:</b> {selectedAsset.holder || '-'}</p>
              <p><b>Update Terakhir:</b> {selectedAsset.updatedAt ? selectedAsset.updatedAt.split('T')[0] : '-'}</p>
              <p><b>Deskripsi:</b> {selectedAsset.description || 'Tidak ada catatan.'}</p>
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

      {/* MODAL EDIT (Hanya muncul jika admin membuka modal edit) */}
      {showEditModal && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Edit Aset IT</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="font-medium text-gray-600">Nama Aset</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none"/>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-gray-600">RAM</label>
                  <input type="text" name="ram" value={formData.ram} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none"/>
                </div>
                <div>
                  <label className="font-medium text-gray-600">Storage</label>
                  <input type="text" name="storage" value={formData.storage} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none"/>
                </div>
              </div>
              <div>
                <label className="font-medium text-gray-600">Serial Number (SN)</label>
                <input type="text" name="sn" value={formData.sn} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none"/>
              </div>
              <div>
                <label className="font-medium text-gray-600">Kondisi Charger</label>
                <select name="charger" value={formData.charger} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none">
                  <option value="Ada (Original)">Ada (Original)</option>
                  <option value="Ada (KW/OEM)">Ada (KW/OEM)</option>
                  <option value="Tidak Ada">Tidak Ada</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-gray-600">Status Aset</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none">
                  <option value="Dipakai User">Dipakai User</option>
                  <option value="Hold di IT">Hold di IT (Stok)</option>
                  <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                </select>
              </div>
              {formData.status === 'Dipakai User' && (
                <div>
                  <label className="font-medium text-gray-600">Nama Pemegang / User</label>
                  <input type="text" name="holder" value={formData.holder} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none"/>
                </div>
              )}
              <div>
                <label className="font-medium text-gray-600">Deskripsi</label>
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