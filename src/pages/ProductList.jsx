import React, { useState, useEffect } from 'react';
import { getProducts, addToCart } from '../services/api'; // 1. Thêm addToCart vào đây
import { Timer, ShoppingBag, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(res => {
        const apiProducts = res.data.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.desc,
          image: `https://picsum.photos/seed/${p.id}/500/500`,
          stock: 100, 
          oldPrice: p.price * 1.2
        }));
        setProducts(apiProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy sản phẩm từ API", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // 2. Cập nhật hàm handleAddToCart để gọi API
  const handleAddToCart = async (e, product) => {
    e.preventDefault(); // Ngăn Link chuyển hướng khi click nút
    e.stopPropagation(); // Ngăn sự kiện nổi bọt lên Link
    
    try {
      // Gọi API addToCart (hàm này sẽ tự lấy userId từ cookie và nối vào URL)
      // Theo format: /cart/add?userId=...&productId=...&quantity=1
      await addToCart(product.id, 1);
      
      // Thông báo cho Header cập nhật số lượng hiển thị (nếu Header lấy từ API)
      window.dispatchEvent(new Event('cartUpdated')); 
      
      alert(`Đã thêm ${product.name} vào giỏ hàng thành công! 🚀`);
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
      alert('Không thể thêm vào giỏ hàng. Vui lòng kiểm tra lại kết nối!');
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      {/* Banner Sale */}
      <div className="bg-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Flame className="h-8 w-8 text-yellow-300 fill-current animate-pulse" />
                <h1 className="text-4xl font-black italic tracking-wider">SIÊU SALE CHỚP NHOÁNG</h1>
              </div>
              <p className="text-red-200 text-lg">Hàng ngàn deal sốc, múc ngay kẻo lỡ!</p>
            </div>
            <div className="mt-6 md:mt-0 bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center space-x-4 border border-white/30">
              <span className="font-medium text-white/90">Kết thúc trong:</span>
              <div className="flex space-x-2 text-2xl font-bold bg-white text-red-600 px-4 py-2 rounded-xl tabular-nums shadow-inner">
                <Timer className="h-6 w-6 mr-2 self-center text-red-500" />
                02 : 45 : 59
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group relative flex flex-col cursor-pointer">
                {/* Discount Badge */}
                {p.oldPrice && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                    -{Math.round((p.oldPrice - p.price) / p.oldPrice * 100)}%
                  </div>
                )}
                
                <div className="h-4"></div>
                
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between border-t border-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl font-bold text-red-600">{formatPrice(p.price)}</span>
                      {p.oldPrice && <span className="text-sm text-gray-400 line-through">{formatPrice(p.oldPrice)}</span>}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    {/* Stock Bar */}
                    <div className="mb-4 relative">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${p.stock > 5 ? 'bg-orange-400' : p.stock > 0 ? 'bg-red-500' : 'bg-gray-400'}`} 
                          style={{ width: `${p.stock > 10 ? 100 : (p.stock / 10) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs font-medium text-gray-500 mt-1 flex justify-between">
                        {p.stock > 0 ? <span>Còn {p.stock} sản phẩm (Redis)</span> : <span className="text-red-500">Đã bán hết</span>}
                      </p>
                    </div>

                    <button 
                      onClick={(e) => handleAddToCart(e, p)} // gọi API ở đây
                      disabled={p.stock <= 0}
                      className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-bold transition-all z-20 relative
                        ${p.stock > 0 
                          ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white active:scale-95' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      {p.stock > 0 ? 'THÊM VÀO GIỎ' : 'HẾT HÀNG'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;