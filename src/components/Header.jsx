import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, LogOut, User, FileText } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('Khách');
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get username from localStorage or default
    const updateUsername = () => {
      const storedName = localStorage.getItem('username');
      if (storedName) {
        setUsername(storedName);
      }
    };
    
    updateUsername();
    
    // Listen for storage events (e.g. from Profile update or Login)
    window.addEventListener('storage', updateUsername);

    // Cập nhật số lượng giỏ hàng
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', updateUsername);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('isAuthenticated');
  //   localStorage.removeItem('username');
  //   navigate('/login');
  // };
  const handleLogout = () => {
    // 1. Xóa các trạng thái đăng nhập trong localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    
    // 2. XÓA COOKIE: Đặt userId về rỗng và thời gian hết hạn là năm 1970
    // Lưu ý: path=/ phải khớp với lúc bạn tạo ở trang Login
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 3. Thông báo cho các thành phần khác cập nhật giao diện ngay lập tức
    window.dispatchEvent(new Event("storage"));

    // 4. Đóng dropdown menu (nếu đang mở)
    setIsDropdownOpen(false);

    // 5. Chuyển hướng về trang login
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center group">
            <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-700 transition-colors">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">
              DoraShop
            </span>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Trang chủ</Link>
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-red-600 transition-colors group">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mr-1 -mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <span className="font-medium text-sm hidden sm:block max-w-[100px] truncate">{username}</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 transform origin-top-right transition-all animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">Xin chào, {username}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Tài Khoản Của Tôi
                  </Link>
                  <Link 
                    to="/orders" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Đơn Mua
                  </Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng Xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;