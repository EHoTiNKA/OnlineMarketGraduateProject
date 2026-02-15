import "./styles/HeaderCityModal.css";
import React from "react";

const HeaderCityModal = ({ isActive, setActive }) => {
  return (
    <div
      className={isActive ? "cityModal active" : "cityModal"}
      onClick={() => setActive(false)}
    >
      <div className="cityModalContent" onClick={(e) => e.stopPropagation()}>
        <div
          className="cityModalCloseBtn"
          onClick={() => setActive(false)}
        ></div>
        <p className="cityModalContentText">Выберите город</p>
        <div className="cityModalSearchLine">
          <input type="text" placeholder="Введите название города" autoComplete="off" className="cityModalInput" />
          <button
            type="submit"
            className="cityModalSearchLineBtn"
            tabIndex="0"
          >
            <svg className="cityModalsearchLineSvg">
              <use xlinkHref="#svg-search"></use>
            </svg>
          </button>
        </div>
        <div className="cityModalList">
            <div className="cityModalCity">Москва</div>
            <div className="cityModalCity">Санкт-Петербург</div>
            <div className="cityModalCity">Новосибирск</div>
            <div className="cityModalCity">Екатеринбург</div>
            <div className="cityModalCity">Казань</div>
            <div className="cityModalCity">Нижний Новгород</div>
            <div className="cityModalCity">Волгоград</div>
            <div className="cityModalCity">Воронеж</div>
            <div className="cityModalCity">Пермь</div>
            <div className="cityModalCity">Ростов-на-Дону</div>
            <div className="cityModalCity">Самара</div>
            <div className="cityModalCity">Уфа</div>
            <div className="cityModalCity">Челябинск</div>
            <div className="cityModalCity">Омск</div>
            <div className="cityModalCity">Красноярск</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCityModal;
