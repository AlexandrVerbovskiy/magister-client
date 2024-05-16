import React, { useState, useRef, useEffect } from "react";
import DateInput from "../FormComponents/DateInput";
import {
  dateToInputString,
  leveliseCategories,
  separateDate,
} from "../../utils";
import SidebarCheckboxesSection from "./SidebarCheckboxesSection";
import PriceRangeSlider from "../FormComponents/PriceRangeSlider";

const Sidebar = ({
  categories: baseCategories,
  selectedCities,
  setSelectedCities,
  selectedCategories,
  setSelectedCategories,
  selectedDistance,
  setSelectedDistance,
  fromDateFilter,
  setFromDateFilter,
  toDateFilter,
  setToDateFilter,
  cities: baseCities,
  searchCity,
  searchCategory,
  distances: baseDistances,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handleChangePrices,
}) => {
  const [selectedCategoriesLower, setSelectedCategoriesLower] = useState([]);
  const [selectedCitiesLower, setSelectedCitiesLower] = useState([]);

  useEffect(() => {
    const newValue = [...selectedCategories];

    if (searchCategory) {
      newValue.push(searchCategory);
    }

    const newValueLower = newValue.map((value) => value.toLowerCase());
    setSelectedCategoriesLower(newValueLower);
  }, [searchCategory, selectedCategories]);

  useEffect(() => {
    const newValue = [...selectedCities];

    if (searchCity) {
      newValue.push(searchCity);
    }

    const newValueLower = newValue.map((value) => value.toLowerCase());
    setSelectedCitiesLower(newValueLower);
  }, [searchCity, selectedCities]);

  const categories = leveliseCategories(baseCategories);

  const [mainFilterOpen, setMainFilterOpen] = useState(true);
  const [priceFilterOpen, setPriceFilterOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [cityOpen, setCityOpen] = useState(true);
  const [distanceOpen, setDistanceOpen] = useState(true);

  const mainFilterFullUlRef = useRef(null);
  const priceFilterFullUlRef = useRef(null);

  const [mainFilterMaxHeight, setMainFilterMaxHeight] = useState(null);
  const [priceFilterMaxHeight, setPriceFilterMaxHeight] = useState(null);

  const updateTimeFilterHeight = () => {
    if (mainFilterFullUlRef.current) {
      const childHeight = mainFilterFullUlRef.current.scrollHeight + 1;
      setMainFilterMaxHeight(childHeight);
    }
  };

  useEffect(() => updateTimeFilterHeight(), [mainFilterFullUlRef.current]);

  const updatePriceFilterHeight = () => {
    if (priceFilterFullUlRef.current) {
      const childHeight = priceFilterFullUlRef.current.scrollHeight + 1;
      setPriceFilterMaxHeight(childHeight);
    }
  };

  useEffect(() => updatePriceFilterHeight(), [priceFilterFullUlRef.current]);

  useEffect(() => {
    setInterval(updateTimeFilterHeight, 250);
  }, []);

  const handleChangeCheckedCategory = (value) => {
    let newSelectedCategories = selectedCategories;
    let needRemoveSearch = false;

    if (
      selectedCategories.includes(value) ||
      (searchCategory && value.toLowerCase() === searchCategory.toLowerCase())
    ) {
      newSelectedCategories = newSelectedCategories.filter(
        (category) => category != value
      );

      if (searchCategory) {
        needRemoveSearch = value.toLowerCase() === searchCategory.toLowerCase();
      }
    } else {
      newSelectedCategories = [...newSelectedCategories, value];
    }

    setSelectedCategories(newSelectedCategories, needRemoveSearch);
  };

  const handleChangeCheckedCity = (value) => {
    let newSelectedCities = selectedCities;
    let needRemoveSearch = false;

    if (
      selectedCities.includes(value) ||
      (searchCity && value.toLowerCase() === searchCity.toLowerCase())
    ) {
      newSelectedCities = newSelectedCities.filter((city) => city != value);

      if (searchCity) {
        needRemoveSearch = value.toLowerCase() === searchCity.toLowerCase();
      }
    } else {
      newSelectedCities = [...newSelectedCities, value];
    }

    setSelectedCities(newSelectedCities, needRemoveSearch);
  };

  const handleChangeCheckedDistance = (value) => {
    if (selectedDistance != value) {
      setSelectedDistance(value);
    } else {
      setSelectedDistance(null);
    }
  };

  const handleFromDateFilterChange = (value) => {
    setFromDateFilter(value);

    if (!toDateFilter || value > toDateFilter) {
      setToDateFilter(value);
    }
  };

  const handleToDateFilterChange = (value) => {
    setToDateFilter(value);
  };

  const CategoryLi = ({ category, style = {} }) => (
    <li key={category.name} style={style}>
      <input
        id={category.name}
        type="checkbox"
        name={`categories[${category.name}]`}
        onChange={() => handleChangeCheckedCategory(category.name)}
        checked={selectedCategoriesLower.includes(category.name.toLowerCase())}
        value={category.name}
      />
      <label htmlFor={category.name}>{category.name} </label>
    </li>
  );

  const FirstCategoryLevelLi = ({ item }) => (
    <>
      <CategoryLi category={item} />
      {item.children.map((sCategory) => (
        <React.Fragment key={sCategory.name}>
          <CategoryLi style={{ paddingLeft: "25px" }} category={sCategory} />
          {sCategory.children.map((tCategory) => (
            <CategoryLi
              style={{ paddingLeft: "50px" }}
              category={tCategory}
              key={tCategory.name}
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );

  const CityLi = ({ item }) => (
    <li>
      <input
        id={item.name}
        type="checkbox"
        value={item.value}
        name={`cities[${item.name}]`}
        onChange={() => handleChangeCheckedCity(item.value)}
        checked={selectedCitiesLower.includes(item.value.toLowerCase())}
      />
      <label htmlFor={item.name}>{item.title} </label>
    </li>
  );

  const DistanceLi = ({ item }) => (
    <li>
      <input
        id={item.name}
        type="checkbox"
        value={item.value}
        name={`distances[${item.name}]`}
        onChange={() => handleChangeCheckedDistance(item.value)}
        checked={selectedDistance == item.value}
      />
      <label htmlFor={item.name}>{item.title} </label>
    </li>
  );

  return (
    <>
      <aside className="listings-widget-area">
        <section
          className={`widget widget_filters ${priceFilterOpen ? "" : "close"}`}
        >
          <h3
            className="widget-title"
            onClick={() => setPriceFilterOpen(!priceFilterOpen)}
          >
            Price
          </h3>
          <div
            className="widget-body"
            style={
              !priceFilterMaxHeight
                ? null
                : { maxHeight: `${priceFilterMaxHeight}px` }
            }
          >
            <ul ref={priceFilterFullUlRef}>
              <li className="d-flex align-items-end date-filter-row">
                <PriceRangeSlider
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  handleChangePrices={handleChangePrices}
                />
              </li>
            </ul>
          </div>
        </section>

        <SidebarCheckboxesSection
          title="City"
          open={cityOpen}
          setOpen={setCityOpen}
          items={baseCities}
          selectedItems={selectedCities}
          handleChangeChecked={handleChangeCheckedCity}
          LiItemElement={CityLi}
        />

        <SidebarCheckboxesSection
          title="Distances"
          open={distanceOpen}
          setOpen={setDistanceOpen}
          items={baseDistances}
          selectedItems={[selectedDistance]}
          handleChangeChecked={handleChangeCheckedDistance}
          LiItemElement={DistanceLi}
        />

        <section
          className={`widget widget_filters ${mainFilterOpen ? "" : "close"}`}
        >
          <h3
            className="widget-title"
            onClick={() => setMainFilterOpen(!mainFilterOpen)}
          >
            Rental Period
          </h3>

          <div
            className="widget-body"
            style={
              !mainFilterMaxHeight
                ? null
                : { maxHeight: `${mainFilterMaxHeight}px` }
            }
          >
            <ul ref={mainFilterFullUlRef}>
              <li className="d-flex align-items-end date-filter-row">
                <div className="d-flex flex-column date-filter">
                  <label htmlFor="from_date">From</label>
                  <DateInput
                    min={separateDate(new Date())}
                    name="from_date"
                    value={
                      fromDateFilter ? dateToInputString(fromDateFilter) : ""
                    }
                    onInput={(value) => handleFromDateFilterChange(value)}
                  />
                </div>

                <div style={{ marginLeft: "10px", marginRight: "10px" }}>-</div>

                <div className="d-flex flex-column date-filter">
                  <label htmlFor="to_date">To</label>
                  <DateInput
                    min={
                      fromDateFilter ? dateToInputString(fromDateFilter) : ""
                    }
                    name="to_date"
                    value={toDateFilter ? dateToInputString(toDateFilter) : ""}
                    onInput={(value) => handleToDateFilterChange(value)}
                  />
                </div>
              </li>
            </ul>
          </div>
        </section>

        {categories.length > 0 && (
          <SidebarCheckboxesSection
            title="Categories"
            open={categoriesOpen}
            setOpen={setCategoriesOpen}
            items={categories.sort((a, b) =>
              ("" + a.name).localeCompare(b.name)
            )}
            selectedItems={selectedCategories}
            handleChangeChecked={handleChangeCheckedCategory}
            LiItemElement={FirstCategoryLevelLi}
          />
        )}
      </aside>
    </>
  );
};

export default Sidebar;
