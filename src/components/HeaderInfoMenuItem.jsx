import "./styles/HeaderInfoMenuItem.css";

const HeaderInfoMenuItem = ({ svg, text, href }) => {
  return (
    <a href={href} className="headerInfoMenuItemContent">
      <svg className="headerInfoMenuItemSvg">
        <use xlinkHref={svg}></use>
      </svg>
      <p className="headerInfoMenuItemText">{text}</p>
    </a>
  );
};

export default HeaderInfoMenuItem;
