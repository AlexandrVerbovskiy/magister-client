import Navbar from "../components/_App/Navbar";
import Banner from "../components/HomeOne/Banner";
import Footer from "../components/_App/Footer";
import MainErrorAlert from "../components/_App/MainErrorAlert";
import MainSuccessAlert from "../components/_App/MainSuccessAlert";

const Index = () => {
  return (
    <>
      <MainErrorAlert />
      <MainSuccessAlert />

      <Navbar />

      <Banner />

      <Footer />
    </>
  );
};

export default Index;
