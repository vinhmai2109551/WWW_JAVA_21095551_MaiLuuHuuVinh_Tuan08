import axios from 'axios';

// Cấu hình URL cho các PU (Đã cập nhật theo IP nhóm bạn cung cấp)
const PU1_PRODUCT_URL   = 'http://172.16.67.44:8081';   // Người 2 - Product
const PU2_CART_URL      = 'http://172.16.67.13:8080';   // Người 3 - Cart 
const PU3_ORDER_URL     = 'http://172.16.64.103:8083';  // Người 4 - Order 
const PU4_INVENTORY_URL = 'http://172.16.71.20:8084';  // Người 5 - Inventory 

/**
 * Lấy UserID từ Cookie (do trang Login lưu)
 * Đây là chìa khóa để các PU nhận diện giỏ hàng của từng người
 */
export const getUserId = () => {
  const match = document.cookie.match(new RegExp('(^| )userId=([^;]+)'));
  if (match) return match[2];
  
  // Nếu không có cookie, lấy từ localStorage (fallback) hoặc mặc định
  return localStorage.getItem('userId') || 'user_123'; 
};

// --- PRODUCT SERVICES (PU1) ---
export const getProducts = () => axios.get(`${PU1_PRODUCT_URL}/products`);
export const getProductById = (id) => axios.get(`${PU1_PRODUCT_URL}/products/${id}`);

// --- CART SERVICES (PU2 - Redis/Data Grid) ---
// Lấy danh sách item trong giỏ hàng
export const getCart = () => axios.get(`${PU2_CART_URL}/cart?userId=${getUserId()}`);

// Thêm sản phẩm vào giỏ (Gửi qua Query Parameters theo đúng image_98c79c.png)
export const addToCart = (productId, quantity) => {
  const userId = getUserId();
  return axios.post(
    `${PU2_CART_URL}/cart/add?userId=${userId}&productId=${productId}&quantity=${quantity}`, 
    {} 
  );
};

// Xóa sản phẩm khỏi giỏ (Nếu PU2 có hỗ trợ)
export const removeFromCart = (productId) => {
    const userId = getUserId();
    return axios.delete(`${PU2_CART_URL}/cart/remove?userId=${userId}&productId=${productId}`);
};

// --- ORDER SERVICES (PU3) ---
// Thực hiện thanh toán chớp nhoáng
export const checkout = () => {
    return axios.post(`${PU3_ORDER_URL}/checkout`, { 
        userId: getUserId() 
    });
};