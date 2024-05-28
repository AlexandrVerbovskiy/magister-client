import Link from "next/link";
import { getFilePath } from "../../utils";

const Category = ({ topCategories, needShowMore }) => {
  return (
    <>
      <section className="category-area pt-100 pb-70">
        <div className="container">
          <div className="section-title">
            <h2>
              Browse Businesses by <span>Category</span>
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
              ipsum suspendisse ultrices gravida. Risus commodo viverra.
            </p>
          </div>

          <div className="row" style={{ height: "100%" }}>
            {topCategories.map((info) => (
              <div
                className="col-lg-2 col-sm-6 col-md-4"
                key={info.id}
                style={{
                  display: "flex",
                  height: "auto",
                  flexDirection: "row",
                }}
              >
                <div
                  className="single-category-box d-flex flex-column align-items-center"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <div className="icon overflow-hidden d-flex justify-content-center">
                    {info.image && <img src={getFilePath(info.image)} />}
                  </div>
                  <div>
                    <h3>{info.name}</h3>
                    <span>{info.countListings} Listings</span>
                  </div>
                  <Link
                    href={`/listing-list/?categories=${info.name}`}
                    className="link-btn"
                  ></Link>
                </div>
              </div>
            ))}

            {needShowMore && (
              <div className="col-lg-2 col-sm-6 col-md-4">
                <div className="single-category-box more-categories">
                  <div className="icon">
                    <i className="flaticon-more-1"></i>
                  </div>
                  <h3>More Categories</h3>
                  <Link href="/listing-list" className="link-btn"></Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Category;
