import "./styles/GeneralBody.css";
import CatalogLaptopItem from "../components/CatalogLaptopItem.jsx";
import { useState, useEffect, useMemo } from "react";

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

  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });

  const handleSort = (field) => {
    if (sortConfig.field === field) {
      if (sortConfig.direction === null) {
        setSortConfig({ field, direction: "asc" });
      } else if (sortConfig.direction === "asc") {
        setSortConfig({ field, direction: "desc" });
      } else {
        setSortConfig({ field: null, direction: null });
      }
    } else {
      setSortConfig({ field, direction: "asc" });
    }
  };
  const sortedLaptops = useMemo(() => {
    if (sortConfig.field === null || sortConfig.direction === null) {
      return laptops;
    }

    const sorted = [...laptops].sort((a, b) => {
      if (sortConfig.field === "price") {
        if (sortConfig.direction === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      }
      if (sortConfig.field === "name") {
        if (sortConfig.direction === "asc") {
          return a.model_name.localeCompare(b.model_name);
        } else {
          return b.model_name.localeCompare(a.model_name);
        }
      }

      return 0;
    });

    return sorted;
  }, [laptops, sortConfig]);
  const getSortIndicator = (field) => {
    if (sortConfig.field === field) {
      if (sortConfig.direction === "asc") return " ↑";
      if (sortConfig.direction === "desc") return " ↓";
    }
    return "";
  };
  const isFieldActive = (field) => {
    return sortConfig.field === field && sortConfig.direction !== null;
  };

  return (
    <div className="generalBodyContent">
      <div className="generalBodyHeadText">
        <h1 className="generalBodyHeadTextH1">Ноутбуки</h1>
        <p className="generalBodyHeadTextP">{totalCount} товаров</p>
      </div>
      <div className="generalBodySortBy">
        <p className="generalBodySortByP1">Сортировать по:</p>
        <p
          className={`generalBodySortByCategories ${
            isFieldActive("price") ? "active" : ""
          }`}
          onClick={() => handleSort("price")}
        >
          цене{getSortIndicator("price")}
        </p>
        <p
          className={`generalBodySortByCategories ${
            isFieldActive("name") ? "active" : ""
          }`}
          onClick={() => handleSort("name")}
        >
          имени{getSortIndicator("name")}
        </p>
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
          {sortedLaptops.map((laptop) => (
            <CatalogLaptopItem key={laptop.id} laptop={laptop} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralBody;
