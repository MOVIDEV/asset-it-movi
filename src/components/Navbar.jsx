import logoIcon from '../assets/MOVI.png'; // Sesuaikan path jika nama file beda

export default function Navbar({ onLogout, activePage, setActivePage }) {
  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        {/* Logo / Icon + Nama Aplikasi */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActivePage('home')}>
          <img src={logoIcon} alt="Logo" className="w-8 h-8 object-contain" />
         
        </div>

        <div className="space-x-2">
          <button 
            onClick={() => setActivePage('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activePage === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActivePage('assets')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activePage === 'assets' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Aset Fisik
          </button>
          {/* Menu Baru untuk Aset Digital */}
          <button 
            onClick={() => setActivePage('digital')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activePage === 'digital' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Aset Digital (Akun)
          </button>
        </div>
      </div>
      <button 
        onClick={onLogout}
        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
      >
        Logout
      </button>
    </nav>
  );
}