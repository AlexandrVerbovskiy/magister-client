import React from "react";

const SearchTipsPopup = ({ active, tips, handleTipClick }) => {
  return (
    <div className={`tips-popup-wrapper ${active ? "active" : ""}`}>
      <div className="tips-popup">
        {tips.map((tip) => (
          <div key={tip} className="tip" onClick={() => handleTipClick(tip)}>
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchTipsPopup;
