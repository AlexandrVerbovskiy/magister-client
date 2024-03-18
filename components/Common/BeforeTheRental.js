const BeforeTheRental = () => {
  return (
    <section className="category-area pt-100 pb-100 bg-f9f9f9">
      <div className="container">
        <div className="row flex-column-reverse flex-lg-row">
          <div className="col-lg-4 col-md-12 d-flex justify-content-center">
            <img src="/images/rental-info.png" />
          </div>

          <div className="col-lg-8 col-md-12 pb-100 pb-lg-0">
            <div className="d-flex flex-column justify-content-between h-100">
              <h2>Before The Rental</h2>

              <div>
                <div>
                  <h4 className="mb-0">Find an item nearby</h4>
                  <p className="mb-4">
                    Search for the items you're looking for and filter by
                    location.
                  </p>
                </div>

                <div>
                  <h4 className="mb-0">Request and book</h4>
                  <p className="mb-4">
                    Send a request to the lender for the dates you'd like the
                    items. When they accept your request you can book the items
                    by paying.
                  </p>
                </div>

                <div>
                  <h4 className="mb-0">Verify</h4>
                  <p>
                    If you haven't before you'll be asked to verify your
                    identity and then the rental will be confirmed.
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
        </div>
      </div>
    </section>
  );
};

export default BeforeTheRental;
