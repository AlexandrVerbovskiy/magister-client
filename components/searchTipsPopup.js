import React from "react";

const SearchTipsPopup = ({ active, categoryTips, handleCategoryTipClick }) => {
  return (
    <div className={`tips-popup-wrapper ${active ? "active" : ""}`}>
      <div className="tips-popup">
        {categoryTips.map((category) => (
          <div
            key={category}
            className="tip"
            onClick={() => handleCategoryTipClick(category)}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchTipsPopup;
