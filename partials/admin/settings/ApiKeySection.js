import { useState } from "react";

const ApiKeySection = ({ initialApiKey = "", onSave }) => {
  const [apiKey, setApiKey] = useState(initialApiKey);

  const handleGenerate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(key);
  };

  const handleSave = async () => {
    await onSave(apiKey);
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
      <div className="flex flex-col md:flex-row md:-mr-px">
        <div className="grow w-full">
          <div className="p-6 space-y-6">
            <h2 className="max-w-full overflow-separate text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
              API Key Management
            </h2>
            <section style={{ marginTop: "0" }}>
              <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                <div className="sm:w-6/12">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="apiKeyInput"
                  >
                    API Key
                  </label>
                  <div className="flex">
                    <input
                      id="apiKeyInput"
                      type="text"
                      className="form-input w-full"
                      value={apiKey}
                      readOnly
                      placeholder="API Key"
                    />
                    <button
                      type="button"
                      className="btn bg-teal-500 hover:bg-teal-600 text-white"
                      onClick={handleGenerate}
                    >
                      Generate
                    </button>
                  </div>
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
                  onClick={handleSave}
                  disabled={!apiKey}
                >
                  Save Key
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySection;
