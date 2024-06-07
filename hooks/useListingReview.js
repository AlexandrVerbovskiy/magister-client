import { useState } from "react";

const options = [
  { title: "Punctuality", key: "punctuality" },
  { title: "Communication", key: "communication" },
  { title: "Flexibility", key: "flexibility" },
  { title: "Reliability", key: "reliability" },
  { title: "Kindness", key: "kindness" },
  { title: "General Experience", key: "generalExperience" },
];

const useListingReview = () => {
  const baseOptions = options.map((option) => ({
    ...option,
    value: 0,
  }));
  const [starOptions, setStarOptions] = useState(baseOptions);
  const [description, setDescription] = useState("");

  const listingDataToSubmit = () => {
    const values = {};
    starOptions.forEach((element) => {
      values[element.key] = element.value;
    });

    return { ...values, description: description.trim() };
  };

  return {
    starOptions,
    setStarOptions,
    description,
    setDescription,
    listingDataToSubmit,
  };
};

export default useListingReview;
