import React, { useRef, useState, useEffect } from "react";

const SidebarCheckboxesSection = ({
  title,
  open,
  setOpen,
  items,
  LiItemElement,
}) => {
  const mainUlRef = useRef(null);
  const dopUlRef = useRef(null);
  const showMoreUlRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(null);
  const [dopMaxHeight, setDopMaxHeight] = useState(null);
  const [showedMore, setShowedMore] = useState(false);

  useEffect(() => {
    setInterval(() => {
      if (mainUlRef.current && dopUlRef.current) {
        const childHeight =
          mainUlRef.current.scrollHeight +
          dopUlRef.current.scrollHeight +
          (showMoreUlRef.current ? showMoreUlRef.current.scrollHeight : 0) +
          1;
        setMaxHeight(childHeight);
      }
      
      if (dopUlRef.current) {
        setDopMaxHeight(dopUlRef.current.scrollHeight + 1);
      }
    }, 250);
  }, []);

  return (
    <section className={`widget widget_distance ${open ? "" : "close"}`}>
      <h3 className="widget-title" onClick={() => setOpen(!open)}>
        {title}
      </h3>

      <div
        className="widget-body"
        style={!maxHeight ? null : { maxHeight: `${maxHeight}px` }}
      >
        <ul ref={mainUlRef}>
          {items.slice(0, 5).map((item) => (
            <LiItemElement item={item} key={item.name} />
          ))}
        </ul>

        <div
          className={`showed-more ${showedMore ? "" : "close"}`}
          style={!dopMaxHeight ? null : { maxHeight: `${dopMaxHeight}px` }}
        >
          <ul ref={dopUlRef} style={{ paddingTop: "11px" }}>
            {items.slice(5).map((item) => (
              <LiItemElement item={item} key={item.name} />
            ))}
          </ul>
        </div>

        {items.length > 5 && (
          <ul ref={showMoreUlRef} style={{ paddingTop: "11px" }}>
            <li
              className="see-all-btn"
              onClick={() => setShowedMore(!showedMore)}
            >
              <span>{showedMore ? "See Less" : "See All"} </span>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
};

export default SidebarCheckboxesSection;
