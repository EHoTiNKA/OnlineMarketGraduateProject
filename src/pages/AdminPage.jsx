import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AdminPage.css";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState("");

  const [users, setUsers] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddLaptopForm, setShowAddLaptopForm] = useState(false);
  const [showAddOrderForm, setShowAddOrderForm] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingLaptop, setEditingLaptop] = useState(null);

  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    role: "USER",
  });

  const [editLaptopData, setEditLaptopData] = useState({
    model_name: "",
    description: "",
    stock_quantity: 0,
    price: 0,
    manufacturer_id: "",
    is_available: true,
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [newLaptop, setNewLaptop] = useState({
    model_name: "",
    description: "",
    stock_quantity: 0,
    price: 0,
    manufacturer_id: "",
    is_available: true,
  });

  const [newOrder, setNewOrder] = useState({
    user_id: "",
    total_amount: 0,
    status: "PENDING",
    items: [],
  });

  const [currentOrderItem, setCurrentOrderItem] = useState({
    laptop_id: "",
    quantity: 1,
    price: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.role === "ADMIN") {
          loadData();
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/");
    }
  };

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [usersRes, laptopsRes, manufacturersRes, ordersRes] =
        await Promise.all([
          fetch("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/admin/laptops", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/admin/manufacturers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/admin/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (laptopsRes.ok) setLaptops(await laptopsRes.json());
      if (manufacturersRes.ok) setManufacturers(await manufacturersRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setError("Ошибка загрузки данных");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers([data.user, ...users]);
        setShowAddUserForm(false);
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "USER",
        });
        alert("Пользователь создан");
      } else {
        const error = await response.json();
        alert(error.message || "Ошибка при создании пользователя");
      }
    } catch (error) {
      console.error("Ошибка создания пользователя:", error);
      alert("Ошибка соединения");
    }
  };

  const startEditUser = (user) => {
    setEditingUser(user.id);
    setEditUserData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdateUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editUserData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, ...data.user } : user,
          ),
        );
        setEditingUser(null);
        alert("Пользователь обновлен");
      } else {
        const error = await response.json();
        alert(error.message || "Ошибка при обновлении");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Ошибка соединения");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого пользователя?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId));
        alert("Пользователь удален");
      } else {
        const error = await response.json();
        alert(error.message || "Ошибка при удалении");
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка соединения");
    }
  };

  const handleAddLaptop = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/laptops", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newLaptop,
          stock_quantity: parseInt(newLaptop.stock_quantity),
          price: parseFloat(newLaptop.price),
          manufacturer_id: parseInt(newLaptop.manufacturer_id),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLaptops([data.laptop, ...laptops]);
        setShowAddLaptopForm(false);
        setNewLaptop({
          model_name: "",
          description: "",
          stock_quantity: 0,
          price: 0,
          manufacturer_id: "",
          is_available: true,
        });
        alert("Ноутбук создан");
      } else {
        const error = await response.json();
        alert(error.message || "Ошибка при создании ноутбука");
      }
    } catch (error) {
      console.error("Ошибка создания ноутбука:", error);
      alert("Ошибка соединения");
    }
  };

  const startEditLaptop = (laptop) => {
    setEditingLaptop(laptop.id);
    setEditLaptopData({
      model_name: laptop.model_name,
      description: laptop.description || "",
      stock_quantity: laptop.stock_quantity,
      price: laptop.price,
      manufacturer_id: laptop.manufacturer_id,
      is_available: laptop.is_available,
    });
  };

  const handleUpdateLaptop = async (laptopId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/laptops/${laptopId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editLaptopData,
            stock_quantity: parseInt(editLaptopData.stock_quantity),
            price: parseFloat(editLaptopData.price),
            manufacturer_id: parseInt(editLaptopData.manufacturer_id),
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setLaptops(
          laptops.map((laptop) =>
            laptop.id === laptopId ? { ...laptop, ...data.laptop } : laptop,
          ),
        );
        setEditingLaptop(null);
        alert("Ноутбук обновлен");
      } else {
        const error = await response.json();
        alert(error.message || "Ошибка при обновлении");
      }
    } catch (error) {
      console.error("Ошибка обновления ноутбука:", error);
      alert("Ошибка соединения");
    }
  };

  const handleDeleteLaptop = async (laptopId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот ноутбук?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/laptops/${laptopId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        setLaptops(laptops.filter((l) => l.id !== laptopId));
        alert("Ноутбук удален");
      } else {
        const error = await response.json();
        alert(error.message || "Ошибка при удалении");
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка соединения");
    }
  };

  const handleAddOrderItem = () => {
    if (!currentOrderItem.laptop_id || currentOrderItem.quantity < 1) {
      alert("Выберите товар и укажите количество");
      return;
    }

    const selectedLaptop = laptops.find(
      (l) => l.id === parseInt(currentOrderItem.laptop_id),
    );
    if (!selectedLaptop) {
      alert("Товар не найден");
      return;
    }

    const price =
      currentOrderItem.price > 0
        ? currentOrderItem.price
        : selectedLaptop.price;

    const newItem = {
      laptop_id: currentOrderItem.laptop_id,
      quantity: parseInt(currentOrderItem.quantity),
      price: parseFloat(price),
      laptop_name: selectedLaptop.model_name,
    };

    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, newItem],
      total_amount: newOrder.total_amount + newItem.price * newItem.quantity,
    });

    setCurrentOrderItem({
      laptop_id: "",
      quantity: 1,
      price: 0,
    });
  };

  const removeOrderItem = (index) => {
    const itemToRemove = newOrder.items[index];
    const updatedItems = newOrder.items.filter((_, i) => i !== index);

    setNewOrder({
      ...newOrder,
      items: updatedItems,
      total_amount:
        newOrder.total_amount - itemToRemove.price * itemToRemove.quantity,
    });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!newOrder.user_id) {
      alert("Выберите пользователя");
      return;
    }

    if (newOrder.items.length === 0) {
      alert("Добавьте хотя бы один товар");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: newOrder.user_id,
          items: newOrder.items.map((item) => ({
            laptop_id: item.laptop_id,
            quantity: item.quantity,
            price: item.price,
          })),
          total_amount: newOrder.total_amount,
          status: newOrder.status,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrders([data.order, ...orders]);
        setShowAddOrderForm(false);
        setNewOrder({
          user_id: "",
          total_amount: 0,
          status: "PENDING",
          items: [],
        });
        alert("Заказ успешно создан");
      } else {
        alert(data.message || "Ошибка при создании заказа");
      }
    } catch (error) {
      console.error("Ошибка создания заказа:", error);
      alert("Ошибка соединения");
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, status: data.order.status } : o,
          ),
        );
        alert("Статус заказа обновлен");
      } else {
        alert("Ошибка при обновлении статуса");
      }
    } catch (error) {
      console.error("Ошибка обновления:", error);
      alert("Ошибка соединения");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот заказ?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setOrders(orders.filter((o) => o.id !== orderId));
        alert("Заказ удален");
      } else {
        alert(data.message || "Ошибка при удалении");
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка соединения");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.close();
  };

  return (
    <div className="adminPageContainer">
      <div className="adminHeader">
        <h1 className="adminTitle">Админ панель</h1>
        <div className="adminActionsTop">
          <button onClick={loadData} className="adminRefreshBtn">
            Обновить данные
          </button>
          <button onClick={handleLogout} className="adminLogoutBtn">
            Выйти
          </button>
        </div>
      </div>

      <div className="adminTabs">
        <button
          className={`adminTab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Пользователи ({users.length})
        </button>
        <button
          className={`adminTab ${activeTab === "laptops" ? "active" : ""}`}
          onClick={() => setActiveTab("laptops")}
        >
          Ноутбуки ({laptops.length})
        </button>
        <button
          className={`adminTab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Заказы ({orders.length})
        </button>
      </div>

      <div className="adminContent">
        {activeTab === "users" && (
          <div className="adminSection">
            <div className="adminSectionHeader">
              <h2 className="adminSectionTitle">Пользователи</h2>
              <button
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className="adminAddBtn"
              >
                {showAddUserForm ? "Отменить" : "Добавить пользователя"}
              </button>
            </div>

            {showAddUserForm && (
              <form onSubmit={handleAddUser} className="adminForm">
                <div className="formRow">
                  <input
                    type="text"
                    placeholder="Имя"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="adminInput"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="adminInput"
                    required
                  />
                </div>
                <div className="formRow">
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="adminInput"
                    required
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="adminSelect"
                  >
                    <option value="USER">Пользователь</option>
                    <option value="ADMIN">Администратор</option>
                  </select>
                </div>
                <button type="submit" className="adminSubmitBtn">
                  Создать
                </button>
              </form>
            )}

            <div className="adminTableContainer">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Дата</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      {editingUser === user.id ? (
                        <>
                          <td>{user.id}</td>
                          <td>
                            <input
                              type="text"
                              value={editUserData.name}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  name: e.target.value,
                                })
                              }
                              className="adminInputSmall"
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              value={editUserData.email}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  email: e.target.value,
                                })
                              }
                              className="adminInputSmall"
                            />
                          </td>
                          <td>
                            <select
                              value={editUserData.role}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  role: e.target.value,
                                })
                              }
                              className="adminSelectSmall"
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="adminActions">
                              <button
                                className="adminSaveBtn"
                                onClick={() => handleUpdateUser(user.id)}
                              >
                                Сохранить
                              </button>
                              <button
                                className="adminCancelBtn"
                                onClick={() => setEditingUser(null)}
                              >
                                Отмена
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span
                              className={`userRoleBadge ${user.role.toLowerCase()}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="adminActions">
                              <button
                                className="adminEditBtn"
                                onClick={() => startEditUser(user)}
                              >
                                Редактировать
                              </button>
                              <button
                                className="adminDeleteBtn"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Удалить
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "laptops" && (
          <div className="adminSection">
            <div className="adminSectionHeader">
              <h2 className="adminSectionTitle">Ноутбуки</h2>
              <button
                onClick={() => setShowAddLaptopForm(!showAddLaptopForm)}
                className="adminAddBtn"
              >
                {showAddLaptopForm ? "Отменить" : "Добавить ноутбук"}
              </button>
            </div>

            {showAddLaptopForm && (
              <form onSubmit={handleAddLaptop} className="adminForm">
                <div className="formRow">
                  <input
                    type="text"
                    placeholder="Название модели"
                    value={newLaptop.model_name}
                    onChange={(e) =>
                      setNewLaptop({ ...newLaptop, model_name: e.target.value })
                    }
                    className="adminInput"
                    required
                  />
                  <select
                    value={newLaptop.manufacturer_id}
                    onChange={(e) =>
                      setNewLaptop({
                        ...newLaptop,
                        manufacturer_id: e.target.value,
                      })
                    }
                    className="adminSelect"
                    required
                  >
                    <option value="">Выберите производителя</option>
                    {manufacturers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.country ? `(${m.country})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="formRow">
                  <input
                    type="number"
                    placeholder="Цена"
                    value={newLaptop.price}
                    onChange={(e) =>
                      setNewLaptop({ ...newLaptop, price: e.target.value })
                    }
                    className="adminInput"
                    min="0"
                    step="0.01"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Количество на складе"
                    value={newLaptop.stock_quantity}
                    onChange={(e) =>
                      setNewLaptop({
                        ...newLaptop,
                        stock_quantity: e.target.value,
                      })
                    }
                    className="adminInput"
                    min="0"
                    required
                  />
                </div>
                <textarea
                  placeholder="Описание"
                  value={newLaptop.description}
                  onChange={(e) =>
                    setNewLaptop({ ...newLaptop, description: e.target.value })
                  }
                  className="adminTextarea"
                  rows="3"
                />
                <div className="formRow">
                  <label className="adminCheckboxLabel">
                    <input
                      type="checkbox"
                      checked={newLaptop.is_available}
                      onChange={(e) =>
                        setNewLaptop({
                          ...newLaptop,
                          is_available: e.target.checked,
                        })
                      }
                      className="adminCheckbox"
                    />
                    Доступен для покупки
                  </label>
                </div>
                <button type="submit" className="adminSubmitBtn">
                  Создать
                </button>
              </form>
            )}

            <div className="adminTableContainer">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Модель</th>
                    <th>Производитель</th>
                    <th>Цена</th>
                    <th>Кол-во</th>
                    <th>Доступен</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {laptops.map((laptop) => (
                    <tr key={laptop.id}>
                      {editingLaptop === laptop.id ? (
                        <>
                          <td>{laptop.id}</td>
                          <td>
                            <input
                              type="text"
                              value={editLaptopData.model_name}
                              onChange={(e) =>
                                setEditLaptopData({
                                  ...editLaptopData,
                                  model_name: e.target.value,
                                })
                              }
                              className="adminInputSmall"
                            />
                          </td>
                          <td>
                            <select
                              value={editLaptopData.manufacturer_id}
                              onChange={(e) =>
                                setEditLaptopData({
                                  ...editLaptopData,
                                  manufacturer_id: e.target.value,
                                })
                              }
                              className="adminSelectSmall"
                            >
                              {manufacturers.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editLaptopData.price}
                              onChange={(e) =>
                                setEditLaptopData({
                                  ...editLaptopData,
                                  price: e.target.value,
                                })
                              }
                              className="adminInputSmall"
                              step="0.01"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editLaptopData.stock_quantity}
                              onChange={(e) =>
                                setEditLaptopData({
                                  ...editLaptopData,
                                  stock_quantity: e.target.value,
                                })
                              }
                              className="adminInputSmall"
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={editLaptopData.is_available}
                              onChange={(e) =>
                                setEditLaptopData({
                                  ...editLaptopData,
                                  is_available: e.target.checked,
                                })
                              }
                              className="adminCheckboxSmall"
                            />
                          </td>
                          <td>
                            <div className="adminActions">
                              <button
                                className="adminSaveBtn"
                                onClick={() => handleUpdateLaptop(laptop.id)}
                              >
                                Сохранить
                              </button>
                              <button
                                className="adminCancelBtn"
                                onClick={() => setEditingLaptop(null)}
                              >
                                Отмена
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{laptop.id}</td>
                          <td>{laptop.model_name}</td>
                          <td>{laptop.manufacturer?.name}</td>
                          <td>{laptop.price.toLocaleString()} ₽</td>
                          <td>{laptop.stock_quantity}</td>
                          <td>
                            {laptop.is_available ? (
                              <span className="statusAvailable">Да</span>
                            ) : (
                              <span className="statusUnavailable">Нет</span>
                            )}
                          </td>
                          <td>
                            <div className="adminActions">
                              <button
                                className="adminEditBtn"
                                onClick={() => startEditLaptop(laptop)}
                              >
                                Редактировать
                              </button>
                              <button
                                className="adminDeleteBtn"
                                onClick={() => handleDeleteLaptop(laptop.id)}
                              >
                                Удалить
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="adminSection">
            <div className="adminSectionHeader">
              <h2 className="adminSectionTitle">Заказы</h2>
              <button
                onClick={() => setShowAddOrderForm(!showAddOrderForm)}
                className="adminAddBtn"
              >
                {showAddOrderForm ? "Отменить" : "Добавить заказ"}
              </button>
            </div>

            {showAddOrderForm && (
              <form
                onSubmit={handleCreateOrder}
                className="adminForm orderForm"
              >
                <h3>Создание нового заказа</h3>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Пользователь:</label>
                    <select
                      value={newOrder.user_id}
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, user_id: e.target.value })
                      }
                      className="adminSelect"
                      required
                    >
                      <option value="">Выберите пользователя</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="formGroup">
                    <label>Статус:</label>
                    <select
                      value={newOrder.status}
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, status: e.target.value })
                      }
                      className="adminSelect"
                    >
                      <option value="PENDING">В ожидании</option>
                      <option value="CONFIRMED">Подтвержден</option>
                      <option value="SHIPPED">Отправлен</option>
                      <option value="DELIVERED">Доставлен</option>
                      <option value="CANCELLED">Отменен</option>
                    </select>
                  </div>
                </div>

                <div className="orderItemsSection">
                  <h4>Товары в заказе</h4>

                  <div className="addItemForm">
                    <div className="formRow">
                      <select
                        value={currentOrderItem.laptop_id}
                        onChange={(e) => {
                          const laptopId = e.target.value;
                          const selectedLaptop = laptops.find(
                            (l) => l.id === parseInt(laptopId),
                          );
                          setCurrentOrderItem({
                            ...currentOrderItem,
                            laptop_id: laptopId,
                            price: selectedLaptop ? selectedLaptop.price : 0,
                          });
                        }}
                        className="adminInput"
                      >
                        <option value="">Выберите товар</option>
                        {laptops.map((laptop) => (
                          <option key={laptop.id} value={laptop.id}>
                            {laptop.model_name} ({laptop.price} руб.)
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        placeholder="Количество"
                        value={currentOrderItem.quantity}
                        onChange={(e) =>
                          setCurrentOrderItem({
                            ...currentOrderItem,
                            quantity: e.target.value,
                          })
                        }
                        className="adminInput"
                        min="1"
                      />

                      <input
                        type="number"
                        placeholder="Цена"
                        value={currentOrderItem.price}
                        onChange={(e) =>
                          setCurrentOrderItem({
                            ...currentOrderItem,
                            price: e.target.value,
                          })
                        }
                        className="adminInput"
                        min="0"
                        step="0.01"
                      />

                      <button
                        type="button"
                        onClick={handleAddOrderItem}
                        className="adminAddItemBtn"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>

                  {newOrder.items.length > 0 ? (
                    <div className="orderItemsList">
                      <table className="adminTable small">
                        <thead>
                          <tr>
                            <th>Товар</th>
                            <th>Количество</th>
                            <th>Цена</th>
                            <th>Сумма</th>
                            <th>Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newOrder.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.laptop_name}</td>
                              <td>{item.quantity}</td>
                              <td>{item.price.toLocaleString()} руб.</td>
                              <td>
                                {(item.price * item.quantity).toLocaleString()}{" "}
                                руб.
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => removeOrderItem(index)}
                                  className="adminDeleteBtn small"
                                >
                                  Удалить
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="orderTotal">
                        <strong>
                          Общая сумма: {newOrder.total_amount.toLocaleString()}{" "}
                          руб.
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <p className="noItemsText">Нет добавленных товаров</p>
                  )}
                </div>

                <button type="submit" className="adminSubmitBtn">
                  Создать заказ
                </button>
              </form>
            )}

            <div className="adminTableContainer">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Пользователь</th>
                    <th>Дата</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>Товары</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <>
                      <tr key={order.id} className="orderRow">
                        <td>{order.id}</td>
                        <td>
                          <div>
                            <div>{order.user?.name || "Неизвестно"}</div>
                            <div className="userEmail">
                              {order.user?.email || ""}
                            </div>
                          </div>
                        </td>
                        <td>
                          {new Date(order.order_date).toLocaleDateString()}
                        </td>
                        <td>{order.total_amount.toLocaleString()} ₽</td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value)
                            }
                            className="adminSelect small"
                          >
                            <option value="PENDING">В ожидании</option>
                            <option value="CONFIRMED">Подтвержден</option>
                            <option value="SHIPPED">Отправлен</option>
                            <option value="DELIVERED">Доставлен</option>
                            <option value="CANCELLED">Отменен</option>
                          </select>
                        </td>
                        <td>
                          {order.orderItems?.length || 0} шт.
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="toggleDetailsBtn"
                          >
                            {expandedOrderId === order.id
                              ? "Скрыть"
                              : "Показать"}
                          </button>
                        </td>
                        <td>
                          <div className="adminActions">
                            <button
                              className="adminDeleteBtn"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedOrderId === order.id &&
                        order.orderItems &&
                        order.orderItems.length > 0 && (
                          <tr className="orderDetailsRow">
                            <td colSpan="7">
                              <div className="orderDetails">
                                <h4>Товары в заказе:</h4>
                                <table className="adminTable small">
                                  <thead>
                                    <tr>
                                      <th>Товар</th>
                                      <th>Количество</th>
                                      <th>Цена</th>
                                      <th>Сумма</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.orderItems.map((item, index) => (
                                      <tr key={index}>
                                        <td>
                                          {item.laptop?.model_name ||
                                            `Товар #${item.laptop_id}`}
                                        </td>
                                        <td>{item.item_quantity}</td>
                                        <td>
                                          {item.price.toLocaleString()} руб.
                                        </td>
                                        <td>
                                          {(
                                            item.price * item.item_quantity
                                          ).toLocaleString()}{" "}
                                          руб.
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
