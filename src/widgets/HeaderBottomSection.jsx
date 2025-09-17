import "./styles/HeaderBottomSection.css";
import { useState } from "react";

import catalogSvg from "../assets/CatalogSvg.svg";

const HeaderBottomSection = () => {
  const [headerLoginModalActive, setHeaderLoginModalActive] = useState(false);
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
          tabindex="0"
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
        <div
          className="headerBottomProfileBtn"
          onClick={() => setHeaderLoginModalActive(true)}
        >
          <svg className="headerBottomSvgProfile">
            <use xlinkHref="#svg-profile"></use>
          </svg>
          <p className="headerBottomBtnsText">Войти</p>
        </div>
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
            <form action="/return/" method="post">
              <p className="loginModalFormHeaderText">Вход</p>
              <div className="loginModalFormInputLogin">
                <label className="loginModalFormLabel">E-mail</label>
                <input
                  type="text"
                  name="login"
                  className="loginModalFormInput"
                />
              </div>
              <div className="loginModalFormInputPassword">
                <label className="loginModalFormLabel">Password</label>
                <input
                  type="text"
                  name="password"
                  className="loginModalFormInput"
                />
                <div className="formInputPasswordRevealBtn"></div>
              </div>
              <br />
              <button type="submit" className="loginModalFormBtn">
                Войти
              </button>
              <div className="loginModalFormFooter">
                <a href="/registration" className="loginModalFormFooterLink">
                  Зарегистрироваться
                </a>
                <a href="#" className="loginModalFormFooterLink">
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
