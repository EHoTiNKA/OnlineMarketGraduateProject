import "./styles/GeneralBody.css";
import CatalogLaptopItem from "../components/CatalogLaptopItem.jsx";
import { useState, useEffect, useMemo } from "react";

const GeneralBody = () => {
  const [laptops, setLaptops] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [priceFilterExpanded, setPriceFilterExpanded] = useState(true);

  const priceRanges = [
    { id: 1, label: "Менее 20 000 ₽", min: 0, max: 20000 },
    { id: 2, label: "20 001 - 30 000 ₽", min: 20001, max: 30000 },
    { id: 3, label: "30 001 - 45 000 ₽", min: 30001, max: 45000 },
    { id: 4, label: "45 001 - 70 000 ₽", min: 45001, max: 70000 },
    { id: 5, label: "70 001 - 100 000 ₽", min: 70001, max: 100000 },
    { id: 6, label: "100 001 ₽ и более", min: 100001, max: Infinity },
  ];

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

  const handlePriceRangeChange = (rangeId) => {
    setSelectedPriceRanges((prev) => {
      if (prev.includes(rangeId)) {
        return prev.filter((id) => id !== rangeId);
      } else {
        return [...prev, rangeId];
      }
    });
  };

  const filteredLaptops = useMemo(() => {
    if (selectedPriceRanges.length === 0) {
      return laptops;
    }

    return laptops.filter((laptop) => {
      return selectedPriceRanges.some((rangeId) => {
        const range = priceRanges.find((r) => r.id === rangeId);
        const price = laptop.price || 0;

        if (range.max === Infinity) {
          return price >= range.min;
        }
        return price >= range.min && price <= range.max;
      });
    });
  }, [laptops, selectedPriceRanges]);

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
      return filteredLaptops;
    }

    const sorted = [...filteredLaptops].sort((a, b) => {
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
  }, [filteredLaptops, sortConfig]);
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
        <p className="generalBodyHeadTextP">{sortedLaptops.length} товаров</p>
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
              <div
                className="catalogFilterTitle"
                onClick={() => setPriceFilterExpanded(!priceFilterExpanded)}
              >
                <p className="catalogFilterTitleText">Цена</p>
                <div
                  className={`catalogFilterTitleExpandBtn ${
                    priceFilterExpanded ? "expanded" : ""
                  }`}
                >
                  <svg>
                    <use xlinkHref="#svg-filtersCatalog-expandBtn"></use>
                  </svg>
                </div>
              </div>
              {priceFilterExpanded && (
                <div className="catalogFilterContent">
                  <div className="priceFilterOptions">
                    {priceRanges.map((range) => (
                      <div key={range.id} className="priceFilterOption">
                        <input
                          type="checkbox"
                          id={`price-range-${range.id}`}
                          checked={selectedPriceRanges.includes(range.id)}
                          onChange={() => handlePriceRangeChange(range.id)}
                          className="priceFilterCheckbox"
                        />
                        <label
                          htmlFor={`price-range-${range.id}`}
                          className="priceFilterLabel"
                        >
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
