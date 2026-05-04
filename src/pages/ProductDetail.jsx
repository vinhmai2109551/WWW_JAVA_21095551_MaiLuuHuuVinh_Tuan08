import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import { getProductById } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy file bằng ID
    getProductById(id)
      .then(res => {
        const p = res.data;
        setProduct({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.desc,
          image: `https://picsum.photos/seed/${p.id}/500/500`,
          stock: 100,
          oldPrice: p.price * 1.2
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy chi tiết Sản Phẩm", err);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    // await addToCart(product.id, 1, product.price);
    
    // Giả lập DataGrid (Redis) bằng localStorage
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = currentCart.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('cartUpdated')); // Kích hoạt sự kiện để Header cập nhật

    alert('Đã thêm sản phẩm vào giỏ hàng thành công! 🚀');
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-8 animate-pulse flex space-x-8 mt-10">
          <div className="w-1/2 h-96 bg-gray-200 rounded-2xl"></div>
          <div className="w-1/2 space-y-6">
            <div className="h-10 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
            <div className="h-32 bg-gray-200 w-full rounded"></div>
            <div className="h-12 bg-gray-200 w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Không tìm thấy sản phẩm!</h1>
        <button onClick={() => navigate('/')} className="mt-4 text-red-600 hover:underline">Quay lại trang chủ</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-red-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
            {/* Cột thông tin */}
            <div className="w-full p-8 lg:p-12 flex flex-col max-w-4xl mx-auto">
              <div className="mb-2">
                <span className="bg-red-100 text-red-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                  Flash Sale
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-end mb-6">
                <span className="text-4xl font-extrabold text-red-600 mr-4">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through mb-1">{formatPrice(product.oldPrice)}</span>
                )}
                {product.oldPrice && (
                  <span className="ml-4 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-lg mb-1">
                    -{Math.round((product.oldPrice - product.price) / product.oldPrice * 100)}%
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-orange-800">Trạng thái kho hàng (Redis)</span>
                  <span className={product.stock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Đã bán hết'}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-orange-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${product.stock > 5 ? 'bg-orange-500' : product.stock > 0 ? 'bg-red-500' : 'bg-gray-400'}`} 
                    style={{ width: `${product.stock > 20 ? 100 : (product.stock / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`w-full flex items-center justify-center py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300
                    ${product.stock > 0 
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-xl hover:shadow-red-500/30 transform hover:-translate-y-1' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                  <ShoppingBag className="w-6 h-6 mr-3" />
                  {product.stock > 0 ? 'MÚC NGAY VÀO GIỎ' : 'TIẾC QUÁ, HẾT HÀNG'}
                </button>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 text-sm">
                    <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
                    Bảo hành chính hãng 100%
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Truck className="w-5 h-5 mr-2 text-blue-500" />
                    Giao hàng tốc tốc
                  </div>
                  <div className="flex items-center text-gray-500 text-sm col-span-2">
                    <RotateCcw className="w-5 h-5 mr-2 text-purple-500" />
                    Đổi trả dễ dàng 15 ngày
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;