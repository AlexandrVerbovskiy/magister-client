import React, { useState, useRef, useEffect } from "react";
import { leveliseCategories } from "../../utils";
import SidebarCheckboxesSection from "./SidebarCheckboxesSection";
import PriceRangeSlider from "../FormComponents/PriceRangeSlider";

const Sidebar = ({
  categories: baseCategories,
  selectedCities,
  setSelectedCities,
  selectedCategories,
  setSelectedCategories,
  selectedOthersCategories,
  setSelectedOthersCategories,
  selectedDistance,
  setSelectedDistance,
  cities: baseCities,
  searchCity,
  searchCategory,
  distances: baseDistances,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handleChangePrices,
  minLimitPrice,
  maxLimitPrice,
  totalOthersCategories,
  setTotalOthersCategories,
  favorites,
  changeFavorites,
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

  const [priceFilterOpen, setPriceFilterOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [cityOpen, setCityOpen] = useState(true);
  const [distanceOpen, setDistanceOpen] = useState(true);
  const [otherOpen, setOtherOpen] = useState(true);

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

  useEffect(() => {
    setInterval(() => {
      updateTimeFilterHeight();
      updatePriceFilterHeight();
    }, 250);
  }, []);

  const handleChangeCheckedCategory = (value, id, parentId = null) => {
    if (id === "-") {
      if (parentId) {
        let newSelectedOthersCategories = selectedOthersCategories;

        if (newSelectedOthersCategories.includes(parentId)) {
          newSelectedOthersCategories = newSelectedOthersCategories.filter(
            (category) => category != parentId
          );
        } else {
          newSelectedOthersCategories = [
            ...newSelectedOthersCategories,
            parentId,
          ];
        }

        setSelectedOthersCategories(newSelectedOthersCategories);
      } else {
        setTotalOthersCategories(!totalOthersCategories);
      }
    } else {
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
          needRemoveSearch =
            value.toLowerCase() === searchCategory.toLowerCase();
        }
      } else {
        newSelectedCategories = [...newSelectedCategories, value];
      }

      setSelectedCategories(newSelectedCategories, needRemoveSearch);
    }
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

  const CategoryLi = ({ category, style = {} }) => {
    let checked = false;

    if (category.id === "-") {
      if (category.parentId) {
        checked = selectedOthersCategories.includes(category.parentId);
      } else {
        checked = totalOthersCategories;
      }
    } else {
      checked = selectedCategoriesLower.includes(category.name.toLowerCase());
    }

    return (
      <li key={category.name} style={style}>
        <input
          id={category.name}
          type="checkbox"
          name={`categories[${category.name}]`}
          onChange={() =>
            handleChangeCheckedCategory(
              category.name,
              category.id,
              category.parentId
            )
          }
          checked={checked}
          value={category.name}
        />
        <label htmlFor={category.name}>{category.name} </label>
      </li>
    );
  };

  const FirstCategoryLevelLi = ({ item }) => (
    <>
      <CategoryLi category={item} />
      {item.children.length > 0 && (
        <>
          {item.children.map((sCategory) => (
            <React.Fragment key={sCategory.name}>
              <CategoryLi
                style={{ paddingLeft: "25px" }}
                category={sCategory}
              />

              {sCategory.children.length > 0 && (
                <>
                  {sCategory.children.map((tCategory) => (
                    <CategoryLi
                      style={{ paddingLeft: "50px" }}
                      category={tCategory}
                      key={tCategory.name}
                    />
                  ))}
                  <CategoryLi
                    style={{ paddingLeft: "50px" }}
                    category={{
                      name: "Others",
                      id: "-",
                      parentId: sCategory.id,
                    }}
                  />
                </>
              )}
            </React.Fragment>
          ))}
          <CategoryLi
            style={{ paddingLeft: "25px" }}
            category={{ name: "Others", id: "-", parentId: item.id }}
          />
        </>
      )}
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

  const OtherLi = ({ item }) => (
    <li>
      <input
        id={item.name}
        type="checkbox"
        value={item.value}
        name={`others[${item.name}]`}
        onChange={() => item.handleChange(item.value)}
        checked={item.checked}
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
                  minLimit={minLimitPrice}
                  maxLimit={maxLimitPrice}
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
          LiItemElement={CityLi}
        />

        <SidebarCheckboxesSection
          title="Distances"
          open={distanceOpen}
          setOpen={setDistanceOpen}
          items={baseDistances}
          LiItemElement={DistanceLi}
        />

        {categories.length > 0 && (
          <SidebarCheckboxesSection
            title="Categories"
            open={categoriesOpen}
            setOpen={setCategoriesOpen}
            items={categories}
            LiItemElement={FirstCategoryLevelLi}
          />
        )}

        <SidebarCheckboxesSection
          title="Other Criteria"
          open={otherOpen}
          setOpen={setOtherOpen}
          items={[
            {
              value: "favorites",
              name: "favorites",
              title: "Favorites",
              checked: favorites,
              handleChange: changeFavorites,
            },
          ]}
          LiItemElement={OtherLi}
        />
      </aside>
    </>
  );
};

export default Sidebar;
