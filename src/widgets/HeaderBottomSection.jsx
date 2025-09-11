import "./styles/HeaderBottomSection.css";

import catalogSvg from "../assets/CatalogSvg.svg";

const HeaderBottomSection = () => {
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
        <a href="/profile" className="headerBottomProfileBtn">
          <svg className="headerBottomSvgProfile">
            <use xlinkHref="#svg-profile"></use>
          </svg>
          <p className="headerBottomBtnsText">Войти</p>
        </a>
      </div>
    </div>
  );
};

export default HeaderBottomSection;
