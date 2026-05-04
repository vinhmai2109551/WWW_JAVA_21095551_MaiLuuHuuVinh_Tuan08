import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save } from 'lucide-react';
import Header from '../components/Header';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    fullName: 'Lưu Hữu Vinh',
    email: '',
    phone: '0987654321',
    address: '12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM'
  });

  useEffect(() => {
    // Lấy thông tin user từ localStorage nếu có
    const storedUsername = localStorage.getItem('username') || 'Khách';
    // Đọc email lưu lại nếu có từ check remember me
    const storedEmail = localStorage.getItem('rememberUser') || `${storedUsername}@gmail.com`;

    setProfile(prev => ({
      ...prev,
      username: storedUsername,
      email: storedEmail
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Cập nhật lại username lên Header bằng localStorage (thực tế sẽ gửi API cập nhật db)
    localStorage.setItem('username', profile.username);
    // Reload mượt để Header nhận tên mới
    window.dispatchEvent(new Event("storage")); 
    alert('Cập nhật hồ sơ thành công!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-2xl font-bold flex items-center mb-6">
          <User className="mr-3 text-red-600" />
          Hồ Sơ Của Tôi
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-8">
          {/* Cột trái avatar */}
          <div className="w-full md:w-1/4 flex flex-col items-center border-r border-gray-100 pr-0 md:pr-8">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden shadow-inner border border-gray-300">
              <User className="w-16 h-16 text-gray-500" />
            </div>
            <button className="text-sm border border-gray-300 bg-white px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
              Chọn Ảnh
            </button>
            <p className="text-xs text-gray-400 mt-3 text-center">Dụng lượng file tối đa 1 MB. Định dạng: .JPEG, .PNG</p>
          </div>

          {/* Cột phải Form */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <p className="text-gray-500">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg"
                >
                  <Edit3 className="w-4 h-4 mr-1" /> Chỉnh sửa
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  className="flex items-center text-sm font-bold text-white hover:bg-green-700 bg-green-600 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  <Save className="w-4 h-4 mr-1" /> Lưu lại
                </button>
              )}
            </div>

            <div className="space-y-5 cursor-text">
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600 text-sm font-medium">Tên đăng nhập</label>
                <div className="w-2/3">
                  <input 
                    type="text" 
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-xl transition-colors outline-none
                      ${isEditing ? 'border border-red-300 bg-white focus:ring-2 focus:ring-red-100' : 'border-transparent bg-gray-50 text-gray-700'}`}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600 text-sm font-medium">Họ & Tên</label>
                <div className="w-2/3">
                  <input 
                    type="text" 
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-xl transition-colors outline-none
                      ${isEditing ? 'border border-red-300 bg-white focus:ring-2 focus:ring-red-100' : 'border-transparent bg-gray-50 text-gray-700'}`}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600 text-sm font-medium flex items-center"><Mail className="w-4 h-4 mr-1"/> Email</label>
                <div className="w-2/3">
                  <input 
                    type="email" 
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-xl transition-colors outline-none
                      ${isEditing ? 'border border-red-300 bg-white focus:ring-2 focus:ring-red-100' : 'border-transparent bg-gray-50 text-gray-700'}`}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600 text-sm font-medium flex items-center"><Phone className="w-4 h-4 mr-1"/> Số điện thoại</label>
                <div className="w-2/3">
                  <input 
                    type="text" 
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-xl transition-colors outline-none
                      ${isEditing ? 'border border-red-300 bg-white focus:ring-2 focus:ring-red-100' : 'border-transparent bg-gray-50 text-gray-700'}`}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600 text-sm font-medium flex items-center"><MapPin className="w-4 h-4 mr-1"/> Địa chỉ</label>
                <div className="w-2/3">
                  <textarea 
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="2"
                    className={`w-full px-4 py-2 rounded-xl transition-colors outline-none resize-none
                      ${isEditing ? 'border border-red-300 bg-white focus:ring-2 focus:ring-red-100' : 'border-transparent bg-gray-50 text-gray-700'}`}
                  ></textarea>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;