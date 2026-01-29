import "./styles/GeneralHeader.css";
import { useState } from "react";

import HeaderUpperSection from "./HeaderUpperSection";
import HeaderBottomSection from "./HeaderBottomSection";

const GeneralHeader = () => {
  const [moreInfoModalActive, setMoreInfoModalActive] = useState(false);
  return (
    <div className="generalHeaderContent">
      <HeaderUpperSection />
      <HeaderBottomSection />
      <div className="generalHeaderInfoLinks">
        <div className="headerInfoLeft">
          <a href={"/auctions/"} className="headerInfoLeftItemContent">
            <svg className="headerInfoLeftItemSvg">
              <use xlinkHref="#svg-headerMenu-promotion"></use>
            </svg>
            <p className="headerInfoLeftText">Акции</p>
          </a>
          <a href={"/sellout/"} className="headerInfoLeftItemContent">
            <svg className="headerInfoLeftItemSvg">
              <use xlinkHref="#svg-headerMenu-saleout"></use>
            </svg>
            <p className="headerInfoLeftText">Распродажа</p>
          </a>
        </div>
        <div className="headerMenuLinks">
          <a
            href="/about-us/"
            className="headerInfoMenuItemContent headerInfoMenuItemContent-about"
          >
            <svg className="headerInfoMenuItemSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerInfoMenuItemText">О нас</p>
          </a>
          <a
            href="/about-us/"
            className="headerInfoMenuItemContent headerInfoMenuItemContent-contacts"
          >
            <svg className="headerInfoMenuItemSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerInfoMenuItemText">Контакты</p>
          </a>
          <a
            href="/about-us/"
            className="headerInfoMenuItemContent headerInfoMenuItemContent-payment"
          >
            <svg className="headerInfoMenuItemSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerInfoMenuItemText">Оплата</p>
          </a>
          <a
            href="/about-us/"
            className="headerInfoMenuItemContent headerInfoMenuItemContent-guarantees"
          >
            <svg className="headerInfoMenuItemSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerInfoMenuItemText">Гарантия</p>
          </a>
          <a
            href="/about-us/"
            className="headerInfoMenuItemContent headerInfoMenuItemContent-delivery"
          >
            <svg className="headerInfoMenuItemSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerInfoMenuItemText">Доставка</p>
          </a>
          <a
            href="/about-us/"
            className="headerInfoMenuItemContent headerInfoMenuItemContent-services"
          >
            <svg className="headerInfoMenuItemSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerInfoMenuItemText">Услуги</p>
          </a>
          <a
            href="/about-us/"
            className="headerInfoMenuItemContent headerInfoMenuItemContent-korpClients"
          >
            <svg className="headerInfoMenuItemSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerInfoMenuItemText">Корпоративным клиентам</p>
          </a>
          <a
            href="/about-us/"
            className="headerInfoMenuItemContent headerInfoMenuItemContent-leasing"
          >
            <svg className="headerInfoMenuItemSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerInfoMenuItemText">Лизинг</p>
          </a>
        </div>
        <div
          className="headerMoreInfoBtn"
          onClick={() => setMoreInfoModalActive(!moreInfoModalActive)}
        >
          <svg className="headerMoreInfoSvg">
            <use xlinkHref="#svg-headerMenu-more"></use>
          </svg>
          <p className="headerMoreInfoText">Ещё</p>
        </div>
        <div
          className={
            moreInfoModalActive
              ? "headerMoreInfoModalContent active"
              : "headerMoreInfoModalContent"
          }
        >
          <a
            href="/about/"
            rel="nofollow"
            className="headerMoreInfoModalLink headerMoreInfoModalLink-about"
            aria-label="Перейти на страницу о нас"
          >
            <svg className="headerMoreInfoModalSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerMoreInfoModalLinkText">О нас</p>
          </a>
          <a
            href="/about/"
            rel="nofollow"
            className="headerMoreInfoModalLink headerMoreInfoModalLink-contacts"
            aria-label="Перейти на страницу о нас"
          >
            <svg className="headerMoreInfoModalSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerMoreInfoModalLinkText">Контакты</p>
          </a>
          <a
            href="/about/"
            rel="nofollow"
            className="headerMoreInfoModalLink headerMoreInfoModalLink-payment"
            aria-label="Перейти на страницу о нас"
          >
            <svg className="headerMoreInfoModalSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerMoreInfoModalLinkText">Оплата</p>
          </a>
          <a
            href="/about/"
            rel="nofollow"
            className="headerMoreInfoModalLink headerMoreInfoModalLink-guarantees"
            aria-label="Перейти на страницу о нас"
          >
            <svg className="headerMoreInfoModalSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerMoreInfoModalLinkText">Гарантия</p>
          </a>
          <a
            href="/about/"
            rel="nofollow"
            className="headerMoreInfoModalLink headerMoreInfoModalLink-delivery"
            aria-label="Перейти на страницу о нас"
          >
            <svg className="headerMoreInfoModalSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerMoreInfoModalLinkText">Доставка</p>
          </a>
          <a
            href="/about/"
            rel="nofollow"
            className="headerMoreInfoModalLink headerMoreInfoModalLink-services"
            aria-label="Перейти на страницу о нас"
          >
            <svg className="headerMoreInfoModalSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerMoreInfoModalLinkText">Услуги</p>
          </a>
          <a
            href="/about/"
            rel="nofollow"
            className="headerMoreInfoModalLink headerMoreInfoModalLink-korpClients"
            aria-label="Перейти на страницу о нас"
          >
            <svg className="headerMoreInfoModalSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerMoreInfoModalLinkText">
              Корпоративным клиентам
            </p>
          </a>
          <a
            href="/about/"
            rel="nofollow"
            className="headerMoreInfoModalLink headerMoreInfoModalLink-leasing"
            aria-label="Перейти на страницу о нас"
          >
            <svg className="headerMoreInfoModalSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerMoreInfoModalLinkText">Лизинг</p>
          </a>
          <a
            href="/about-us/"
            rel="nofollow"
            className="headerMoreInfoModalLink headerMoreInfoModalLink-consultingCenter"
            aria-label="Перейти на страницу о нас"
          >
            <svg className="headerMoreInfoModalSvg">
              <use xlinkHref="#svg-headerMenu-about"></use>
            </svg>
            <p className="headerMoreInfoModalLinkText">
              Консультационный центр
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default GeneralHeader;
