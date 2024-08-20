import { useState } from "react";

const options = [
  {
    title: "Item description accuracy",
    description:
      "How closely does the item match the description provided in the listing?",
    key: "itemDescriptionAccuracy",
  },
  {
    title: "Photo accuracy",
    description: "How accurate were photos of the item?",
    key: "photoAccuracy",
  },
  {
    title: "Condition at Pickup?",
    description: "How do you assess the condition of the item at pickup?",
    key: "pickupCondition",
  },
  {
    title: "Cleanliness",
    description: "How do you assess the item cleanliness at pickup?",
    key: "cleanliness",
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
    title: "Scheduling Flexibility",
    description:
      "How do you assess the owner flexibility with pickup and return times?",
    key: "schedulingFlexibility",
  },
  {
    title: "Issue Resolution",
    description:
      "How effectively did the owner handle any issues or concerns? ",
    key: "issueResolution",
  },
];

const useOwnerReview = () => {
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

export default useOwnerReview;
