import Select from "react-select";

const CategorySelect = ({
  categorizedCategories,
  category,
  categoryError,
  handleChangeCategory,
}) => {
  const options = Object.keys(categorizedCategories).reduce((acc, level) => {
    const categoryInfo = categorizedCategories[level];
    const popularLabel = categoryInfo.label + " popular";
    const unpopularLabel = categoryInfo.label;

    const popularOptions = categoryInfo.popular.map((option) => ({
      value: option.id,
      label: option.name,
    }));

    const unpopularOptions = categoryInfo.unpopular.map((option) => ({
      value: option.id,
      label: option.name,
    }));

    if (popularOptions.length > 0) {
      acc.push({ label: popularLabel, options: popularOptions });
    }

    if (unpopularOptions.length > 0) {
      acc.push({ label: unpopularLabel, options: unpopularOptions });
    }

    return acc;
  }, []);

  const selectedOption = options
    .flatMap(({ options }) => options)
    .find((option) => option.value === category);

  return (
    <Select
      name="selectedCategory"
      options={options}
      value={selectedOption}
      onChange={handleChangeCategory}
      className={`custom-search-select ${categoryError ? "is-invalid" : ""}`}
      placeholder="Select Category"
      isSearchable={true}
    />
  );
};

export default CategorySelect;
