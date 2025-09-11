import "./styles/HeaderInfoLeftItem.css";

const HeaderInfoLeftItem = ({ svg, text, href }) => {
  return (
    <a href={href} className="headerInfoLeftItemContent">
      <svg className="headerInfoLeftItemSvg">
        <use xlinkHref={svg}></use>
      </svg>
      <p className="headerInfoLeftText">{text}</p>
    </a>
  );
};

export default HeaderInfoLeftItem;
