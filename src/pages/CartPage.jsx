import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("laptop_cart")) || [];
    setCartItems(cart);
    calculateTotal(cart);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(total);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem("laptop_cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("laptop_cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("laptop_cart");
    setTotal(0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cartPageContainer">
        <h1 className="cartTitle">Корзина</h1>
        <p className="cartEmpty">Ваша корзина пуста</p>
        <Link to="/" className="cartContinueShopping">
          Продолжить покупки
        </Link>
      </div>
    );
  }

  return (
    <div className="cartPageContainer">
      <h1 className="cartTitle">Корзина</h1>
      <div className="cartContent">
        <div className="cartItems">
          {cartItems.map(item => (
            <div key={item.id} className="cartItem">
              <div className="cartItemImage">
                <img 
                  src={item.imageUrl || "https://via.placeholder.com/120x120?text=No+Image"} 
                  alt={item.model_name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/120x120?text=No+Image";
                  }}
                />
              </div>
              <div className="cartItemDetails">
                <h3 className="cartItemTitle">{item.model_name}</h3>
                <p className="cartItemManufacturer">{item.manufacturer}</p>
                <p className="cartItemPrice">{item.price.toLocaleString()} ₽</p>
              </div>
              <div className="cartItemQuantity">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="cartItemSubtotal">
                {(item.price * item.quantity).toLocaleString()} ₽
              </div>
              <button 
                className="cartItemRemove"
                onClick={() => removeItem(item.id)}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
        <div className="cartSummary">
          <h2 className="cartSummaryTitle">Итого</h2>
          <div className="cartSummaryRow">
            <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
            <span>{total.toLocaleString()} ₽</span>
          </div>
          <div className="cartSummaryRow">
            <span>Доставка</span>
            <span>0 ₽</span>
          </div>
          <div className="cartSummaryTotal">
            <span>Общая сумма</span>
            <span>{total.toLocaleString()} ₽</span>
          </div>
          <button className="cartCheckoutBtn">
            Перейти к оформлению
          </button>
          <button 
            className="cartClearBtn"
            onClick={clearCart}
          >
            Очистить корзину
          </button>
          <Link to="/" className="cartContinueShopping">
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;