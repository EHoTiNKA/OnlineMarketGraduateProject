import "./styles/GeneralHeader.css";

import HeaderUpperSection from "./HeaderUpperSection";
import HeaderBottomSection from "./HeaderBottomSection";
import HeaderInfoLeftItem from "../components/HeaderInfoLeftItem";
import HeaderInfoMenuItem from "../components/HeaderInfoMenuItem";

const GeneralHeader = () => {
  return (
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
        <div className="headerMoreInfo">
          <svg className="headerMoreInfoSvg">
            <use xlinkHref="#svg-headerMenu-more"></use>
          </svg>
          <p className="headerMoreInfoText">Ещё</p>
        </div>
      </div>
    </div>
  );
};

export default GeneralHeader;
