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
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
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
