import Link from "next/link";

const campaigns = [
  {
    id:1,
    col: 3,
    title: "Cement mixers",
    img: "/images/campaigns/a-photo-cement-transparent-thumbnail.png",
  },
  {
    id:2,
    col: 3,
    title: "Ladders",
    img: "/images/campaigns/a-photo-ladders-transparent-thumbnail.png",
  },
  {
    id:3,
    col: 3,
    title: "Tools",
    img: "/images/campaigns/a-photo-tools-transparent-thumbnail.png",
  },
  {
    id:4,
    col: 3,
    title: "Tents",
    img: "/images/campaigns/a-photo-tent-transparent-thumbnail.png",
  },
  {
    id:5,
    col: 3,
    title: "Paddleboards",
    img: "/images/campaigns/a-photo-paddleboard-transparent-thumbnail.png",
  },
  {
    id:6,
    col: 3,
    title: "Trailers",
    img: "/images/campaigns/a-photo-trailer-transparent-thumbnail.png",
  },
  {
    id:7,
    col: 3,
    title: "Cameras",
    img: "/images/campaigns/a-photo-photo-transparent-thumbnail.png",
  },
  {
    id:8,
    col: 3,
    title: "DJ Equipment",
    img: "/images/campaigns/a-photo-dj-transparent-thumbnail.png",
  },
];

const Destinations = () => {
  return (
    <>
      <section className="destinations-area bg-main-color pt-100 pb-70">
        <div className="container">
          <div className="section-title">
            <h2>Campaigns</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
              ipsum suspendisse ultrices gravida. Risus commodo viverra.
            </p>
          </div>

          <div className="row">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className={`col-lg-${campaign.col} col-sm-12 col-md-12`}>
                <div className="single-destinations-box">
                  <img src={campaign.img} alt="image" />
                  <div className="country">{campaign.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Destinations;
