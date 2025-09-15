import "./styles/GeneralHeader.css";
import { useState } from "react";

import HeaderUpperSection from "./HeaderUpperSection";
import HeaderBottomSection from "./HeaderBottomSection";
import HeaderInfoLeftItem from "../components/HeaderInfoLeftItem";
import HeaderInfoMenuItem from "../components/HeaderInfoMenuItem";

const GeneralHeader = () => {
  const [moreInfoModalActive, setMoreInfoModalActive] = useState(false);
  return (
    <>
      <div className="generalHeaderContent">
        <HeaderUpperSection />
        <HeaderBottomSection />
        <div className="generalHeaderInfoLinks">
          <div className="headerInfoLeft">
            <HeaderInfoLeftItem
              svg={"#svg-headerMenu-promotion"}
              text={"Акции"}
              href={"/auctions/"}
            />
            <HeaderInfoLeftItem
              svg={"#svg-headerMenu-saleout"}
              text={"Распродажа"}
              href={"/sellout/"}
            />
          </div>
          <div className="headerMenuLinks">
            <HeaderInfoMenuItem
              svg={"#svg-headerMenu-about"}
              text={"О нас"}
              href={"/about-us/"}
            />
            <HeaderInfoMenuItem
              svg={"#svg-headerMenu-about"}
              text={"Контакты"}
              href={"/about-us/"}
            />
            <HeaderInfoMenuItem
              svg={"#svg-headerMenu-about"}
              text={"Оплата"}
              href={"/about-us/"}
            />
            <HeaderInfoMenuItem
              svg={"#svg-headerMenu-about"}
              text={"Гарантия"}
              href={"/about-us/"}
            />
            <HeaderInfoMenuItem
              svg={"#svg-headerMenu-about"}
              text={"Доставка"}
              href={"/about-us/"}
            />
            <HeaderInfoMenuItem
              svg={"#svg-headerMenu-about"}
              text={"Услуги"}
              href={"/about-us/"}
            />
            <HeaderInfoMenuItem
              svg={"#svg-headerMenu-about"}
              text={"Корпоративным клиентам"}
              href={"/about-us/"}
            />
            <HeaderInfoMenuItem
              svg={"#svg-headerMenu-about"}
              text={"Лизинг"}
              href={"/about-us/"}
            />
          </div>
          <div className="headerMoreInfoBtn" onClick={() => setMoreInfoModalActive(!moreInfoModalActive)}>
            <svg className="headerMoreInfoSvg">
              <use xlinkHref="#svg-headerMenu-more"></use>
            </svg>
            <p className="headerMoreInfoText">Ещё</p>
          </div>
          <div className={moreInfoModalActive ? "headerMoreInfoModalContent active" : "headerMoreInfoModalContent"}>
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
              className="headerMoreInfoModalLink"
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
              className="headerMoreInfoModalLink"
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
              className="headerMoreInfoModalLink"
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
              className="headerMoreInfoModalLink"
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
              className="headerMoreInfoModalLink"
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
              className="headerMoreInfoModalLink"
              aria-label="Перейти на страницу о нас"
            >
              <svg className="headerMoreInfoModalSvg">
                <use xlinkHref="#svg-headerMenu-about"></use>
              </svg>
              <p className="headerMoreInfoModalLinkText">Корпоративным клиентам</p>
            </a>
            <a
              href="/about/"
              rel="nofollow"
              className="headerMoreInfoModalLink"
              aria-label="Перейти на страницу о нас"
            >
              <svg className="headerMoreInfoModalSvg">
                <use xlinkHref="#svg-headerMenu-about"></use>
              </svg>
              <p className="headerMoreInfoModalLinkText">Лизинг</p>
            </a>
            <a
              href="/about/"
              rel="nofollow"
              className="headerMoreInfoModalLink"
              aria-label="Перейти на страницу о нас"
            >
              <svg className="headerMoreInfoModalSvg">
                <use xlinkHref="#svg-headerMenu-about"></use>
              </svg>
              <p className="headerMoreInfoModalLinkText">Консультационный центр</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralHeader;
