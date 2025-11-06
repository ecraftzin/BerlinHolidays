import { Helmet } from "react-helmet-async";

const HelmetChanger = ({ title }) => {
  return (
    <Helmet>
      <title>Berlin - {title}</title>
    </Helmet>
  );
};

export default HelmetChanger;
