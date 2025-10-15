import "./styles/CatalogLaptopItem.css";
import { useState } from 'react';

import test1 from '../assets/test1.webp'
import test2 from '../assets/test2.webp'
import test3 from '../assets/test3.webp'
import test4 from '../assets/test4.webp'
import test5 from '../assets/test5.webp'

const CatalogLaptopItem = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [test1, test2, test3, test4, test5];

  const handleHover = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="catalogItemContent">
      <div className="catalogItemImageWrapper">
        <a href="adad" className="catalogItemImage">
          <div className="catalogItemImageSladerWrapper">
            <div className="catalogItemImageSliderImagesBlock">
              <div 
                className="catalogItemImageSliderImageWrapper"
                style={{ transform: `translate3d(-${currentSlide * 100}%, 0px, 0px)` }}
              >
                {images.map((image, index) => (
                  <div key={index} className="catalogItemImageSliderImageItem catalogImageWrapper">
                    <img
                      src={image}
                      alt={`Ноутбук ${index + 1}`}
                      className="catalogItemProductImage"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="catalogItemImageSliderHoverZones">
              {images.map((_, index) => (
                <div 
                  key={index}
                  className="catalogItemImageSliderHover"
                  onMouseEnter={() => handleHover(index)}
                  onMouseLeave={() => handleHover(0)}
                />
              ))}
            </div>
          </div>
        </a>
        <div className="catalogItemImageSliderDots">
          {images.map((_, index) => (
            <div 
              key={index}
              className={`catalogItemImageSliderDot ${index === currentSlide ? 'catalogItemImageSliderDotActive' : ''}`}
            />
          ))}
        </div>
      </div>
      <div className="catalogItemDescriptionInfo">
        <p className="catalogItemProductCode">Код товара: 11079526</p>
        <a href="laptop" className="catalogItemLaptopName">
          Ноутбук Digma Digma EVE P4851
        </a>
        <p className="catalogItemLaptopDescription">
          N200/­8GB/­256GB SSD/­UHD Graphics/­14" IPS
          FHD/­WiFi/­BT/­cam/­Win11Pro/­silver
        </p>
        <p className="catalogItemLaptopAvailibleDate1">Самовывоз: Сегодня</p>
        <p className="catalogItemLaptopAvailibleDate2">Доставка: Завтра</p>
        <div className="catalogItemLaptopBuyoutPrice">
          <p className="LaptopBuyoutPriceText">24900</p>
          <p className="LaptopBuyoutPriceCurrency">руб.</p>
        </div>
        <div className="catalogItemLaptopBtns">
          <button className="catalogItemLaptopAddBasketBtn">В корзину</button>
          <button className="catalogItemLaptopFastBuyBtn">
            Купить в один клик
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogLaptopItem;