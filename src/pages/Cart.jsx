import React, { useState, useEffect } from 'react';
import { getCart, checkout } from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import Header from '../components/Header';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const fetchCartData = async () => {
  setLoading(true);
  try {
    const res = await getCart(); 
    console.log("Dữ liệu giỏ hàng từ API:", res.data); // Kiểm tra ở đây
    setCartItems(res.data || []);
  } catch (err) {
    console.error("Lỗi khi lấy giỏ hàng:", err);
    setCartItems([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCartData();
  }, []);
  const saveCartToStorage = (newCart) => {
    setCartItems(newCart);
    // Vẫn cập nhật localStorage để Header (nếu dùng) update số lượng nhanh
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated')); 
  };

  const handleIncrement = (index) => {
    const newCart = [...cartItems];
    newCart[index].quantity += 1;
    saveCartToStorage(newCart);
    // Gợi ý: Vinh nên gọi API updateQuantity(productId, newQty) ở đây
  };

  const handleDecrement = (index) => {
    const newCart = [...cartItems];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      saveCartToStorage(newCart);
    }
  };

  const handleRemove = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    saveCartToStorage(newCart);
    // Gợi ý: Vinh nên gọi API removeItem(productId) ở đây
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      // Gọi API checkout thực tế của bạn
      await checkout();
      
      alert('🎉 Đặt hàng thành công chóp nhoáng qua Data Grid!');
      saveCartToStorage([]); // Xóa sạch giỏ sau khi checkout
      navigate('/'); // Chuyển về trang chủ
    } catch (err) {
      alert('Lỗi đặt hàng! Có thể đã hết hàng trong Redis hoặc lỗi hệ thống.');
    } finally {
      setCheckingOut(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
              <ShoppingCart className="mr-3 text-red-600 h-8 w-8" />
              Giỏ Hàng Của Bạn
            </h1>
            <button onClick={fetchCartData} className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="Làm mới giỏ hàng">
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>

        {loading ? (
           <div className="bg-white rounded-2xl h-[300px] flex items-center justify-center shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
           </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-8">Bạn chưa múc món đồ Flash Sale nào cả!</p>
            <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors">
              <ArrowRight className="mr-2 h-5 w-5" />
              Tiếp tục săn Sale
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {cartItems.map((item, index) => (
                    <li key={item.productId || index} className="p-6 flex">
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{item.name || 'Sản phẩm'}</h3>
                            <p className="mt-1 text-sm text-gray-500">Mã SP: {item.productId}</p>
                          </div>
                          <p className="text-lg font-bold text-red-600">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-end justify-between text-sm mt-4">
                          <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                            <button onClick={() => handleDecrement(index)} className="px-2 py-1 bg-white rounded-md shadow-sm hover:bg-gray-50 text-gray-700 font-bold">-</button>
                            <span className="px-4 font-bold text-gray-800">{item.quantity}</span>
                            <button onClick={() => handleIncrement(index)} className="px-2 py-1 bg-white rounded-md shadow-sm hover:bg-gray-50 text-gray-700 font-bold">+</button>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemove(index)}
                            className="font-medium text-red-500 hover:text-red-400 flex items-center bg-red-50 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Xóa
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Tổng kết</h2>
                <div className="flow-root">
                  <div className="-my-4 divide-y divide-gray-100 text-sm">
                    <div className="py-4 flex items-center justify-between">
                      <p className="text-gray-600">Tạm tính (Data Grid)</p>
                      <p className="font-medium text-gray-900">{formatPrice(total)}</p>
                    </div>
                    <div className="py-4 flex items-center justify-between">
                      <p className="text-base font-bold text-gray-900">Tổng cộng</p>
                      <p className="text-2xl font-bold text-red-600">{formatPrice(total)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-red-600 to-orange-500 border border-transparent rounded-xl shadow-sm py-4 px-4 text-lg font-bold text-white hover:from-red-700 hover:to-orange-600 transition-all transform hover:scale-[1.02] disabled:opacity-70"
                  >
                    {checkingOut ? (
                      <span className="flex items-center animate-pulse">
                        <Zap className="animate-spin mr-2 h-6 w-6" /> Đang chốt đơn...
                      </span>
                    ) : (
                      'ĐẶT HÀNG NGAY TỨC THÌ'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;