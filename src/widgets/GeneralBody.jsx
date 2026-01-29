import "./styles/GeneralBody.css";
import CatalogLaptopItem from "../components/CatalogLaptopItem.jsx";
import { useState, useEffect, useMemo } from "react";

const GeneralBody = () => {
  const [laptops, setLaptops] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [selectedProcessors, setSelectedProcessors] = useState([]);
  const [selectedGraphics, setSelectedGraphics] = useState([]);
  const [selectedRAMs, setSelectedRAMs] = useState([]);

  const [priceFilterExpanded, setPriceFilterExpanded] = useState(true);
  const [manufacturerFilterExpanded, setManufacturerFilterExpanded] =
    useState(true);
  const [processorFilterExpanded, setProcessorFilterExpanded] = useState(true);
  const [graphicsFilterExpanded, setGraphicsFilterExpanded] = useState(true);
  const [ramFilterExpanded, setRamFilterExpanded] = useState(true);

  const priceRanges = [
    { id: 1, label: "Менее 20 000 ₽", min: 0, max: 20000 },
    { id: 2, label: "20 001 - 30 000 ₽", min: 20001, max: 30000 },
    { id: 3, label: "30 001 - 45 000 ₽", min: 30001, max: 45000 },
    { id: 4, label: "45 001 - 70 000 ₽", min: 45001, max: 70000 },
    { id: 5, label: "70 001 - 100 000 ₽", min: 70001, max: 100000 },
    { id: 6, label: "100 001 ₽ и более", min: 100001, max: Infinity },
  ];

  const uniqueManufacturers = useMemo(() => {
    const manufacturers = laptops
      .map((laptop) => laptop.manufacturer?.name)
      .filter((name) => name);
    return [...new Set(manufacturers)].sort();
  }, [laptops]);

  const uniqueProcessors = useMemo(() => {
    const processors = laptops
      .map((laptop) => laptop.specs?.processor?.model_name)
      .filter((name) => name);
    return [...new Set(processors)].sort();
  }, [laptops]);

  const uniqueGraphics = useMemo(() => {
    const graphics = laptops
      .map((laptop) => laptop.specs?.graphic?.model_name)
      .filter((name) => name);
    return [...new Set(graphics)].sort();
  }, [laptops]);

  const uniqueRAMs = useMemo(() => {
    const rams = laptops
      .map((laptop) =>
        `${laptop.specs?.ram?.size} GB ${laptop.specs?.ram?.type || ""}`.trim()
      )
      .filter((name) => name);
    return [...new Set(rams)].sort((a, b) => {
      const sizeA = parseInt(a);
      const sizeB = parseInt(b);
      return sizeA - sizeB;
    });
  }, [laptops]);

  const handlePriceRangeChange = (rangeId) => {
    setSelectedPriceRanges((prev) => {
      if (prev.includes(rangeId)) {
        return prev.filter((id) => id !== rangeId);
      } else {
        return [...prev, rangeId];
      }
    });
  };

  const handleManufacturerChange = (manufacturerName) => {
    setSelectedManufacturers((prev) => {
      if (prev.includes(manufacturerName)) {
        return prev.filter((name) => name !== manufacturerName);
      } else {
        return [...prev, manufacturerName];
      }
    });
  };

  const handleProcessorChange = (processorName) => {
    setSelectedProcessors((prev) => {
      if (prev.includes(processorName)) {
        return prev.filter((name) => name !== processorName);
      } else {
        return [...prev, processorName];
      }
    });
  };

  const handleGraphicsChange = (graphicsName) => {
    setSelectedGraphics((prev) => {
      if (prev.includes(graphicsName)) {
        return prev.filter((name) => name !== graphicsName);
      } else {
        return [...prev, graphicsName];
      }
    });
  };

  const handleRAMChange = (ramName) => {
    setSelectedRAMs((prev) => {
      if (prev.includes(ramName)) {
        return prev.filter((name) => name !== ramName);
      } else {
        return [...prev, ramName];
      }
    });
  };

  const filteredLaptops = useMemo(() => {
    if (
      selectedPriceRanges.length === 0 &&
      selectedManufacturers.length === 0 &&
      selectedProcessors.length === 0 &&
      selectedGraphics.length === 0 &&
      selectedRAMs.length === 0
    ) {
      return laptops;
    }

    return laptops.filter((laptop) => {
      const priceFilterPassed =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((rangeId) => {
          const range = priceRanges.find((r) => r.id === rangeId);
          const price = laptop.price || 0;

          if (range.max === Infinity) {
            return price >= range.min;
          }
          return price >= range.min && price <= range.max;
        });

      const manufacturerFilterPassed =
        selectedManufacturers.length === 0 ||
        selectedManufacturers.includes(laptop.manufacturer?.name);

      const processorFilterPassed =
        selectedProcessors.length === 0 ||
        selectedProcessors.includes(laptop.specs?.processor?.model_name);

      const graphicsFilterPassed =
        selectedGraphics.length === 0 ||
        selectedGraphics.includes(laptop.specs?.graphic?.model_name);

      const ramDisplayName = `${laptop.specs?.ram?.size} GB ${
        laptop.specs?.ram?.type || ""
      }`.trim();
      const ramFilterPassed =
        selectedRAMs.length === 0 || selectedRAMs.includes(ramDisplayName);

      return (
        priceFilterPassed &&
        manufacturerFilterPassed &&
        processorFilterPassed &&
        graphicsFilterPassed &&
        ramFilterPassed
      );
    });
  }, [
    laptops,
    selectedPriceRanges,
    selectedManufacturers,
    selectedProcessors,
    selectedGraphics,
    selectedRAMs,
  ]);

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

            <div className="generalBodyCatalogFilter">
              <div
                className="catalogFilterTitle"
                onClick={() =>
                  setManufacturerFilterExpanded(!manufacturerFilterExpanded)
                }
              >
                <p className="catalogFilterTitleText">Производитель</p>
                <div
                  className={`catalogFilterTitleExpandBtn ${
                    manufacturerFilterExpanded ? "expanded" : ""
                  }`}
                >
                  <svg>
                    <use xlinkHref="#svg-filtersCatalog-expandBtn"></use>
                  </svg>
                </div>
              </div>
              {manufacturerFilterExpanded && (
                <div className="catalogFilterContent">
                  <div className="manufacturerFilterOptions">
                    {uniqueManufacturers.map((manufacturer) => (
                      <div
                        key={manufacturer}
                        className="manufacturerFilterOption"
                      >
                        <input
                          type="checkbox"
                          id={`manufacturer-${manufacturer}`}
                          checked={selectedManufacturers.includes(manufacturer)}
                          onChange={() =>
                            handleManufacturerChange(manufacturer)
                          }
                          className="manufacturerFilterCheckbox"
                        />
                        <label
                          htmlFor={`manufacturer-${manufacturer}`}
                          className="manufacturerFilterLabel"
                        >
                          {manufacturer}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="generalBodyCatalogFilter">
              <div
                className="catalogFilterTitle"
                onClick={() =>
                  setProcessorFilterExpanded(!processorFilterExpanded)
                }
              >
                <p className="catalogFilterTitleText">Процессор</p>
                <div
                  className={`catalogFilterTitleExpandBtn ${
                    processorFilterExpanded ? "expanded" : ""
                  }`}
                >
                  <svg>
                    <use xlinkHref="#svg-filtersCatalog-expandBtn"></use>
                  </svg>
                </div>
              </div>
              {processorFilterExpanded && (
                <div className="catalogFilterContent">
                  <div className="processorFilterOptions">
                    {uniqueProcessors.map((processor) => (
                      <div key={processor} className="processorFilterOption">
                        <input
                          type="checkbox"
                          id={`processor-${processor}`}
                          checked={selectedProcessors.includes(processor)}
                          onChange={() => handleProcessorChange(processor)}
                          className="processorFilterCheckbox"
                        />
                        <label
                          htmlFor={`processor-${processor}`}
                          className="processorFilterLabel"
                        >
                          {processor}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="generalBodyCatalogFilter">
              <div
                className="catalogFilterTitle"
                onClick={() =>
                  setGraphicsFilterExpanded(!graphicsFilterExpanded)
                }
              >
                <p className="catalogFilterTitleText">Видеокарта</p>
                <div
                  className={`catalogFilterTitleExpandBtn ${
                    graphicsFilterExpanded ? "expanded" : ""
                  }`}
                >
                  <svg>
                    <use xlinkHref="#svg-filtersCatalog-expandBtn"></use>
                  </svg>
                </div>
              </div>
              {graphicsFilterExpanded && (
                <div className="catalogFilterContent">
                  <div className="graphicsFilterOptions">
                    {uniqueGraphics.map((graphics) => (
                      <div key={graphics} className="graphicsFilterOption">
                        <input
                          type="checkbox"
                          id={`graphics-${graphics}`}
                          checked={selectedGraphics.includes(graphics)}
                          onChange={() => handleGraphicsChange(graphics)}
                          className="graphicsFilterCheckbox"
                        />
                        <label
                          htmlFor={`graphics-${graphics}`}
                          className="graphicsFilterLabel"
                        >
                          {graphics}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="generalBodyCatalogFilter">
              <div
                className="catalogFilterTitle"
                onClick={() => setRamFilterExpanded(!ramFilterExpanded)}
              >
                <p className="catalogFilterTitleText">Оперативная память</p>
                <div
                  className={`catalogFilterTitleExpandBtn ${
                    ramFilterExpanded ? "expanded" : ""
                  }`}
                >
                  <svg>
                    <use xlinkHref="#svg-filtersCatalog-expandBtn"></use>
                  </svg>
                </div>
              </div>
              {ramFilterExpanded && (
                <div className="catalogFilterContent">
                  <div className="ramFilterOptions">
                    {uniqueRAMs.map((ram) => (
                      <div key={ram} className="ramFilterOption">
                        <input
                          type="checkbox"
                          id={`ram-${ram}`}
                          checked={selectedRAMs.includes(ram)}
                          onChange={() => handleRAMChange(ram)}
                          className="ramFilterCheckbox"
                        />
                        <label
                          htmlFor={`ram-${ram}`}
                          className="ramFilterLabel"
                        >
                          {ram}
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
