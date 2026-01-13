import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AdminPage.css";

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState("");

  const [users, setUsers] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Состояния для форм
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddLaptopForm, setShowAddLaptopForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingLaptop, setEditingLaptop] = useState(null);

  // Данные для новых записей
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

      setLoading(false);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setError("Ошибка загрузки данных");
      setLoading(false);
    }
  };

  // ========== USERS CRUD ==========

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

  const handleUpdateUser = async (userId, updates) => {
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
          body: JSON.stringify(updates),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, ...data.user } : user
          )
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
        }
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

  // ========== LAPTOPS CRUD ==========

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

  const handleUpdateLaptop = async (laptopId, updates) => {
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
          body: JSON.stringify(updates),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLaptops(
          laptops.map((laptop) =>
            laptop.id === laptopId ? { ...laptop, ...data.laptop } : laptop
          )
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
        }
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

  // ========== ORDERS CRUD ==========

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
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, status: data.order.status } : o
          )
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

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p className="admin-loading-text">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="admin-back-btn"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1 className="admin-title">Админ панель</h1>
        <div className="admin-actions-top">
          <button onClick={loadData} className="admin-refresh-btn">
            Обновить данные
          </button>
          <a href="/">
            <p className="admin-logout-btn">Выйти</p>
          </a>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Пользователи ({users.length})
        </button>
        <button
          className={`admin-tab ${activeTab === "laptops" ? "active" : ""}`}
          onClick={() => setActiveTab("laptops")}
        >
          Ноутбуки ({laptops.length})
        </button>
        <button
          className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Заказы ({orders.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "users" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Пользователи</h2>
              <button
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className="admin-add-btn"
              >
                {showAddUserForm ? "Отменить" : "Добавить пользователя"}
              </button>
            </div>

            {showAddUserForm && (
              <form onSubmit={handleAddUser} className="admin-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Имя"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="admin-input"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="admin-input"
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="admin-input"
                    required
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="admin-select"
                  >
                    <option value="USER">Пользователь</option>
                    <option value="ADMIN">Администратор</option>
                  </select>
                </div>
                <button type="submit" className="admin-submit-btn">
                  Создать
                </button>
              </form>
            )}

            <div className="admin-table-container">
              <table className="admin-table">
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
                              defaultValue={user.name}
                              ref={(input) => {
                                if (input) input.value = user.name;
                              }}
                              className="admin-input-small"
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              defaultValue={user.email}
                              ref={(input) => {
                                if (input) input.value = user.email;
                              }}
                              className="admin-input-small"
                            />
                          </td>
                          <td>
                            <select
                              defaultValue={user.role}
                              ref={(select) => {
                                if (select) select.value = user.role;
                              }}
                              className="admin-select-small"
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button
                                className="admin-save-btn"
                                onClick={() => {
                                  const name =
                                    document.querySelector(
                                      `input[defaultValue="${user.name}"]`
                                    )?.value || user.name;
                                  const email =
                                    document.querySelector(
                                      `input[defaultValue="${user.email}"]`
                                    )?.value || user.email;
                                  const role =
                                    document.querySelector(
                                      `select[defaultValue="${user.role}"]`
                                    )?.value || user.role;
                                  handleUpdateUser(user.id, {
                                    name,
                                    email,
                                    role,
                                  });
                                }}
                              >
                                Сохранить
                              </button>
                              <button
                                className="admin-cancel-btn"
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
                              className={`user-role-badge ${user.role.toLowerCase()}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button
                                className="admin-edit-btn"
                                onClick={() => setEditingUser(user.id)}
                              >
                                Редактировать
                              </button>
                              <button
                                className="admin-delete-btn"
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
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Ноутбуки</h2>
              <button
                onClick={() => setShowAddLaptopForm(!showAddLaptopForm)}
                className="admin-add-btn"
              >
                {showAddLaptopForm ? "Отменить" : "Добавить ноутбук"}
              </button>
            </div>

            {showAddLaptopForm && (
              <form onSubmit={handleAddLaptop} className="admin-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Название модели"
                    value={newLaptop.model_name}
                    onChange={(e) =>
                      setNewLaptop({ ...newLaptop, model_name: e.target.value })
                    }
                    className="admin-input"
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
                    className="admin-select"
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
                <div className="form-row">
                  <input
                    type="number"
                    placeholder="Цена"
                    value={newLaptop.price}
                    onChange={(e) =>
                      setNewLaptop({ ...newLaptop, price: e.target.value })
                    }
                    className="admin-input"
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
                    className="admin-input"
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
                  className="admin-textarea"
                  rows="3"
                />
                <div className="form-row">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={newLaptop.is_available}
                      onChange={(e) =>
                        setNewLaptop({
                          ...newLaptop,
                          is_available: e.target.checked,
                        })
                      }
                      className="admin-checkbox"
                    />
                    Доступен для покупки
                  </label>
                </div>
                <button type="submit" className="admin-submit-btn">
                  Создать
                </button>
              </form>
            )}

            <div className="admin-table-container">
              <table className="admin-table">
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
                              defaultValue={laptop.model_name}
                              className="admin-input-small"
                              ref={(input) => {
                                if (input) input.value = laptop.model_name;
                              }}
                            />
                          </td>
                          <td>
                            <select
                              defaultValue={laptop.manufacturer_id}
                              className="admin-select-small"
                              ref={(select) => {
                                if (select)
                                  select.value = laptop.manufacturer_id;
                              }}
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
                              defaultValue={laptop.price}
                              className="admin-input-small"
                              ref={(input) => {
                                if (input) input.value = laptop.price;
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue={laptop.stock_quantity}
                              className="admin-input-small"
                              ref={(input) => {
                                if (input) input.value = laptop.stock_quantity;
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              defaultChecked={laptop.is_available}
                              ref={(input) => {
                                if (input) input.checked = laptop.is_available;
                              }}
                              className="admin-checkbox-small"
                            />
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button
                                className="admin-save-btn"
                                onClick={() => {
                                  const model_name =
                                    document.querySelector(
                                      `input[defaultValue="${laptop.model_name}"]`
                                    )?.value || laptop.model_name;
                                  const manufacturer_id =
                                    document.querySelector(
                                      `select[defaultValue="${laptop.manufacturer_id}"]`
                                    )?.value || laptop.manufacturer_id;
                                  const price =
                                    document.querySelector(
                                      `input[defaultValue="${laptop.price}"]`
                                    )?.value || laptop.price;
                                  const stock_quantity =
                                    document.querySelector(
                                      `input[defaultValue="${laptop.stock_quantity}"]`
                                    )?.value || laptop.stock_quantity;
                                  const is_available =
                                    document.querySelector(
                                      `input[defaultChecked]`
                                    )?.checked || laptop.is_available;

                                  handleUpdateLaptop(laptop.id, {
                                    model_name,
                                    manufacturer_id: parseInt(manufacturer_id),
                                    price: parseFloat(price),
                                    stock_quantity: parseInt(stock_quantity),
                                    is_available,
                                  });
                                }}
                              >
                                Сохранить
                              </button>
                              <button
                                className="admin-cancel-btn"
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
                              <span className="status-available">Да</span>
                            ) : (
                              <span className="status-unavailable">Нет</span>
                            )}
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button
                                className="admin-edit-btn"
                                onClick={() => setEditingLaptop(laptop.id)}
                              >
                                Редактировать
                              </button>
                              <button
                                className="admin-delete-btn"
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
          <div className="admin-section">
            <h2 className="admin-section-title">Заказы</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Пользователь</th>
                    <th>Дата</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>Товары</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        <div>
                          <div>{order.user?.name || "Неизвестно"}</div>
                          <div className="user-email">
                            {order.user?.email || ""}
                          </div>
                        </div>
                      </td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>{order.total_amount.toLocaleString()} ₽</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value)
                          }
                          className="admin-select"
                        >
                          <option value="PENDING">В ожидании</option>
                          <option value="CONFIRMED">Подтвержден</option>
                          <option value="SHIPPED">Отправлен</option>
                          <option value="DELIVERED">Доставлен</option>
                          <option value="CANCELLED">Отменен</option>
                        </select>
                      </td>
                      <td>{order.orderItems?.length || 0} шт.</td>
                    </tr>
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
