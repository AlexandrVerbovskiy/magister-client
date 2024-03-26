import React, { useState, useRef, useEffect } from "react";
import DateInput from "../FormComponents/DateInput";
import { dateToInputString, leveliseCategories } from "../../utils";
import SidebarCheckboxesSection from "./SidebarCheckboxesSection";

const Sidebar = ({
  categories: baseCategories,
  selectedCities,
  setSelectedCities,
  selectedCategories,
  setSelectedCategories,
  fromDateFilter,
  setFromDateFilter,
  toDateFilter,
  setToDateFilter,
  cities: baseCities,
}) => {
  const categories = leveliseCategories(baseCategories);

  const [mainFilterOpen, setMainFilterOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [cityOpen, setCityOpen] = useState(true);

  const mainFilterFullUlRef = useRef(null);

  const [mainFilterMaxHeight, setMainFilterMaxHeight] = useState(null);

  const updateTimeFilterHeight = () => {
    if (mainFilterFullUlRef.current) {
      const childHeight = mainFilterFullUlRef.current.scrollHeight + 1;
      setMainFilterMaxHeight(childHeight);
    }
  };

  useEffect(() => updateTimeFilterHeight(), [mainFilterFullUlRef.current]);

  useEffect(() => {
    setInterval(updateTimeFilterHeight, 250);
  }, []);

  const handleChangeCheckedCategory = (value) => {
    let newSelectedCategories = selectedCategories;

    if (selectedCategories.includes(value)) {
      newSelectedCategories = newSelectedCategories.filter(
        (category) => category != value
      );
    } else {
      newSelectedCategories = [...newSelectedCategories, value];
    }

    setSelectedCategories(newSelectedCategories);
  };

  const handleChangeCheckedCity = (value) => {
    let newSelectedCities = selectedCities;

    if (selectedCities.includes(value)) {
      newSelectedCities = newSelectedCities.filter((city) => city != value);
    } else {
      newSelectedCities = [...newSelectedCities, value];
    }

    setSelectedCities(newSelectedCities);
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
        checked={selectedCategories.includes(category.name)}
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
        checked={selectedCities.includes(item.value)}
      />
      <label htmlFor={item.name}>{item.title} </label>
    </li>
  );

  return (
    <>
      <aside className="listings-widget-area">
        <section
          className={`widget widget_filters ${mainFilterOpen ? "" : "close"}`}
        >
          <h3
            className="widget-title"
            onClick={() => setMainFilterOpen(!mainFilterOpen)}
          >
            Filters
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
                    min={new Date().toISOString().split("T")[0]}
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

        <SidebarCheckboxesSection
          title="City"
          open={cityOpen}
          setOpen={setCityOpen}
          items={baseCities}
          selectedItems={selectedCities}
          handleChangeChecked={handleChangeCheckedCity}
          LiItemElement={CityLi}
        />

        {categories.length > 0 && (
          <SidebarCheckboxesSection
            title="Categories"
            open={categoriesOpen}
            setOpen={setCategoriesOpen}
            items={categories}
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
