import "./styles/GeneralPage.css";

import GeneralHeader from "../widgets/GeneralHeader";
import SvgSprites from "../assets/SvgSprites.jsx";
const GeneralPage = () => {
  return (
    <div className="generalPageContent content-column">
      <SvgSprites />
      <GeneralHeader />
    </div>
  );
};

export default GeneralPage;
