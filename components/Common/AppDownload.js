import React from 'react';

const AppDownload = () => {
  return (
    <>
      <section className='app-download-area bg-main-color'>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-lg-5 col-md-12'>
              <div className='app-download-content'>
                <h2>Download Indice App</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

                <div className='btn-box'>
                  <a href='#' className='playstore-btn'>
                    <img src='/images/play-store.png' alt='image' />
                    GET IT ON
                    <span>Google Play</span>
                  </a>

                  <a href='#' className='applestore-btn'>
                    <img src='/images/apple-store.png' alt='image' />
                    Download on the
                    <span>Apple Store</span>
                  </a>
                </div>
              </div>
            </div>

            <div className='col-lg-7 col-md-12'>
              <div className='app-download-image'>
                <img src='/images/app-download.png' alt='image' />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppDownload;
