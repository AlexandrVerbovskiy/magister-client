import STATIC from "../../../static";

const SendFileButton = ({
  fileInputRef,
  handleFileInputChange,
}) => {
  const onInputFile = (e) => {
    e.stopPropagation();
    handleFileInputChange(e);
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current.click()}
        className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 mr-3"
      >
        <span className="sr-only">Add</span>
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12C23.98 5.38 18.62.02 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z" />
        </svg>
      </button>

      <input
        ref={fileInputRef}
        onChange={onInputFile}
        type="file"
        accept={STATIC.FILE_ACCEPT}
        className="hidden"
      />
    </>
  );
};

export default SendFileButton;
