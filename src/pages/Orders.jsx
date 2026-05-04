import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Header from '../components/Header';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fake orders data
    const mockOrders = [
      {
        id: 'ORD-872391',
        date: '04/05/2026 14:30',
        status: 'DELIVERED',
        total: 31500000,
        // items: [
        //   { ...mockProducts[0], quantity: 1 },
        //   { ...mockProducts[10], quantity: 1 } // fake adding an item
        // ]
      },
      {
        id: 'ORD-872392',
        date: '02/05/2026 09:15',
        status: 'SHIPPING',
        total: 5490000,
        // items: [
        //   { ...mockProducts[5], quantity: 1 }
        // ]
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 400);
  }, []);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full"><CheckCircle className="w-4 h-4 mr-1" /> Đã giao hàng</span>;
      case 'SHIPPING':
        return <span className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full"><Truck className="w-4 h-4 mr-1" /> Đang vận chuyển</span>;
      default:
        return <span className="flex items-center text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full"><Clock className="w-4 h-4 mr-1" /> Chờ xử lý</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-2xl font-bold flex items-center mb-6">
          <Package className="mr-3 text-red-600" />
          Đơn Mua Của Bạn
        </h1>

        {loading ? (
          <div className="bg-white rounded-2xl h-64 animate-pulse"></div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                  <div className="text-sm font-medium text-gray-500">
                    Mã đơn: <span className="text-gray-900 font-bold">{order.id}</span>
                    <span className="mx-2">|</span>
                    Ngày đặt: {order.date}
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                      <div className="font-bold text-red-600">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                  <div className="text-right">
                    <span className="text-gray-500 mr-4 text-sm">Thành tiền:</span>
                    <span className="text-xl font-bold text-red-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;