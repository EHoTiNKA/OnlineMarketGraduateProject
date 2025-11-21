import "./styles/GeneralBody.css";
import CatalogLaptopItem from "../components/CatalogLaptopItem.jsx";
import { useState, useEffect } from "react";

const GeneralBody = () => {
  const [laptops, setLaptops] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/laptops");
        if (response.ok) {
          const data = await response.json();
          setLaptops(data);
          setTotalCount(data.length);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchLaptops();
  }, []);

  return (
    <div className="generalBodyContent">
      <div className="generalBodyHeadText">
        <h1 className="generalBodyHeadTextH1">Ноутбуки</h1>
        <p className="generalBodyHeadTextP">{totalCount} товаров</p>
      </div>
      <div className="generalBodySortBy">
        <p className="generalBodySortByP1">Сортировать по:</p>
        <p className="generalBodySortByCategories">популярности</p>
        <p className="generalBodySortByCategories">цене</p>
        <p className="generalBodySortByCategories">имени</p>
        <p className="generalBodySortByCategories">доступности</p>
      </div>
      <div className="generalBodyFiltersAndProducts">
        <div className="generalBodyFilters">
          <form action method="get" className="generalBodyCatalogFilterForm">
            <input
              type="text"
              placeholder="Поиск по фильтрам"
              className="catalogFilterSearch"
            />
            <div className="generalBodyCatalogFilter">
              <div className="catalogFilterTitle">
                <p className="catalogFilterTitleText">Каталог</p>
                <div className="catalogFilterTitleExpandBtn">
                  <svg>
                    <use xlinkHref="#svg-filtersCatalog-expandBtn"></use>
                  </svg>
                </div>
              </div>
              <div className="catalogFilterContent"></div>
            </div>
          </form>
        </div>
        <div className="generalBodyProducts">
          {laptops.map((laptop) => (
            <CatalogLaptopItem key={laptop.id} laptop={laptop} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralBody;
