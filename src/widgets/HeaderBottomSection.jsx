import "./styles/HeaderBottomSection.css";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import catalogSvg from "../assets/CatalogSvg.svg";

const HeaderBottomSection = () => {
  const [headerAuthModalActive, setHeaderAuthModalActive] = useState(false);
  const [authModalType, setAuthModalType] = useState("login"); // 'login' или 'register'
  const [formInputBtnActive, setFormInputBtnActive] = useState(true);
  const [registerFormInputBtnActive, setRegisterFormInputBtnActive] =
    useState(true);
  const [confirmPasswordBtnActive, setConfirmPasswordBtnActive] =
    useState(true);

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearchQuery(search);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    navigate(`/?${params.toString()}`);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (error) {
          console.error("Auth check error:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginFormData.email,
          password: loginFormData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
        setHeaderAuthModalActive(false);
        setLoginFormData({ email: "", password: "" });
      } else {
        alert(data.message || "Неверный email или пароль");
      }
    } catch (err) {
      alert("Ошибка подключения к серверу");
      console.error("Login error:", err);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerFormData.name,
          email: registerFormData.email,
          password: registerFormData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
        setHeaderAuthModalActive(false);
        setRegisterFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setAuthModalType("login");
      } else {
        alert(data.message || "Ошибка при регистрации");
      }
    } catch (err) {
      alert("Ошибка подключения к серверу");
      console.error("Register error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const openRegisterModal = () => {
    setAuthModalType("register");
  };

  const openLoginModal = () => {
    setAuthModalType("login");
  };

  return (
    <div className="headerBottomSectionContent">
      <div className="headerBottomLogoContainer">
        <a href="/" className="headerNavLogo">
          <svg className="headerNavLogoLink">
            <use xlinkHref="#svg-logo"></use>
          </svg>
        </a>
      </div>
      <div className="headerBottomCatalogButton" role="button">
        <img
          src={catalogSvg}
          alt="CatalogSvg"
          className="headerBottomCatalogImg"
        />
        <p className="headerBottomCatalogText">Каталог</p>
      </div>
      <form className="headerBottomSearchLine" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="headerBottomInput"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск ноутбуков..."
        />
        <button
          type="submit"
          className="headerBottomSearchLineBtn"
          aria-label="Поиск по сайту"
          tabIndex="0"
        >
          <svg className="searchLineSvg">
            <use xlinkHref="#svg-search"></use>
          </svg>
        </button>
      </form>
      <div className="headerBottomGeneralBtns">
        <a href="/catalog/favorites" className="headerBottomFavoriteBtn">
          <svg className="headerBottomSvgHeart">
            <use xlinkHref="#svg-heart-favorite"></use>
          </svg>
          <p className="headerBottomBtnsText">Избранное</p>
        </a>
        <a href="/checkout" className="headerBottomCheckOutBtn">
          <svg className="headerBottomSvgCheckOut">
            <use xlinkHref="#svg-chart-checkOut"></use>
          </svg>
          <p className="headerBottomBtnsText">Сравнение</p>
        </a>
        <a href="/basket" className="headerBottomBasketBtn">
          <svg className="headerBottomSvgBasket">
            <use xlinkHref="#svg-shopping-basket"></use>
          </svg>
          <p className="headerBottomBtnsText">Корзина</p>
        </a>
        {isCheckingAuth ? (
          <div className="headerBottomProfileBtn">
            <svg className="headerBottomSvgProfile">
              <use xlinkHref="#svg-profile"></use>
            </svg>
            <p className="headerBottomBtnsText">...</p>
          </div>
        ) : user ? (
          <div className="headerBottomProfileBtn logged-in">
            <svg className="headerBottomSvgProfile">
              <use xlinkHref="#svg-profile"></use>
            </svg>
            <p className="headerBottomBtnsText">{user.name}</p>
            <div className="user-dropdown">
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
              <button onClick={handleLogout} className="logout-btn">
                Выйти
              </button>
            </div>
          </div>
        ) : (
          <div
            className="headerBottomProfileBtn"
            onClick={() => {
              setHeaderAuthModalActive(true);
              setAuthModalType("login");
            }}
          >
            <svg className="headerBottomSvgProfile">
              <use xlinkHref="#svg-profile"></use>
            </svg>
            <p className="headerBottomBtnsText">Войти</p>
          </div>
        )}

        {user && user.role === "ADMIN" && (
          <a
            href="/admin"
            target="_blank"
            rel="noopener noferrer"
            className="headerBottomAdminBtn"
          >
            <p className="headerBottomBtnsText">Админ</p>
          </a>
        )}

        <div
          className={
            headerAuthModalActive
              ? "headerBottomLoginModal active"
              : "headerBottomLoginModal"
          }
          onClick={() => {
            setHeaderAuthModalActive(false);
            setAuthModalType("login");
          }}
        >
          <div
            className="loginModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="loginModalCloseBtn"
              onClick={() => {
                setHeaderAuthModalActive(false);
                setAuthModalType("login");
              }}
            ></div>

            {authModalType === "login" && (
              <form onSubmit={handleLoginSubmit}>
                <p className="loginModalFormHeaderText">Вход</p>
                <div className="loginModalFormInputLogin">
                  <label className="loginModalFormLabel">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    className="loginModalFormInput"
                    value={loginFormData.email}
                    onChange={(e) =>
                      setLoginFormData({
                        ...loginFormData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="loginModalFormInputPassword">
                  <label className="loginModalFormLabel">Password</label>
                  <input
                    type={formInputBtnActive ? "password" : "text"}
                    name="password"
                    className="loginModalFormInput"
                    value={loginFormData.password}
                    onChange={(e) =>
                      setLoginFormData({
                        ...loginFormData,
                        password: e.target.value,
                      })
                    }
                  />
                  <div
                    className={
                      formInputBtnActive
                        ? "formInputPasswordRevealBtn"
                        : "formInputPasswordRevealBtnActive"
                    }
                    onClick={() => setFormInputBtnActive(!formInputBtnActive)}
                  ></div>
                </div>
                <br />
                <button type="submit" className="loginModalFormBtn">
                  Войти
                </button>
                <div className="loginModalFormFooter">
                  <a
                    href="#"
                    className="loginModalFormFooterLink"
                    onClick={(e) => {
                      e.preventDefault();
                      openRegisterModal();
                    }}
                  >
                    Зарегистрироваться
                  </a>
                  <a
                    href="#"
                    className="loginModalFormFooterLink"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Восстановление пароля");
                    }}
                  >
                    Забыли пароль?
                  </a>
                </div>
              </form>
            )}

            {authModalType === "register" && (
              <form onSubmit={handleRegisterSubmit}>
                <p className="registerModalFormHeaderText">Регистрация</p>

                <div className="registerModalFormInputRegister">
                  <label className="registerModalFormLabel">Имя</label>
                  <input
                    type="text"
                    name="name"
                    className="registerModalFormInput"
                    value={registerFormData.name}
                    onChange={(e) =>
                      setRegisterFormData({
                        ...registerFormData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="registerModalFormInputRegister">
                  <label className="registerModalFormLabel">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    className="registerModalFormInput"
                    value={registerFormData.email}
                    onChange={(e) =>
                      setRegisterFormData({
                        ...registerFormData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="registerModalFormInputPassword">
                  <label className="registerModalFormLabel">Пароль</label>
                  <input
                    type={registerFormInputBtnActive ? "password" : "text"}
                    name="password"
                    className="registerModalFormInput"
                    value={registerFormData.password}
                    onChange={(e) =>
                      setRegisterFormData({
                        ...registerFormData,
                        password: e.target.value,
                      })
                    }
                  />
                  <div
                    className={
                      registerFormInputBtnActive
                        ? "formInputPasswordRevealBtn"
                        : "formInputPasswordRevealBtnActive"
                    }
                    onClick={() =>
                      setRegisterFormInputBtnActive(!registerFormInputBtnActive)
                    }
                  ></div>
                </div>

                <div className="registerModalFormInputPassword">
                  <label className="registerModalFormLabel">
                    Подтвердите пароль
                  </label>
                  <input
                    type={confirmPasswordBtnActive ? "password" : "text"}
                    name="confirmPassword"
                    className="registerModalFormInput"
                    value={registerFormData.confirmPassword}
                    onChange={(e) =>
                      setRegisterFormData({
                        ...registerFormData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <div
                    className={
                      confirmPasswordBtnActive
                        ? "formInputPasswordRevealBtn"
                        : "formInputPasswordRevealBtnActive"
                    }
                    onClick={() =>
                      setConfirmPasswordBtnActive(!confirmPasswordBtnActive)
                    }
                  ></div>
                </div>

                <br />
                <button type="submit" className="registerModalFormBtn">
                  Зарегистрироваться
                </button>
                <div className="registerModalFormFooter">
                  <a
                    href="#"
                    className="registerModalFormFooterLink"
                    onClick={(e) => {
                      e.preventDefault();
                      openLoginModal();
                    }}
                  >
                    Уже есть аккаунт? Войти
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottomSection;
