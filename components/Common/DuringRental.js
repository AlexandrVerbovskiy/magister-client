const DuringRental = () => {
  return (
    <section className="category-area pt-100 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-12 pb-100 pb-lg-0">
            <div className="d-flex flex-column justify-content-between h-100">
              <h2>During Rental</h2>

              <div>
                <div>
                  <h4 className="mb-0">Enjoy your rental and return on time</h4>
                  <p className="mb-4">
                    Make the most of your time with the item and then return it
                    safely to the owner at the end of the rental.
                  </p>
                </div>

                <div>
                  <h4 className="mb-0">Need more time?</h4>
                  <p>
                    Be sure to check in with the lender and book extra days if
                    the item is available and you want to keep it for longer.
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <a href="/listing-list" className="base-main-button">
                  Browse items
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12 d-flex justify-content-center">
            <img src="/images/rental-info.png" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DuringRental;
