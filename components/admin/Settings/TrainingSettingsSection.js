import { useState } from "react";

const TrainingSettingsSection = ({ initialSettings = {}, onSave }) => {
  const [settings, setSettings] = useState({
    correlationThreshold: initialSettings.correlationThreshold ?? 0.5,
    pValueThreshold: initialSettings.pValueThreshold ?? 0.05,
    nEstimators: initialSettings.nEstimators ?? 100,
    randomState: initialSettings.randomState ?? 42,
    trainTestSplit: initialSettings.trainTestSplit ?? 80,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSliderChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      trainTestSplit: Number(e.target.value),
    }));
  };

  const handleSubmit = async () => {
    await onSave(settings);
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
      <div className="flex flex-col md:flex-row md:-mr-px">
        <div className="grow w-full">
          <div className="p-6 space-y-6">
            <h2 className="max-w-full overflow-separate text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
              Training Algorithm Settings
            </h2>
            <section style={{ marginTop: "0" }}>
              <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                <div className="sm:w-5/12">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="correlationThreshold"
                  >
                    Correlation Threshold
                  </label>
                  <input
                    id="correlationThreshold"
                    type="number"
                    name="correlationThreshold"
                    className="form-input w-full"
                    min={0}
                    max={1}
                    step={0.01}
                    value={settings.correlationThreshold}
                    onChange={handleChange}
                  />
                </div>
                <div className="sm:w-5/12">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="pValueThreshold"
                  >
                    P-value Threshold
                  </label>
                  <input
                    id="pValueThreshold"
                    type="number"
                    name="pValueThreshold"
                    className="form-input w-full"
                    min={0}
                    max={1}
                    step={0.01}
                    value={settings.pValueThreshold}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                <div className="sm:w-5/12">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="nEstimators"
                  >
                    n_estimators
                  </label>
                  <input
                    id="nEstimators"
                    type="number"
                    name="nEstimators"
                    className="form-input w-full"
                    min={1}
                    max={1000}
                    value={settings.nEstimators}
                    onChange={handleChange}
                  />
                </div>
                <div className="sm:w-5/12">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="randomState"
                  >
                    random_state
                  </label>
                  <input
                    id="randomState"
                    type="number"
                    name="randomState"
                    className="form-input w-full"
                    value={settings.randomState}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                <div className="sm:w-5/12">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="trainTestSplit"
                  >
                    Training Data Percentage
                  </label>
                  <input
                    id="default-range"
                    type="range"
                    value={settings.trainTestSplit}
                    min={50}
                    max={95}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer  accent-teal-500"
                  />
                  <span>
                    {settings.trainTestSplit}% training /{" "}
                    {100 - settings.trainTestSplit}% test
                  </span>
                </div>
              </div>
            </section>
          </div>
          <footer>
            <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
              <div className="flex self-end">
                <button
                  type="button"
                  className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
                  onClick={handleSubmit}
                >
                  Save Training Settings
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TrainingSettingsSection;
