import React from "react"; 

const Sidebar = () => {
  return (
    <>
      <aside className="listings-widget-area">
        <section className="widget widget_filters">
          <h3 className="widget-title">Filters</h3>

          <ul>
            <li>
              <button type="button">$</button>
            </li>
            <li>
              <button type="button">$$</button>
            </li>
            <li>
              <button type="button">$$$</button>
            </li>
            <li>
              <button type="button">$$$$</button>
            </li>
          </ul>
        </section>

        <section className="widget widget_categories">
          <h3 className="widget-title">Categories</h3>

          <ul>
            <li>
              <input id="categories1" type="checkbox" />
              <label htmlFor="categories1">Restaurant</label>
            </li>

            <li>
              <input id="categories2" type="checkbox" />
              <label htmlFor="categories2">Hotel</label>
            </li>

            <li>
              <input id="categories3" type="checkbox" />
              <label htmlFor="categories3">Beauty & Spa</label>
            </li>

            <li>
              <input id="categories4" type="checkbox" />
              <label htmlFor="categories4">Fitness</label>
            </li>

            <li>
              <input id="categories5" type="checkbox" />
              <label htmlFor="categories5">Shopping</label>
            </li>

            <li className="hide">
              <input id="categories6" type="checkbox" />
              <label htmlFor="categories6">Hospital</label>
            </li>

            <li className="hide">
              <input id="categories7" type="checkbox" />
              <label htmlFor="categories7">Events</label>
            </li>

            <li className="hide">
              <input id="categories8" type="checkbox" />
              <label htmlFor="categories8">Clothing</label>
            </li>
            
            <li className="see-all-btn">
              <span>See All</span>
            </li>
          </ul>
        </section>

        <section className="widget widget_features">
          <h3 className="widget-title">Features</h3>

          <ul>
            <li>
              <input id="categories1" type="checkbox" />
              <label htmlFor="categories1">Restaurant</label>
            </li>

            <li>
              <input id="categories2" type="checkbox" />
              <label htmlFor="categories2">Hotel</label>
            </li>

            <li>
              <input id="categories3" type="checkbox" />
              <label htmlFor="categories3">Beauty & Spa</label>
            </li>

            <li>
              <input id="categories4" type="checkbox" />
              <label htmlFor="categories4">Fitness</label>
            </li>
            
            <li>
              <input id="categories5" type="checkbox" />
              <label htmlFor="categories5">Shopping</label>
            </li>

            <li className="hide">
              <input id="categories6" type="checkbox" />
              <label htmlFor="categories6">Hospital</label>
            </li>

            <li className="hide">
              <input id="categories7" type="checkbox" />
              <label htmlFor="categories7">Events</label>
            </li>

            <li className="hide">
              <input id="categories8" type="checkbox" />
              <label htmlFor="categories8">Clothing</label>
            </li>

            <li className="see-all-btn">
              <span>See All</span>
            </li>
          </ul>
        </section>

        <section className="widget widget_distance">
          <h3 className="widget-title">Distance</h3>

          <ul>
            <li>
              <input id="distance1" type="checkbox" />
              <label htmlFor="distance1">Driving (5 mi.)</label>
            </li>

            <li>
              <input id="distance2" type="checkbox" />
              <label htmlFor="distance2">Walking (1 mi.)</label>
            </li>

            <li>
              <input id="distance3" type="checkbox" />
              <label htmlFor="distance3">Biking (2 mi.)</label>
            </li>

            <li>
              <input id="distance4" type="checkbox" />
              <label htmlFor="distance4">Within 4 blocks</label>
            </li>

            <li>
              <input id="distance5" type="checkbox" />
              <label htmlFor="distance5">Bicycle (6 mi.)</label>
            </li>

            <li className="hide">
              <input id="distance6" type="checkbox" />
              <label htmlFor="distance6">Driving (10 mi.)</label>
            </li>

            <li className="hide">
              <input id="distance7" type="checkbox" />
              <label htmlFor="distance7">Walking (11 mi.)</label>
            </li>

            <li className="see-all-btn">
              <span>See All</span>
            </li>
          </ul>
        </section>
      </aside>
    </>
  );
};

export default Sidebar;
