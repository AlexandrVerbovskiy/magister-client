import { useState } from "react";

const options = [
  {
    title: "Care",
    description:
      "How carefully do you think the renter handled the item and returned it in the same condition?",
    key: "care",
  },
  {
    title: "Timeliness",
    description:
      "How do you evaluate the renter in relation to the return period?",
    key: "timeliness",
  },
  {
    title: "Responsiveness",
    description: "How quickly did the owner respond to message and inquiries?",
    key: "responsiveness",
  },
  {
    title: "Clarity",
    description:
      "How clear and helpful do you think the owner's instructions and responses were?",
    key: "clarity",
  },
  {
    title: "Usage Guidelines",
    description:
      "How well do you think the owner follow the provided usage instructions?",
    key: "usageGuidelines",
  },
  {
    title: "Terms of Service",
    description:
      "How clear and helpful do you think the owner's instructions and responses were?",
    key: "termsOfService",
  },
  {
    title: "Honesty",
    description:
      "How honest was the renter about the condition of the item upon return?",
    key: "honesty",
  },
  {
    title: "Reliability",
    description:
      "How do you assess the renter reliability in terms of pickup, usage, and return the item?",
    key: "reliability",
  },
  {
    title: "Satisfaction",
    description:
      "How satisfied were you with the overall experience provided by the renter?",
    key: "satisfaction",
  },
];

const useRenterReview = () => {
  const baseOptions = options.map((option) => ({
    ...option,
    value: 0,
    error: null,
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

export default useRenterReview;
