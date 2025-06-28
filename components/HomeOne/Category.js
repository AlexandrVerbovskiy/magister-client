import Link from "next/link";
import { getFilePath } from "../../utils";

const Category = ({ bgColor = "", topCategories }) => {
  return (
    <>
      <section className={`category-area ptb-100 ${bgColor} position-relative`}>
        <div className="container">
          <div className="section-title">
            <h2>
              Browse by <span>Category</span>
            </h2>
          </div>

          <div
            className="row"
            style={{ height: "100%", justifyContent: "center" }}
          >
            {topCategories.map((info) => (
              <div
                className="col-lg-4 col-sm-12 col-md-6"
                key={info.id}
                style={{
                  display: "flex",
                  height: "auto",
                  flexDirection: "row",
                }}
              >
                <div className="single-category-box d-flex flex-column align-items-center">
                  <div className="icon overflow-hidden d-flex justify-content-center">
                    {info.image && <img src={getFilePath(info.image)} />}
                  </div>
                  <div className="row-dots-end">
                    <h3 className="row-dots-end">{info.name}</h3>
                    <span className="row-dots-end">
                      {info.countListings} Listings
                    </span>
                  </div>
                  <Link
                    href={`/listings/?categories=${encodeURIComponent(
                      info.name
                    )}`}
                    className="link-btn row-dots-end"
                  ></Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider"></div>
      </section>
    </>
  );
};

export default Category;
