import React from "react";

const SearchTipsPopup = ({ active, tips, handleTipClick }) => {
  return (
    <div
      className={`tips-popup-wrapper ${active ? "active" : ""}`}
      onMouseDown={e=>e.preventDefault()}
    >
      <div className="tips-popup left-scrollable">
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
