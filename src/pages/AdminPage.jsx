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

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddLaptopForm, setShowAddLaptopForm] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.close();
  };

  if (loading) {
    return (
      <div className="adminLoading">
        <div className="adminLoadingSpinner"></div>
        <p className="adminLoadingText">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adminError">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={handleLogout} className="adminBackBtn">
          Вернуться на главную
        </button>
      </div>
    );
  }

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
            <h2 className="adminSectionTitle">Заказы</h2>
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
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        <div>
                          <div>{order.user?.name || "Неизвестно"}</div>
                          <div className="userEmail">
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
                          className="adminSelect"
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
