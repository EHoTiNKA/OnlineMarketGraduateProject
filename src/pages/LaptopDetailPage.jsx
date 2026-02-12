import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/LaptopDetailPage.css";

const LaptopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const imageBaseUrl = "http://localhost:5000/uploads";

  useEffect(() => {
    fetchLaptopDetails();
  }, [id]);

  const fetchLaptopDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/laptops/${id}`);

      if (response.ok) {
        const data = await response.json();
        console.log("Laptop data:", data);
        setLaptop(data);
      } else {
        setError("Ноутбук не найден");
      }
    } catch (error) {
      console.error("Ошибка загрузки ноутбука:", error);
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/600x400?text=No+Image";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    return `${imageBaseUrl}/${imagePath}`;
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    if (!laptop.is_available) {
      alert("Этот товар временно недоступен");
      return;
    }

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
        imageUrl: getImageUrl(laptop.images?.[0]?.image_url),
        manufacturer: laptop.manufacturer?.name,
        quantity: quantity,
      });
    }

    localStorage.setItem("laptop_cart", JSON.stringify(cart));
    alert(`Товар "${laptop.model_name}" добавлен в корзину (${quantity} шт.)`);
  };

  const handleBuyNow = () => {
    if (!laptop.is_available) {
      alert("Этот товар временно недоступен");
      return;
    }

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
        imageUrl: getImageUrl(laptop.images?.[0]?.image_url),
        manufacturer: laptop.manufacturer?.name,
        quantity: quantity,
      });
    }

    localStorage.setItem("laptop_cart", JSON.stringify(cart));
    navigate("/basket");
  };

  if (loading) {
    return (
      <div className="laptopDetailLoading">
        <div className="laptopDetailLoadingSpinner"></div>
        <p className="laptopDetailLoadingText">Загрузка...</p>
      </div>
    );
  }

  if (error || !laptop) {
    return (
      <div className="laptopDetailError">
        <h2>Ошибка</h2>
        <p>{error || "Ноутбук не найден"}</p>
        <button onClick={handleBackClick} className="laptopDetailBackBtn">
          Вернуться назад
        </button>
      </div>
    );
  }

  const allImages = laptop.images || [];
  const mainImage = allImages[selectedImageIndex] || allImages[0];

  return (
    <div className="laptopDetailPageContainer">
      <button onClick={handleBackClick} className="laptopDetailBackBtn">
        ← Назад
      </button>

      <div className="laptopDetailContent">
        <div className="laptopDetailLeft">
          <div className="laptopDetailGallery">
            <div className="laptopDetailMainImage">
              <img
                src={getImageUrl(mainImage?.image_url)}
                alt={laptop.model_name}
                className="laptopDetailImage"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x400?text=No+Image";
                }}
              />
            </div>

            {allImages.length > 1 && (
              <div className="laptopDetailThumbnails">
                {allImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`laptopDetailThumbnail ${selectedImageIndex === index ? "active" : ""}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={getImageUrl(image.image_url)}
                      alt={`${laptop.model_name} - вид ${index + 1}`}
                      className="laptopDetailThumbnailImage"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80x80?text=No+Image";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="laptopDetailDescriptionSection">
            <h3 className="laptopDetailSectionTitle">Описание</h3>
            <p className="laptopDetailDescription">
              {laptop.description || "Нет описания"}
            </p>
          </div>
        </div>

        <div className="laptopDetailRight">
          <div className="laptopDetailHeader">
            <h1 className="laptopDetailTitle">{laptop.model_name}</h1>
            <div className="laptopDetailManufacturer">
              <span className="laptopDetailManufacturerLabel">
                Производитель:
              </span>
              <span className="laptopDetailManufacturerName">
                {laptop.manufacturer?.name || "Не указан"}
              </span>
              {laptop.manufacturer?.country && (
                <span className="laptopDetailManufacturerCountry">
                  ({laptop.manufacturer.country})
                </span>
              )}
            </div>
          </div>

          <div className="laptopDetailPriceSection">
            <div className="laptopDetailPrice">
              {laptop.price.toLocaleString()} ₽
            </div>
            <div className="laptopDetailAvailability">
              {laptop.is_available ? (
                <div className="laptopDetailInStock">
                  <span className="laptopDetailStockStatus available">
                    В наличии
                  </span>
                  <span className="laptopDetailStockCount">
                    {laptop.stock_quantity > 10
                      ? "Много"
                      : `Осталось ${laptop.stock_quantity} шт.`}
                  </span>
                </div>
              ) : (
                <span className="laptopDetailStockStatus unavailable">
                  Нет в наличии
                </span>
              )}
            </div>
          </div>

          {laptop.is_available && (
            <div className="laptopDetailPurchaseSection">
              <div className="laptopDetailQuantity">
                <label htmlFor="quantity" className="laptopDetailQuantityLabel">
                  Количество:
                </label>
                <div className="laptopDetailQuantityControls">
                  <button
                    className="laptopDetailQuantityBtn"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0 && value <= laptop.stock_quantity) {
                        setQuantity(value);
                      }
                    }}
                    min="1"
                    max={laptop.stock_quantity}
                    className="laptopDetailQuantityInput"
                  />
                  <button
                    className="laptopDetailQuantityBtn"
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(laptop.stock_quantity, prev + 1),
                      )
                    }
                    disabled={quantity >= laptop.stock_quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="laptopDetailButtons">
                <button
                  className="laptopDetailAddToCartBtn"
                  onClick={handleAddToCart}
                >
                  В корзину
                </button>
                <button
                  className="laptopDetailBuyNowBtn"
                  onClick={handleBuyNow}
                >
                  Купить сейчас
                </button>
              </div>
            </div>
          )}

          <div className="laptopDetailSpecsSection">
            <h3 className="laptopDetailSectionTitle">Характеристики</h3>

            <div className="laptopDetailSpecsGrid">
              {laptop.specs && (
                <>
                  {laptop.specs.processor && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">Процессор:</span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.processor.model_name} (
                        {laptop.specs.processor.cores} ядер,{" "}
                        {laptop.specs.processor.threads} потоков)
                      </span>
                    </div>
                  )}

                  {laptop.specs.graphic && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">Видеокарта:</span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.graphic.model_name} (
                        {laptop.specs.graphic.memory} GB)
                      </span>
                    </div>
                  )}

                  {laptop.specs.ram && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">
                        Оперативная память:
                      </span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.ram.size} GB {laptop.specs.ram.type} (
                        {laptop.specs.ram.frequency})
                      </span>
                    </div>
                  )}

                  {laptop.specs.storage && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">Накопитель:</span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.storage.capacity} GB{" "}
                        {laptop.specs.storage.type} (
                        {laptop.specs.storage.interface})
                      </span>
                    </div>
                  )}

                  {laptop.specs.screen && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">Экран:</span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.screen.diagonal}"{" "}
                        {laptop.specs.screen.resolution} (
                        {laptop.specs.screen.matrix_type},{" "}
                        {laptop.specs.screen.refresh_rate}Hz)
                      </span>
                    </div>
                  )}

                  {laptop.specs.weight && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">Вес:</span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.weight} кг
                      </span>
                    </div>
                  )}

                  {laptop.specs.battery_capacity && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">Батарея:</span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.battery_capacity} mAh
                      </span>
                    </div>
                  )}

                  {laptop.specs.os_name && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">
                        Операционная система:
                      </span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.os_name}
                      </span>
                    </div>
                  )}

                  {laptop.specs.color && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">Цвет:</span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.color}
                      </span>
                    </div>
                  )}

                  {laptop.specs.material && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">
                        Материал корпуса:
                      </span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.material}
                      </span>
                    </div>
                  )}

                  {laptop.specs.keyboard_light !== undefined && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">
                        Подсветка клавиатуры:
                      </span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.keyboard_light ? "Есть" : "Нет"}
                      </span>
                    </div>
                  )}

                  {laptop.specs.back_light_color && (
                    <div className="laptopDetailSpecItem">
                      <span className="laptopDetailSpecLabel">
                        Цвет подсветки:
                      </span>
                      <span className="laptopDetailSpecValue">
                        {laptop.specs.back_light_color}
                      </span>
                    </div>
                  )}
                </>
              )}

              {!laptop.specs && (
                <div className="laptopDetailNoSpecs">
                  Характеристики не указаны
                </div>
              )}
            </div>
          </div>

          {laptop.warehouse_stock && laptop.warehouse_stock.length > 0 && (
            <div className="laptopDetailWarehouseSection">
              <h3 className="laptopDetailSectionTitle">Наличие на складах</h3>
              <div className="laptopDetailWarehouseList">
                {laptop.warehouse_stock.map((stock) => (
                  <div key={stock.id} className="laptopDetailWarehouseItem">
                    <span className="laptopDetailWarehouseCity">
                      {stock.city}:
                    </span>
                    <span className="laptopDetailWarehouseQuantity">
                      {stock.quantity} шт.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaptopDetailPage;
