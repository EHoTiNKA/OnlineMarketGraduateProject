import "./styles/GeneralBody.css";

const GeneralBody = () => {
  return (
    <div className="generalBodyContent">
      <div className="generalBodyHeadText">
        <h1 className="generalBodyHeadTextH1">Ноутбуки</h1>
        <p className="generalBodyHeadTextP">1976 товаров</p>
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
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
        </div>
      </div>
    </div>
  );
};

export default GeneralBody;
