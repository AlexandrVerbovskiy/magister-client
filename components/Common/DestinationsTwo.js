import Link from "next/link";
import { useListingListClick } from "../../hooks";

const campaigns = [
  {
    id: 1,
    col: 3,
    title: "Cement mixers",
    img: "/images/campaigns/a-photo-cement-transparent-thumbnail.png",
    backgroundColor: "#dbf5f6",
  },
  {
    id: 2,
    col: 3,
    title: "DJ Equipment",
    img: "/images/campaigns/a-photo-dj-transparent-thumbnail.png",
    backgroundColor: "#ddf3da",
  },
  {
    id: 3,
    col: 3,
    title: "Ladders",
    img: "/images/campaigns/a-photo-ladders-transparent-thumbnail.png",
    backgroundColor: "#f7f9cf",
  },
  {
    id: 4,
    col: 3,
    title: "Cameras",
    img: "/images/campaigns/a-photo-photo-transparent-thumbnail.png",
    backgroundColor: "#dedcf2",
  },
  {
    id: 5,
    col: 3,
    title: "Tools",
    img: "/images/campaigns/a-photo-tools-transparent-thumbnail.png",
    backgroundColor: "#dedcf2",
  },
  {
    id: 6,
    col: 3,
    title: "Paddleboards",
    img: "/images/campaigns/a-photo-paddleboard-transparent-thumbnail.png",
    backgroundColor: "#dbf5f6",
  },
  {
    id: 7,
    col: 3,
    title: "Tent",
    img: "/images/campaigns/a-photo-tent-transparent-thumbnail.png",
    backgroundColor: "#ddf3da",
  },
  {
    id: 8,
    col: 3,
    title: "Trailers",
    img: "/images/campaigns/a-photo-trailer-transparent-thumbnail.png",

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
        <img src={campaign.img} alt="image" />
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
            <h2>Trending Items</h2>
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
