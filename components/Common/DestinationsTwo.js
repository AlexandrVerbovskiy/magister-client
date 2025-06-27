import Link from "next/link";
import { useListingListClick } from "../../hooks";

const campaigns = [
  {
    id: 1,
    col: 3,
    title: "Evening",
    img: "/images/top-listings/top-1.png",
    backgroundColor: "#dbf5f6",
  },
  {
    id: 2,
    col: 3,
    title: "Character Costumes",
    img: "/images/top-listings/top-8.png",
    backgroundColor: "#ddf3da",
  },
  {
    id: 3,
    col: 3,
    title: "Business",
    img: "/images/top-listings/top-2.png",
    backgroundColor: "#f7f9cf",
  },
  {
    id: 4,
    col: 3,
    title: "Graduation",
    img: "/images/top-listings/top-7.png",
    backgroundColor: "#dedcf2",
  },
  {
    id: 5,
    col: 3,
    title: "Footwear",
    img: "/images/top-listings/top-3.png",
    backgroundColor: "#dedcf2",
  },
  {
    id: 6,
    col: 3,
    title: "Children's Festive",
    img: "/images/top-listings/top-6.png",
    backgroundColor: "#dbf5f6",
  },
  {
    id: 7,
    col: 3,
    title: "Accessories",
    img: "/images/top-listings/top-4.png",
    backgroundColor: "#ddf3da",
  },
  {
    id: 8,
    col: 3,
    title: "Carnival",
    img: "/images/top-listings/top-5.png",

    backgroundColor: "#f7f9cf",
  },
];

const DestinationItem = (campaign) => {
  const { handleClick } = useListingListClick({
    link: `/listings/?categories=${campaign.title}`,
  });

  return (
    <div
      key={campaign.id}
      className={`col-lg-${campaign.col} col-sm-12 col-md-12`}
      onClick={handleClick}
    >
      <div
        className="single-destinations-box"
        style={{ backgroundColor: campaign.backgroundColor }}
      >
        <img
          src={campaign.img}
          alt="image"
          height="283px"
          width="283px"
          style={{ height: "283px", width: "283px", objectFit: "scale-down" }}
        />
        <div className="country">{campaign.title}</div>
      </div>
    </div>
  );
};

const Destinations = ({ bgColor = "", bgImage = "" }) => {
  return (
    <>
      <section
        className={`destinations-area ${bgColor} ${bgImage} pt-100 pb-70`}
      >
        <div className="container">
          <div className="section-title">
            <h2>Trending Dresses</h2>
          </div>

          <div className="row">
            {campaigns.map((campaign) => (
              <DestinationItem key={campaign.id} {...campaign} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Destinations;
