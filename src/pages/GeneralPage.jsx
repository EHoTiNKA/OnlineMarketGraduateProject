import "./styles/GeneralPage.css";

import GeneralHeader from "../widgets/GeneralHeader";
import SvgSprites from "../assets/SvgSprites.jsx";
import GeneralBody from "../widgets/GeneralBody.jsx";


const GeneralPage = () => {
  return (
    <div className="generalPageContent content-column">
      <SvgSprites />
      <GeneralHeader />
      <GeneralBody />
    </div>
  );
};

export default GeneralPage;
