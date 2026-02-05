import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Получаем корзину
    const cart = JSON.parse(localStorage.getItem("laptop_cart")) || [];
    setCartItems(cart);
    calculateTotal(cart);

    // Получаем информацию о текущем пользователе и токен
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Ошибка при чтении данных пользователя:", error);
      }
    }

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    setTotal(total);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) => {
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
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("laptop_cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("laptop_cart");
    setTotal(0);
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      alert("Корзина пуста!");
      return;
    }

    // Проверяем авторизацию пользователя
    if (!currentUser || !token) {
      alert("Для оформления заказа необходимо авторизоваться!");
      return;
    }

    // Подтверждение пользователя
    const confirmOrder = window.confirm(
      `Вы уверены, что хотите оформить заказ?\n\n` +
        `Количество товаров: ${cartItems.reduce((sum, item) => sum + item.quantity, 0)}\n` +
        `Общая сумма: ${total.toLocaleString()} руб.\n\n` +
        `Заказ будет оформлен на: ${currentUser.name} (${currentUser.email})`,
    );

    if (!confirmOrder) {
      return;
    }

    setIsCreatingOrder(true);
    setOrderStatus(null);

    try {
      // Используем новый эндпоинт для создания заказа с товарами
      const orderResponse = await fetch(
        "http://localhost:5000/api/orders/create-with-items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              id: item.id,
              model_name: item.model_name,
              quantity: item.quantity,
              price: item.price,
            })),
            total_amount: total,
          }),
        },
      );

      const data = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(data.message || "Не удалось создать заказ");
      }

      // Очищаем корзину и показываем успех
      clearCart();
      setOrderStatus({
        success: true,
        orderId: data.orderId,
        message: `Заказ успешно создан! Номер заказа: #${data.orderId}`,
      });

      // Показываем алерт с информацией о заказе
      alert(
        `✅ Заказ успешно создан!\n\n` +
          `Номер заказа: #${data.orderId}\n` +
          `Сумма: ${total.toLocaleString()} руб.\n` +
          `Статус: Обрабатывается\n\n` +
          `Мы свяжемся с вами для подтверждения заказа.`,
      );
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      setOrderStatus({
        success: false,
        message: error.message || "Произошла ошибка при оформлении заказа",
      });

      alert(
        `❌ Ошибка при оформлении заказа:\n${error.message || "Неизвестная ошибка"}`,
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Альтернативный вариант (если хотите использовать отдельные эндпоинты)
  const handleCreateOrderAlternative = async () => {
    if (cartItems.length === 0) {
      alert("Корзина пуста!");
      return;
    }

    if (!currentUser || !token) {
      alert("Для оформления заказа необходимо авторизоваться!");
      return;
    }

    setIsCreatingOrder(true);

    try {
      // 1. Создаем заказ
      const orderResponse = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          total_amount: total,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Не удалось создать заказ");
      }

      const orderId = orderData.order.id;

      // 2. Создаем элементы заказа
      for (const item of cartItems) {
        const orderItemResponse = await fetch(
          "http://localhost:5000/api/order-items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              order_id: orderId,
              laptop_id: item.id,
              item_quantity: item.quantity,
              price: item.price,
            }),
          },
        );

        if (!orderItemResponse.ok) {
          const errorData = await orderItemResponse.json();
          throw new Error(
            `Не удалось добавить товар ${item.model_name}: ${errorData.message}`,
          );
        }
      }

      // 3. Очищаем корзину
      clearCart();

      alert(
        `Заказ успешно создан!\n\n` +
          `Номер заказа: #${orderId}\n` +
          `Сумма: ${total.toLocaleString()} руб.\n` +
          `Статус: Обрабатывается`,
      );

      setOrderStatus({
        success: true,
        orderId: orderId,
      });
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      alert(`Ошибка: ${error.message}`);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cartPageContainer">
        <h1 className="cartTitle">Корзина</h1>
        {orderStatus?.success ? (
          <>
            <div className="cartSuccess">
              <Link to="/" className="cartContinueShopping">
                Продолжить покупки
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="cartEmpty">Ваша корзина пуста</p>
            <Link to="/" className="cartContinueShopping">
              Продолжить покупки
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="cartPageContainer">
      <h1 className="cartTitle">Корзина</h1>

      {orderStatus?.success === false && (
        <div className="cartError">{orderStatus.message}</div>
      )}

      <div className="cartContent">
        <div className="cartItems">
          {cartItems.map((item) => (
            <div key={item.id} className="cartItem">
              <div className="cartItemImage">
                <img
                  src={
                    item.imageUrl ||
                    "https://via.placeholder.com/120x120?text=No+Image"
                  }
                  alt={item.model_name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/120x120?text=No+Image";
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
            <span>
              Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
            </span>
            <span>{total.toLocaleString()} ₽</span>
          </div>
          <div className="cartSummaryRow">
            <span>Доставка</span>
            <span>Бесплатно</span>
          </div>
          <div className="cartSummaryTotal">
            <span>Общая сумма</span>
            <span>{total.toLocaleString()} ₽</span>
          </div>

          <div className="cartUserInfo">
            {currentUser ? (
              <>
                <p>Заказ оформляется на:</p>
                <p>
                  <strong>{currentUser.name}</strong>
                </p>
                <p>{currentUser.email}</p>
              </>
            ) : (
              <div className="cartAuthWarning">
                <p>
                  <strong>
                    Для оформления заказа необходимо авторизоваться!
                  </strong>
                </p>
                <Link to="/" className="cartAuthLink">
                  Перейти на главную для входа
                </Link>
              </div>
            )}
          </div>

          <button
            className="cartCheckoutBtn"
            onClick={handleCreateOrder}
            disabled={isCreatingOrder || cartItems.length === 0 || !currentUser}
          >
            {isCreatingOrder ? "Оформление..." : "Оформить заказ"}
          </button>

          <button
            className="cartClearBtn"
            onClick={clearCart}
            disabled={isCreatingOrder}
          >
            Очистить корзину
          </button>

          <Link to="/" className="cartContinueShopping">
            ← Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
