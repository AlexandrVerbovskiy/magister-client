import React from "react";
import SuccessIcon from "./Icons/SuccessIcon";
import ErrorIcon from "./Icons/ErrorIcon";

const StatusBar = ({ statuses, hasCancelStatus = false }) => {
  if (hasCancelStatus) {
    for (let i = 0; i < statuses.length; i++) {
      if (!statuses[i].finished) {
        statuses[i]["failed"] = true;
        break;
      }
    }
  }

  return (
    <div className="status-bar-wrapper">
      <div className="status-bar">
        <div className="status-bar-indexes flex-column flex-md-row">
          {statuses.map((status, index) => (
            <React.Fragment key={status.title}>
              <div className="status-bar-item">
                {status.finished ? (
                  <div className="status-bar-completed">
                    <SuccessIcon />
                  </div>
                ) : (
                  <React.Fragment>
                    {status.failed ? (
                      <div className="status-bar-failed">
                        <ErrorIcon />
                      </div>
                    ) : (
                      <div className="status-bar-step">
                        {index + 1 < 10 ? "0" + (index + 1) : index + 1}
                      </div>
                    )}
                  </React.Fragment>
                )}
              </div>
              <div
                className="status-bar-title mt-1 d-md-none"
                key={status.title}
              >
                {status.title}
              </div>
              {index != statuses.length - 1 ? (
                <div className="status-bar-line"></div>
              ) : (
                <></>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="status-bar-titles d-none d-md-flex">
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
