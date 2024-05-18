import React from "react";

const StatusBar = ({ statuses }) => {
  return (
    <div className="status-bar-wrapper">
      <div className="status-bar">
        <div className="status-bar-indexes">
          {statuses.map((status, index) => (
            <React.Fragment key={status.title}>
              <div className="status-bar-item">
                {status.finished ? (
                  <div className="status-bar-completed">
                    <svg
                      width="33"
                      height="32"
                      viewBox="0 0 33 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <circle
                          cx="16.5"
                          cy="16"
                          r="15"
                          fill="#594FBF"
                          stroke="#594FBF"
                          strokeWidth="2"
                        />
                      </g>
                      <path
                        d="M13.0782 19.642L22.7202 10L24.0005 11.2802L13.0782 22.2025L8 17.1257L9.28025 15.8455L13.0782 19.642Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="status-bar-step">
                    {index + 1 < 10 ? "0" + (index + 1) : index + 1}
                  </div>
                )}
              </div>
              {index != statuses.length - 1 ? (
                <div className="status-bar-line"></div>
              ) : (
                <></>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="status-bar-titles">
          {statuses.map((status, index) => (
            <div className="status-bar-title" key={status.title}>
              {status.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
