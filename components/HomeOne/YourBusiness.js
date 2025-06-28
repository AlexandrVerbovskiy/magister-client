import { useListingListClick } from "../../hooks";

const YourBusiness = ({ bgColor = "" }) => {
  const { handleClick: handleStartEarningClick } = useListingListClick({
    link: "/dashboard/listings/add",
  });

  const items = [
    {
      id: 1,
      title: `List your stuff`,
      image: "/images/home/icons-sustainability.png",
    },
    {
      id: 2,
      title: `Buy from other buyers`,
      image: "/images/home/icons-how_it_works-2_contact.png",
    },
    {
      id: 3,
      title: `Get paid`,
      image: "/images/home/icons-value.png",
    },
  ];

  return (
    <>
      <section className={`features-area ptb-70 ${bgColor}`}>
        <div className="container">
          <div className="section-title">
            <h2>
              Your <span>Business</span>
            </h2>
          </div>

          <div className="row justify-content-center">
            {items.map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6 col-sm-6 d-flex">
                <div className="single-features-box">
                  <div className="icon small-icon-image">
                    <img src={item.image} />
                  </div>
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="row justify-content-center">
            <button
              type="button"
              className="base-main-button"
              onClick={handleStartEarningClick}
            >
              Start earning
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default YourBusiness;
