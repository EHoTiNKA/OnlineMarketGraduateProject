import "./styles/CatalogLaptopItem.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CatalogLaptopItem = ({ laptop }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const images =
    laptop.images?.map(
      (img) => `http://localhost:5000/uploads/${img.image_url}`,
    ) || [];

  const handleHover = (index) => {
    setCurrentSlide(index);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  const truncateDescription = (description, maxLength = 100) => {
    if (!description) return "Описание отсутствует";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const getShortSpecs = () => {
    if (!laptop.specs) return "Характеристики не указаны";
    const specs = laptop.specs;
    return `${specs.processor?.model_series || "Процессор"}/${
      specs.ram?.size || "?"
    }GB/${specs.storage?.capacity || "?"}GB SSD/${
      specs.screen?.diagonal || "?"
    }" ${specs.screen?.resolution || ""}`.trim();
  };

  // Простая функция для получения URL изображения
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `http://localhost:5000/uploads/${imagePath}`;
  };

  const handleAddToCart = () => {
    if (!laptop.is_available) {
      alert("Этот товар временно недоступен");
      return;
    }

    const quantity = 1;

    if (quantity > laptop.stock_quantity) {
      alert(`Доступно только ${laptop.stock_quantity} шт. на складе`);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("laptop_cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.id === laptop.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: laptop.id,
        model_name: laptop.model_name,
        price: laptop.price,
        imageUrl: laptop.images?.[0]?.image_url 
          ? `http://localhost:5000/uploads/${laptop.images[0].image_url}`
          : "",
        manufacturer: laptop.manufacturer?.name,
        quantity: quantity,
      });
    }

    localStorage.setItem("laptop_cart", JSON.stringify(cart));
    alert(`Товар "${laptop.model_name}" добавлен в корзину (${quantity} шт.)`);
  };

  const handleFastBuy = () => {
    if (!laptop.is_available) {
      alert("Этот товар временно недоступен");
      return;
    }

    const quantity = 1;

    if (quantity > laptop.stock_quantity) {
      alert(`Доступно только ${laptop.stock_quantity} шт. на складе`);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("laptop_cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.id === laptop.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: laptop.id,
        model_name: laptop.model_name,
        price: laptop.price,
        imageUrl: laptop.images?.[0]?.image_url 
          ? `http://localhost:5000/uploads/${laptop.images[0].image_url}`
          : "",
        manufacturer: laptop.manufacturer?.name,
        quantity: quantity,
      });
    }

    localStorage.setItem("laptop_cart", JSON.stringify(cart));
    navigate("/basket"); // Переход на страницу корзины
  };

  return (
    <div className="catalogItemContent">
      <div className="catalogItemImageWrapper">
        <a href={`/laptop/${laptop.id}`} className="catalogItemImage">
          <div className="catalogItemImageSladerWrapper">
            <div className="catalogItemImageSliderImagesBlock">
              <div
                className="catalogItemImageSliderImageWrapper"
                style={{
                  transform: `translate3d(-${currentSlide * 100}%, 0px, 0px)`,
                }}
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="catalogItemImageSliderImageItem catalogImageWrapper"
                  >
                    <img
                      src={image}
                      alt={`${laptop.model_name} - фото ${index + 1}`}
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
                  onMouseLeave={() => setCurrentSlide(0)}
                />
              ))}
            </div>
          </div>
        </a>
        <div className="catalogItemImageSliderDots">
          {images.map((_, index) => (
            <div
              key={index}
              className={`catalogItemImageSliderDot ${
                index === currentSlide ? "catalogItemImageSliderDotActive" : ""
              }`}
            />
          ))}
        </div>
      </div>
      <div className="catalogItemDescriptionInfo">
        <p className="catalogItemProductCode">Код товара: {laptop.id}</p>
        <a href={`/laptop/${laptop.id}`} className="catalogItemLaptopName">
          Ноутбук {laptop.manufacturer?.name} {laptop.model_name}
        </a>
        <p className="catalogItemLaptopDescription">
          {truncateDescription(laptop.description)}
        </p>
        <p className="catalogItemLaptopSpecs">{getShortSpecs()}</p>
        <p className="catalogItemLaptopAvailibleDate1">
          Самовывоз: {laptop.stock_quantity > 0 ? "Сегодня" : "Под заказ"}
        </p>
        <p className="catalogItemLaptopAvailibleDate2">
          Доставка: {laptop.stock_quantity > 0 ? "Завтра" : "2-3 дня"}
        </p>
        <div className="catalogItemLaptopBuyoutPrice">
          <p className="LaptopBuyoutPriceText">{formatPrice(laptop.price)}</p>
          <p className="LaptopBuyoutPriceCurrency">руб.</p>
        </div>
        <div className="catalogItemLaptopBtns">
          <button
            className="catalogItemLaptopAddBasketBtn"
            onClick={handleAddToCart}
          >
            В корзину
          </button>
          <button
            className="catalogItemLaptopFastBuyBtn"
            onClick={handleFastBuy}
          >
            Купить в один клик
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogLaptopItem;