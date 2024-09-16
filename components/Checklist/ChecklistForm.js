import { useContext, useState } from "react";
import ErrorSpan from "../ErrorSpan";
import { useDropzone } from "react-dropzone";
import STATIC from "../../static";
import { IndiceContext } from "../../contexts";
import TenantGotListingApproveModal from "../Order/TenantGotListingApproveModal";
import FinishOrderModal from "../Order/FinishOrderModal";
import { validateBigText } from "../../utils";
import { approveClientGotListing, finishedByOwner } from "../../services";
import { useIsMobile } from "../../hooks";

const QuestionInput = ({
  name,
  value,
  setValue,
  valueError,
  setValueError,
  active,
  setActive,
  label,
  placeholder,
}) => {
  const handleChange = (e) => {
    setValue(e.target.value);
    setValueError(null);
  };

  return (
    <div className="row">
      <div className="col-12">
        <p>{label}</p>

        <div className="form-group">
          <ul className="facilities-list">
            <li>
              <label className="checkbox">
                <input
                  type="checkbox"
                  name={`${name}[yes]`}
                  value="yes"
                  checked={active}
                  onChange={() => setActive(true)}
                />
                <span>Yes</span>
              </label>
            </li>
            <li>
              <label className="checkbox">
                <input
                  type="checkbox"
                  name={`${name}[no]`}
                  value="no"
                  checked={!active}
                  onChange={() => setActive(false)}
                />
                <span>No</span>
              </label>
            </li>
          </ul>
        </div>

        {active && (
          <div className="form-group">
            <input
              type="text"
              placeholder={placeholder}
              className={"form-control " + (valueError ? "is-invalid" : "")}
              value={value}
              onInput={handleChange}
            />
            <ErrorSpan error={valueError} />
          </div>
        )}
      </div>
    </div>
  );
};

const ImageView = ({ removeFile, path }) => {
  const handleRemoveClick = (e) => {
    e.stopPropagation();
    removeFile();
  };

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 gallery-flex-parent">
      <div
        className="invoice-btn-box gallery-flex form-group mb-0 rounded-3"
        style={{
          boxShadow: "1px 5px 24px 0 rgba(68, 102, 242, 0.05)",
          background: "white",
        }}
      >
        <img src={path} />
        <button
          type="button"
          className="default-btn remove-file-btn"
          onClick={handleRemoveClick}
        >
          <i className="flaticon-more"></i>
        </button>
      </div>
    </div>
  );
};

