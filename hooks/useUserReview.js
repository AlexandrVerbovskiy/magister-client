import { useState } from "react";

const options = [
  { title: "Quality", key: "quality" },
  { title: "Listing accuracy", key: "listingAccuracy" },
  { title: "Utility", key: "utility" },
  { title: "Condition", key: "condition" },
  { title: "Performance", key: "performance" },
  { title: "Location", key: "location" },
];

const useUserReview = () => {
  const baseOptions = options.map((option) => ({
    ...option,
    value: 0,
  }));
  const [starOptions, setStarOptions] = useState(baseOptions);
  const [description, setDescription] = useState("");
  const [leaveFeedback, setLeaveFeedback] = useState("");

  const dataToSubmit = () => {
    const values = {};
    starOptions.forEach((element) => {
      values[element.key] = element.value;
    });

    return {
      ...values,
      description: description.trim(),
      leaveFeedback: leaveFeedback.trim(),
    };
  };

  return {
    starOptions,
    setStarOptions,
    description,
    setDescription,
    leaveFeedback,
    setLeaveFeedback,
    dataToSubmit,
  };
};

export default useUserReview;
