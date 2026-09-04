export default function Home({ assets, setActivePage }) {
  const totalAssets = assets.length;
  const inUse = assets.filter(a => a.status === 'Dipakai User').length;
  const inIt = assets.filter(a => a.status === 'Hold di IT').length;
  const repair = assets.filter(a => a.status === 'Dalam Perbaikan').length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang di IT MOVI Dashboard! 👋</h1>
        <p className="text-blue-100 max-w-xl">
          Asset IT Hardware dan Digital.
        </p>
        <button 
          onClick={() => setActivePage('assets')}
          className="mt-6 bg-white text-blue-600 px-5 py-2.5 rounded-xl font-semibold text-sm shadow hover:bg-blue-50 transition"
        >
          Kelola Asset Sekarang ➔
        </button>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Aset</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalAssets}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Dipakai User</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{inUse}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Hold di IT (Stok)</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{inIt}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Dalam Perbaikan</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{repair}</p>
        </div>
      </div>
    </div>
  );
}