const ChecklistForm = ({ type, order, authToken, onSubmit }) => {
  const { error } = useContext(IndiceContext);

  const isMobile = useIsMobile();

  const [itemMatchesDescription, setItemMatchesDescription] = useState("");
  const [itemMatchesDescriptionActive, setItemMatchesDescriptionActive] =
    useState(true);
  const [itemMatchesDescriptionError, setItemMatchesDescriptionError] =
    useState(null);

  const [itemMatchesPhotos, setItemMatchesPhotos] = useState("");
  const [itemMatchesPhotosActive, setItemMatchesPhotosActive] = useState(true);
  const [itemMatchesPhotosError, setItemMatchesPhotosError] = useState(null);

  const [itemFullyFunctional, setItemFullyFunctional] = useState("");
  const [itemFullyFunctionalActive, setItemFullyFunctionalActive] =
    useState(true);
  const [itemFullyFunctionalError, setItemFullyFunctionalError] =
    useState(null);

  const [partsGoodCondition, setPartsGoodCondition] = useState("");
  const [partsGoodConditionActive, setPartsGoodConditionActive] =
    useState(true);
  const [partsGoodConditionError, setPartsGoodConditionError] = useState(null);

  const [providedGuidelines, setProvidedGuidelines] = useState("");
  const [providedGuidelinesActive, setProvidedGuidelinesActive] =
    useState(true);
  const [providedGuidelinesError, setProvidedGuidelinesError] = useState(null);

  const [images, setImages] = useState([]);
  const [imagesError, setImagesError] = useState([]);

  const [saveModalActive, setSaveModalActive] = useState(false);

  const triggerModalActiveClick = () => {
    let hasError = false;

    if (itemMatchesDescriptionActive) {
      if (!itemMatchesDescription || !itemMatchesDescription.trim()) {
        setItemMatchesDescriptionError("Required field");
        hasError = true;
      }

      if (validateBigText(itemMatchesDescription) !== true) {
        setItemMatchesDescriptionError(validateBigText(itemMatchesDescription));
        hasError = true;
      }
    }

    if (itemMatchesPhotosActive) {
      if (!itemMatchesPhotos || !itemMatchesPhotos.trim()) {
        setItemMatchesPhotosError("Required field");
        hasError = true;
      }

      if (validateBigText(itemMatchesPhotos) !== true) {
        setItemMatchesPhotosError(validateBigText(itemMatchesPhotos));
        hasError = true;
      }
    }

    if (itemFullyFunctionalActive) {
      if (!itemFullyFunctional || !itemFullyFunctional.trim()) {
        setItemFullyFunctionalError("Required field");
        hasError = true;
      }

      if (validateBigText(itemFullyFunctional) !== true) {
        setItemFullyFunctionalError(validateBigText(itemFullyFunctional));
        hasError = true;
      }
    }

    if (partsGoodConditionActive) {
      if (!partsGoodCondition || !partsGoodCondition.trim()) {
        setPartsGoodConditionError("Required field");
        hasError = true;
      }

      if (validateBigText(partsGoodCondition) !== true) {
        setPartsGoodConditionError(validateBigText(partsGoodCondition));
        hasError = true;
      }
    }

    if (providedGuidelinesActive) {
      if (!providedGuidelines || !providedGuidelines.trim()) {
        setProvidedGuidelinesError("Required field");
        hasError = true;
      }

      if (validateBigText(providedGuidelines) !== true) {
        setProvidedGuidelinesError(validateBigText(providedGuidelines));
        hasError = true;
      }
    }

    if (images.length < 1) {
      setImagesError("Required field");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setSaveModalActive(true);
  };

  const onDrop = (acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setImagesError(fileRejections[0]["errors"][0].message);
      return;
    }

    setImagesError(null);

    if (images.length + acceptedFiles.length <= 5) {
      setImages((prevImages) => [...prevImages, ...acceptedFiles]);
    } else {
      error.set("You can only upload up to 5 images.");
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagesError(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: STATIC.ACCEPT_IMAGE_FORMAT,
    maxSize: STATIC.LIMITS.FILE_SIZE,
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleApprove = async () => {
    let submitFunction = approveClientGotListing;
    let token = order.acceptListingTenantToken;

    if (type == "finish") {
      submitFunction = finishedByOwner;
      token = order.acceptListingOwnerToken;
    }

    const formData = new FormData();

    images.forEach((image, index) =>
      formData.append(`images[index][${index}]`, image)
    );

    formData.append("token", token);
    formData.append("itemMatchesDescription", itemMatchesDescription);
    formData.append("itemMatchesPhotos", itemMatchesPhotos);
    formData.append("itemFullyFunctional", itemFullyFunctional);
    formData.append("partsGoodCondition", partsGoodCondition);
    formData.append("providedGuidelines", providedGuidelines);

    try {
      await submitFunction(formData, authToken);

      onSubmit();
    } catch (e) {
      error.set(e.message);
    }
  };

  return (
    <div className="add-listings-box">
      <h3>Checklist</h3>

      <QuestionInput
        name="itemMatchesDescription"
        value={itemMatchesDescription}
        setValue={setItemMatchesDescription}
        valueError={itemMatchesDescriptionError}
        setValueError={setItemMatchesDescriptionError}
        active={itemMatchesDescriptionActive}
        setActive={setItemMatchesDescriptionActive}
        label="Can you confirm the that the item matches the description provided in the listing?"
        placeholder="Describe in detail the reason for your answer"
      />

      <div
        {...getRootProps()}
        className="dropzone add-listings-box p-0"
        style={{ boxShadow: "none" }}
      >
        <input name="modalImage" {...getInputProps()} />

        <p>
          Please upload clear, date stamped photos of the item within the last
          24 hours, highlighting all sides and any existing damage or
          imperfections and also showing the serial number.
          <br />
          <small>
            You can add maximum 5 files with maximum summary size 20 MB
          </small>
        </p>

        <div
          className="row"
          style={{
            width: "100%",
            background: "#f9f9f9",
            cursor: "pointer",
            minHeight: "233px",
            marginLeft: "0",
            marginRight: "0",
          }}
        >
          <div
            className="col-12 text-center"
            style={{
              color: "#AAAAAA",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: images.length > 0 ? "40px" : "inherit",
            }}
          >
            {isMobile
              ? "Click to select files"
              : "Click or drag and drop to select files"}
          </div>

          {images.map((image, index) => (
            <ImageView
              key={index}
              path={URL.createObjectURL(image)}
              removeFile={() => removeImage(index)}
            />
          ))}
        </div>

        {imagesError && (
          <div className="row">
            <div className="col-12 form-group">
              <div className="is-invalid" style={{ marginBottom: "10px" }}>
                <ErrorSpan error={imagesError} />
              </div>
            </div>
          </div>
        )}
      </div>

      <QuestionInput
        name="itemMatchesPhotos"
        value={itemMatchesPhotos}
        setValue={setItemMatchesPhotos}
        valueError={itemMatchesPhotosError}
        setValueError={setItemMatchesPhotosError}
        active={itemMatchesPhotosActive}
        setActive={setItemMatchesPhotosActive}
        label="Do the photos provided accurately represent the current state of the item?"
        placeholder="Describe in detail the reason for your answer"
      />

      <QuestionInput
        name="itemFullyFunctional"
        value={itemFullyFunctional}
        setValue={setItemFullyFunctional}
        valueError={itemFullyFunctionalError}
        setValueError={setItemFullyFunctionalError}
        active={itemFullyFunctionalActive}
        setActive={setItemFullyFunctionalActive}
        label="Can you confirm that the item is fully functional and meets the described specifications?"
        placeholder="Describe in detail the reason for your answer"
      />

      <QuestionInput
        name="partsGoodCondition"
        value={partsGoodCondition}
        setValue={setPartsGoodCondition}
        valueError={partsGoodConditionError}
        setValueError={setPartsGoodConditionError}
        active={partsGoodConditionActive}
        setActive={setPartsGoodConditionActive}
        label="Are all the listed accessories and parts present and in good condition?"
        placeholder="Describe in detail the reason for your answer"
      />

      <QuestionInput
        name="providedGuidelines"
        value={providedGuidelines}
        setValue={setProvidedGuidelines}
        valueError={providedGuidelinesError}
        setValueError={setProvidedGuidelinesError}
        active={providedGuidelinesActive}
        setActive={setProvidedGuidelinesActive}
        label="Do you understand how to use the item properly and follow the provided guidelines?"
        placeholder="Describe in detail the reason for your answer"
      />

      <div className="order_widget">
        <div className="booking-operations form-group">
          <button
            className="default-btn"
            type="button"
            onClick={triggerModalActiveClick}
          >
            {type == "finish" ? "Finish" : "Approve"}
          </button>
        </div>
      </div>

      {type != "finish" && (
        <TenantGotListingApproveModal
          onApprove={handleApprove}
          modalActive={saveModalActive}
          closeModal={() => setSaveModalActive(false)}
        />
      )}

      {type == "finish" && (
        <FinishOrderModal
          modalActive={saveModalActive}
          closeModal={() => setSaveModalActive(false)}
          onFinish={handleApprove}
        />
      )}
    </div>
  );
};

export default ChecklistForm;
