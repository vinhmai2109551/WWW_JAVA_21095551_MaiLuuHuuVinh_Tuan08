import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('rememberUser');
    if (savedUser) {
      setEmail(savedUser);
      setRememberMe(true);
    }

    const match = document.cookie.match(new RegExp('(^| )userId=([^;]+)'));
    if (match) {
      setUserId(match[2]);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Thiết lập trạng thái đăng nhập
    localStorage.setItem('isAuthenticated', 'true');
    const username = email.split('@')[0] || 'User';
    localStorage.setItem('username', username);

    // LƯU COOKIE: Quan trọng phải có path=/ để xóa được ở mọi trang
    const finalUserId = userId.trim() || 'user_123'; 
    document.cookie = `userId=${finalUserId}; path=/; max-age=86400; SameSite=Lax`; 

    if (rememberMe) {
      localStorage.setItem('rememberUser', email);
    } else {
      localStorage.removeItem('rememberUser');
    }

    // Phát sự kiện để Header cập nhật giao diện ngay lập tức
    window.dispatchEvent(new Event("storage"));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden relative">
      {/* Background Graphic giữ nguyên như code cũ của Vinh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500 rounded-full blur-[120px] opacity-30 animate-pulse delay-700"></div>
      </div>
      
      <div className="max-w-md w-full p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-red-600 to-orange-500 rounded-full mb-4">
            <Zap className="h-8 w-8 text-white fill-current" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Dora<span className="text-red-500">Shop</span>
          </h2>
          <p className="mt-2 text-sm text-gray-300">Săn deal chớp nhoáng rẻ vô địch</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Các trường Email, UserID, Mật khẩu giữ nguyên... */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="nguyenvan@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">User ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="Ví dụ: user_VIP_01" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="••••••••" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-red-600 border-gray-600 rounded bg-gray-800/50" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">Ghi nhớ đăng nhập</label>
            </div>
            <a href="#" className="text-sm font-medium text-red-400 hover:text-red-300">Quên mật khẩu?</a>
          </div>

          <button type="submit"
            className="w-full py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 transition-all transform hover:scale-[1.02]">
            ĐĂNG NHẬP NGAY
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;