import React, { useState, useRef, useEffect } from "react";
import DateInput from "../FormComponents/DateInput";
import { dateToInput } from "../../utils";
import { useRouter } from "next/router";

const distances = [
  { name: "distance1", value: "driving_(5_mi.)", title: "Driving (5 mi.)" },
  { name: "distance2", value: "walking_(1_mi.)", title: "Walking (1 mi.)" },
  { name: "distance3", value: "biking_(1_mi.)", title: "Biking (2 mi.)" },
  { name: "distance4", value: "within_4_blocks", title: "Within 4 blocks" },
  { name: "distance5", value: "bicycle_(6_mi.)", title: "Bicycle (6 mi.)" },
  { name: "distance6", value: "driving_(10_mi.)", title: "Driving (10 mi.)" },
  { name: "distance7", value: "walking_(10_mi.)", title: "Walking (11 mi.)" },
];

const baseShowedMore = false;
const baseToDay = 2;

const Sidebar = ({ categories: baseCategories }) => {
  const router = useRouter();

  const { firstLevel, secondLevel, thirdLevel } = baseCategories;
  const categories = firstLevel.map((elem) => ({
    ...elem,
    children: secondLevel
      .filter((sElem) => sElem.parentId === elem.id)
      .map((sElem) => ({
        ...sElem,
        children: thirdLevel.filter((tElem) => tElem.parentId === sElem.id),
      })),
  }));

  const [mainFilterOpen, setMainFilterOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [distanceOpen, setDistanceOpen] = useState(true);

  const [categoriesShowedMore, setCategoriesShowedMore] =
    useState(baseShowedMore);
  const [distanceShowedMore, setDistanceShowedMore] = useState(baseShowedMore);

  const [fromDateFilter, setFromDateFilter] = useState(dateToInput());
  const [toDateFilter, setToDateFilter] = useState(dateToInput(baseToDay));

  const mainFilterFullUlRef = useRef(null);

  const categoryMainUlRef = useRef(null);
  const categoryDopUlRef = useRef(null);
  const categoryShowMoreUlRef = useRef(null);

  const distanceMainUlRef = useRef(null);
  const distanceDopUlRef = useRef(null);
  const distanceShowMoreUlRef = useRef(null);

  const [mainFilterMaxHeight, setMainFilterMaxHeight] = useState(null);
  const [categoryMaxHeight, setCategoryMaxHeight] = useState(null);
  const [distanceMaxHeight, setDistanceMaxHeight] = useState(null);

  const [categoryDopMaxHeight, setCategoryDopMaxHeight] = useState(null);
  const [distanceDopMaxHeight, setDistanceDopMaxHeight] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDistances, setSelectedDistances] = useState([]);

  useEffect(() => {
    const { categories = [], distances = [], from, to } = router.query;

    if (from) {
      if (from >= fromDateFilter) {
        setFromDateFilter(from);
      }
    }

    if (to) {
      if (from > to) {
        if (from >= fromDateFilter) {
          setToDateFilter(from);
        }
      } else {
        if (to >= toDateFilter) {
          setToDateFilter(to);
        }
      }
    }

    try {
      setSelectedCategories(categories);
    } catch (e) {
      setSelectedCategories([]);
    }

    try {
      setSelectedDistances(distances);
    } catch (e) {
      setSelectedDistances([]);
    }
  }, [router.query]);

  useEffect(() => {
    if (mainFilterFullUlRef.current) {
      const childHeight = mainFilterFullUlRef.current.scrollHeight + 1;
      setMainFilterMaxHeight(childHeight);
    }
  }, [mainFilterFullUlRef.current]);

  useEffect(() => {
    if (categoryMainUlRef.current) {
      const childHeight =
        categoryMainUlRef.current.scrollHeight +
        categoryDopUlRef.current.scrollHeight +
        categoryShowMoreUlRef.current.scrollHeight +
        1;
      setCategoryMaxHeight(childHeight);
    }
  }, [
    categoryMainUlRef.current,
    categoryDopUlRef.current,
    categoryShowMoreUlRef.current,
  ]);

  useEffect(() => {
    if (
      distanceMainUlRef.current &&
      distanceDopUlRef.current &&
      distanceShowMoreUlRef.current
    ) {
      const childHeight =
        distanceMainUlRef.current.scrollHeight +
        distanceDopUlRef.current.scrollHeight +
        distanceShowMoreUlRef.current.scrollHeight +
        1;
      setDistanceMaxHeight(childHeight);
    }
  }, [
    distanceMainUlRef.current,
    distanceDopUlRef.current,
    distanceShowMoreUlRef.current,
  ]);

  useEffect(() => {
    if (categoryDopUlRef.current) {
      setCategoryDopMaxHeight(categoryDopUlRef.current.scrollHeight + 1);
    }
  }, [categoryDopUlRef.current]);

  useEffect(() => {
    if (distanceDopUlRef.current) {
      setDistanceDopMaxHeight(distanceDopUlRef.current.scrollHeight + 1);
    }
  }, [distanceDopUlRef.current]);

  const updateCurrentLink = (dopProps = {}) => {
    const props = {
      fromDateFilter,
      toDateFilter,
      selectedCategories,
      selectedDistances,
      ...dopProps,
    };

    let link = `?from=${props.fromDateFilter}&to=${props.toDateFilter}`;

    if (props.selectedCategories.length > 0) {
      link += `&${props.selectedCategories
        .map((category) => `categories=${category}`)
        .join("&")}`;
    }

    if (props.selectedDistances.length > 0) {
      link += `&${props.selectedDistances
        .map((distance) => `distances=${distance}`)
        .join("&")}`;
    }

    const currentLink = window.location.href;

    const newLinkPart =
      window.location.origin + window.location.pathname + link;

    if (currentLink !== newLinkPart) {
      window.history.replaceState(null, null, newLinkPart);
    }
  };

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
    updateCurrentLink({ selectedCategories: newSelectedCategories });
  };

  const handleChangeCheckedDistance = (value) => {
    let newSelectedDistances = selectedDistances;

    if (selectedDistances.includes(value)) {
      newSelectedDistances = newSelectedDistances.filter(
        (distance) => distance != value
      );
    } else {
      newSelectedDistances = [...newSelectedDistances, value];
    }

    setSelectedDistances(newSelectedDistances);
    updateCurrentLink({ selectedDistances: newSelectedDistances });
  };

  const handleFromDateFilterChange = (value) => {
    setFromDateFilter(value);
    updateCurrentLink({ fromDateFilter: value });

    if (!toDateFilter || value > toDateFilter) {
      setToDateFilter(value);
    }
  };

  const handleToDateFilterChange = (value) => {
    setToDateFilter(value);
    updateCurrentLink({ toDateFilter: value });
  };

  const CategoryLi = ({ category, style = {} }) => (
    <li key={category.name} style={style}>
      <input
        id={category.name}
        type="checkbox"
        onChange={() => handleChangeCheckedCategory(category.name)}
        checked={selectedCategories.includes(category.name)}
        value={category.name}
      />
      <label htmlFor={category.name}>{category.name} </label>
    </li>
  );

  const FirstCategoryLevel = ({ fCategory }) => (
    <React.Fragment key={fCategory.name}>
      <CategoryLi category={fCategory} />
      {fCategory.children.map((sCategory) => (
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
    </React.Fragment>
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
                    value={fromDateFilter}
                    onInput={(value) => handleFromDateFilterChange(value)}
                  />
                </div>

                <div style={{ marginLeft: "10px", marginRight: "10px" }}>-</div>

                <div className="d-flex flex-column date-filter">
                  <label htmlFor="to_date">To</label>
                  <DateInput
                    min={
                      fromDateFilter || new Date().toISOString().split("T")[0]
                    }
                    name="to_date"
                    value={toDateFilter}
                    onInput={(value) => handleToDateFilterChange(value)}
                  />
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section
          className={`widget widget_categories ${
            categoriesOpen ? "" : "close"
          }`}
        >
          <h3
            className="widget-title"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
          >
            Categories
          </h3>

          <div
            className="widget-body"
            style={
              !categoryMaxHeight
                ? null
                : { maxHeight: `${categoryMaxHeight}px` }
            }
          >
            <ul ref={categoryMainUlRef}>
              {categories.slice(0, 5).map((fCategory) => (
                <FirstCategoryLevel
                  fCategory={fCategory}
                  key={fCategory.name}
                />
              ))}
            </ul>

            <div
              className={`showed-more ${categoriesShowedMore ? "" : "close"}`}
              style={
                !categoryDopMaxHeight
                  ? null
                  : { maxHeight: `${categoryDopMaxHeight}px` }
              }
            >
              <ul ref={categoryDopUlRef} style={{ paddingTop: "11px" }}>
                {categories.slice(5).map((fCategory) => (
                  <FirstCategoryLevel
                    fCategory={fCategory}
                    key={fCategory.name}
                  />
                ))}
              </ul>
            </div>

            <ul ref={categoryShowMoreUlRef} style={{ paddingTop: "11px" }}>
              <li
                className="see-all-btn"
                onClick={() => setCategoriesShowedMore(!categoriesShowedMore)}
              >
                <span>{categoriesShowedMore ? "See Less" : "See All"} </span>
              </li>
            </ul>
          </div>
        </section>

        <section
          className={`widget widget_distance ${distanceOpen ? "" : "close"}`}
        >
          <h3
            className="widget-title"
            onClick={() => setDistanceOpen(!distanceOpen)}
          >
            Distance
          </h3>

          <div
            className="widget-body"
            style={
              !distanceMaxHeight
                ? null
                : { maxHeight: `${distanceMaxHeight}px` }
            }
          >
            <ul ref={distanceMainUlRef}>
              {distances.slice(0, 5).map((distance) => (
                <li key={distance.name}>
                  <input
                    id={distance.name}
                    type="checkbox"
                    value={distance.value}
                    onChange={() => handleChangeCheckedDistance(distance.value)}
                    checked={selectedDistances.includes(distance.value)}
                  />
                  <label htmlFor={distance.name}>{distance.title} </label>
                </li>
              ))}
            </ul>

            <div
              className={`showed-more ${distanceShowedMore ? "" : "close"}`}
              style={
                !distanceDopMaxHeight
                  ? null
                  : { maxHeight: `${distanceDopMaxHeight}px` }
              }
            >
              <ul ref={distanceDopUlRef} style={{ paddingTop: "11px" }}>
                {distances.slice(5).map((distance) => (
                  <li key={distance.name}>
                    <input
                      id={distance.name}
                      type="checkbox"
                      value={distance.value}
                      onChange={() =>
                        handleChangeCheckedDistance(distance.value)
                      }
                      checked={selectedDistances.includes(distance.value)}
                    />
                    <label htmlFor={distance.name}>{distance.title} </label>
                  </li>
                ))}
              </ul>
            </div>

            <ul ref={distanceShowMoreUlRef} style={{ paddingTop: "11px" }}>
              <li
                className="see-all-btn"
                onClick={() => setDistanceShowedMore(!distanceShowedMore)}
              >
                <span>{distanceShowedMore ? "See Less" : "See All"} </span>
              </li>
            </ul>
          </div>
        </section>
      </aside>
    </>
  );
};

export default Sidebar;
