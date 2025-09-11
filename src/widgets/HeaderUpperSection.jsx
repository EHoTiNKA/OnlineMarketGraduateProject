import "./styles/HeaderUpperSection.css";
import { useState } from "react";

import CityModal from '../components/HeaderCityModal';

const HeaderUpperSection = () => {
  const [modalActive, setModalActive] = useState(false);
  return (
    <>
      <div className="headerUpperSectionContent">
        <div className="choiceCityBtnContent" onClick={() => setModalActive(true)}>
          <svg className="choiceCityMark">
            <use xlinkHref="#city-mark"></use>
          </svg>
          <p>Москва</p>
        </div>
        <div className="hoursOfWorkContent">
          <svg className="hoursOfWorkContentSvg">
            <use xlinkHref="#clock"></use>
          </svg>
          <p>Режим работы: 9:00 — 21:00</p>
        </div>
        <div className="supportPhoneNumbContent">
          <svg className="supportPhoneNumbContentSvg">
            <use xlinkHref="#phone-filled"></use>
          </svg>
          <p className="supportPhoneNumber">+7 495 799-96-69</p>
        </div>
      </div>
      <CityModal isActive={modalActive} setActive={setModalActive}/>
    </>
  );
};

export default HeaderUpperSection;
