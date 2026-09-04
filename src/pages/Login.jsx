
import logoIcon from '../assets/MOVI.png'; // Sesuaikan path jika nama file beda

export default function Login({ loginForm,setActiveView, setLoginForm, handleLogin }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">ITAM Login</h2> */}
                  <div className="flex items-center space-x-3 cursor-pointer justify-center" onClick={() => setActivePage('home')}>
                           <img src={logoIcon} alt="Logo" className="w-8 h-8 object-contain" />
                          
                         </div>
        
        <p className="text-sm text-gray-500 mb-6 text-center">Silakan login untuk akses manajemen aset</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input 
              type="text" 
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              placeholder="admin" 
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input 
              type="password" 
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="admin123" 
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
            Masuk Aplikasi
          </button>
        </form>
        <button 
            onClick={() => setActiveView('register')} 
            className="text-blue-600 font-semibold hover:underline"
          >
            Registrasi di sini
          </button>
        <div className="mt-4 text-xs text-center text-gray-400">
          Default: Username: <b>admin</b> | Password: <b>admin123</b>
        </div>
      </div>
    </div>
  );
}