import "./styles/HeaderBottomSection.css";
import { useState, useEffect } from "react";

import catalogSvg from "../assets/CatalogSvg.svg";

const HeaderBottomSection = () => {
  const [headerLoginModalActive, setHeaderLoginModalActive] = useState(false);
  const [formInputBtnActive, setFormInputBtnActive] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Заполните все поля");
      return;
    }

    if (!formData.email.includes("@")) {
      alert("Введите корректный email");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);

        setHeaderLoginModalActive(false);
        setFormData({ email: "", password: "" });
      } else {
        alert(data.message || "Неверный email или пароль");
      }
    } catch (err) {
      alert("Ошибка подключения к серверу");
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
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
      <div className="headerBottomSearchLine">
        <input type="text" className="headerBottomInput" />
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
      </div>
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
            onClick={() => setHeaderLoginModalActive(true)}
          >
            <svg className="headerBottomSvgProfile">
              <use xlinkHref="#svg-profile"></use>
            </svg>
            <p className="headerBottomBtnsText">Войти</p>
          </div>
        )}
        <div
          className={
            headerLoginModalActive
              ? "headerBottomLoginModal active"
              : "headerBottomLoginModal"
          }
          onClick={() => setHeaderLoginModalActive(false)}
        >
          <div
            className="loginModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="loginModalCloseBtn"
              onClick={() => setHeaderLoginModalActive(false)}
            ></div>
            <form onSubmit={handleSubmit}>
              <p className="loginModalFormHeaderText">Вход</p>
              <div className="loginModalFormInputLogin">
                <label className="loginModalFormLabel">E-mail</label>
                <input
                  type="email"
                  name="email"
                  className="loginModalFormInput"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="loginModalFormInputPassword">
                <label className="loginModalFormLabel">Password</label>
                <input
                  type={formInputBtnActive ? "password" : "text"}
                  name="password"
                  className="loginModalFormInput"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
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
                  href="/registration"
                  className="loginModalFormFooterLink"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Форма регистрации");
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottomSection;
