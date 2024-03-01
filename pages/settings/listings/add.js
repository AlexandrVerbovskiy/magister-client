import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from "@react-google-maps/api";
import { useDropzone } from "react-dropzone";

import { authSideProps } from "../../../middlewares";
import { getCreateListingOptions } from "../../../services";
import ErrorSpan from "../../../components/ErrorSpan";

import ENV from "../../../env";
import {
  validateBigText,
  validateInteger,
  validatePrice,
  validateSmallText,
} from "../../../utils";
import BaseModal from "../../../components/_App/BaseModal";

const baseMarker = {
  lat: 44.076613,
  lng: -98.362239833,
  radius: 5000,
};

const AddListing = ({ categories }) => {
  const levels = [
    { name: "firstLevel", label: "First level" },
    { name: "secondLevel", label: "Second level" },
    { name: "thirdLevel", label: "Third level" },
  ];

  const categorizedCategories = levels.reduce((result, level) => {
    result[level.name] = {
      label: level.label,
      popular: categories[level.name].filter((category) => category.popular),
      unpopular: categories[level.name].filter((category) => !category.popular),
    };
    return result;
  }, {});

  const [files, setFiles] = useState([]);
  const [photoInfo, setPhotoInfo] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop: (acceptedFiles) => {
      let newFiles = acceptedFiles.slice(0, 5 - files.length);
      setFiles((prev) => [
        ...prev,
        ...newFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
      acceptedFiles = [];
    },
  });

  const removeFile = (indexToRemove) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(newFiles);
  };

  const [photoPopupActive, setPhotoPopupActive] = useState(false);
  const [photoPopupLinkType, setPhotoPopupLinkType] = useState("storage");
  const [photoPopupPhoto, setPhotoPopupPhoto] = useState(null);
  const [photoPopupLink, setPhotoPopupLink] = useState(null);

  const handleClosePhotoPopup = () => {
    setPhotoPopupLinkType("storage");
    setPhotoPopupPhoto(null);
    setPhotoPopupActive(null);
  };

  const handlePhotoAddByPopup = () => {
    if (photoPopupLinkType === "storage") {
      setFiles((prev) => [
        ...prev,
        Object.assign(photoPopupPhoto, {
          preview: URL.createObjectURL(photoPopupPhoto),
        }),
      ]);
    } else {
      setPhotoInfo((prev) => [
        ...prev,
        {
          type: photoPopupLinkType,
          path: photoPopupPhoto,
        },
      ]);
    }
    handleClosePhotoPopup();
  };

  const [disabled, setDisabled] = useState(false);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

  const [keyWords, setKeyWords] = useState("");
  const [keyWordsError, setKeyWordsError] = useState(null);

  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState(null);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);

  const [rentalTerms, setRentalTerms] = useState("");
  const [rentalTermsError, setRentalTermsError] = useState(null);

  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState(null);

  const [country, setCountry] = useState("New York");

  const [compensationCost, setCompensationCost] = useState("");
  const [compensationCostError, setCompensationCostError] = useState(null);

  const [countStoredItems, setCountStoredItems] = useState("");
  const [countStoredItemsError, setCountStoredItemsError] = useState(null);

  const [pricePerDay, setPricePerDay] = useState("");
  const [pricePerDayError, setPricePerDayError] = useState(null);

  const [minRentalDays, setMinRentalDays] = useState("");
  const [minRentalDaysError, setMinRentalDaysError] = useState(null);

  const mapRef = useRef(null);
  const circleRef = useRef(null);
  const markerRef = useRef(null);

  const [center, setCenter] = useState({
    lat: baseMarker.lat,
    lng: baseMarker.lng,
  });
  const [markerActive, setMarkerActive] = useState(false);

  const [lat, setLat] = useState(baseMarker.lat);
  const [lng, setLng] = useState(baseMarker.lng);
  const [radius, setRadius] = useState(baseMarker.radius);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: ENV.GOOGLE_MAP_API_KEY,
  });

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onUnmount = function callback(map) {
    mapRef.current = null;
  };

  const [mainError, setMainError] = useState(null);

  const handleChangeName = (e) => {
    setName(e.target.value);
    setNameError(null);
    setMainError(null);
  };

  const handleChangeKeyWords = (e) => {
    setKeyWords(e.target.value);
    setKeyWordsError(null);
    setMainError(null);
  };

  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
    setCategoryError(null);
    setMainError(null);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
    setDescriptionError(null);
    setMainError(null);
  };

  const handleChangeRentalTerms = (e) => {
    setRentalTerms(e.target.value);
    setRentalTermsError(null);
    setMainError(null);
  };

  const handleChangeCountry = (e) => {
    setCountry(e.target.value);
    setMainError(null);
  };

  const handleChangePostcode = (e) => {
    setPostcode(e.target.value);
    setPostcodeError(null);
    setMainError(null);
  };

  const handleChangeCompensationCost = (e) => {
    setCompensationCost(e.target.value);
    setCompensationCostError(null);
    setMainError(null);
  };

  const handleChangeCountStoredItems = (e) => {
    setCountStoredItems(e.target.value);
    setCountStoredItemsError(null);
    setMainError(null);
  };

  const handleChangePricePerDay = (e) => {
    setPricePerDay(e.target.value);
    setPricePerDayError(null);
    setMainError(null);
  };

  const handleChangeMinRentalDays = (e) => {
    setMinRentalDays(e.target.value);
    setMinRentalDaysError(null);
    setMainError(null);
  };

  const handleSubmit = async () => {
    try {
      if (disabled) return;

      let hasError = false;

      if (!name) {
        setNameError("Required field");
        hasError = true;
      }

      if (name && validateSmallText(name) !== true) {
        setNameError(validateSmallText(name));
        hasError = true;
      }

      if (!keyWords) {
        setKeyWordsError("Required field");
        hasError = true;
      }

      if (keyWords && validateBigText(keyWords) !== true) {
        setNameError(validateBigText(keyWords));
        hasError = true;
      }

      if (!category) {
        setCategoryError("Required field");
        hasError = true;
      }

      if (!postcode) {
        setPostcodeError("Required field");
        hasError = true;
      }

      if (postcode && validateSmallText(postcode) !== true) {
        setPostcodeError(validateSmallText(postcode));
        hasError = true;
      }

      if (minRentalDays && validateInteger(minRentalDays) !== true) {
        setMinRentalDaysError(validateInteger(minRentalDays));
        hasError = true;
      }

      if (!countStoredItems) {
        setCountStoredItemsError("Required field");
        hasError = true;
      }

      if (countStoredItems && validateInteger(countStoredItems) !== true) {
        setCountStoredItemsError(validateInteger(countStoredItems));
        hasError = true;
      }

      if (description && validateBigText(description) !== true) {
        setDescriptionError(validateBigText(description));
        hasError = true;
      }

      if (rentalTerms && validateBigText(rentalTerms) !== true) {
        setRentalTermsError(validateBigText(rentalTerms));
        hasError = true;
      }

      if (!pricePerDay) {
        setPricePerDayError("Required field");
        hasError = true;
      }

      if (pricePerDay && validatePrice(pricePerDay) !== true) {
        setPricePerDayError(validatePrice(pricePerDay));
        hasError = true;
      }

      if (!compensationCost) {
        setCompensationCostError("Required field");
        hasError = true;
      }

      if (compensationCost && validatePrice(compensationCost) !== true) {
        setCompensationCostError(validatePrice(compensationCost));
        hasError = true;
      }

      if (hasError) return;

      setDisabled(true);
    } catch (e) {
      setMainError(e.message);
    } finally {
      setDisabled(false);
    }
  };

  if (!isLoaded) return <></>;

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="breadcrumb-area">
          <h1>Add Listings</h1>
          <ol className="breadcrumb">
            <li className="item">
              <Link href="/">Home</Link>
            </li>
            <li className="item">
              <Link href="/settings/">Settings</Link>
            </li>
            <li className="item">
              <Link href="/settings/listings">Listings</Link>
            </li>
            <li className="item">Add Listings</li>
          </ol>
        </div>

        <div className="add-listings-box">
          <h3>Basic Informations</h3>

          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="form-group">
                <label>
                  <i className="bx bx-briefcase-alt"></i> Listing Title:
                </label>
                <input
                  value={name}
                  onInput={handleChangeName}
                  type="text"
                  className={`form-control ${nameError ? "is-invalid" : ""}`}
                  placeholder="Name of your tool"
                />
                <ErrorSpan error={nameError} />
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>
                  <i className="bx bx-duplicate"></i> Type / Category:
                </label>
                <select
                  className={`dashbaord-category-select listing-category-select ${
                    categoryError ? "is-invalid" : ""
                  }`}
                  value={category}
                  onChange={handleChangeCategory}
                >
                  <option value="" disabled style={{ display: "none" }}>
                    Select Category
                  </option>
                  {Object.keys(categorizedCategories).map((level) => {
                    const categoryInfo = categorizedCategories[level];

                    const popularLabel = categoryInfo.label + " popular";
                    const unpopularLabel = categoryInfo.label;

                    const popularSection = categoryInfo.popular.length ? (
                      <optgroup label={popularLabel}>
                        {categoryInfo.popular.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </optgroup>
                    ) : (
                      <></>
                    );

                    const unpopularSection = categoryInfo.unpopular.length ? (
                      <optgroup label={unpopularLabel}>
                        {categoryInfo.unpopular.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </optgroup>
                    ) : (
                      <></>
                    );

                    return (
                      <React.Fragment key={level}>
                        {popularSection}
                        {unpopularSection}
                      </React.Fragment>
                    );
                  })}
                </select>
                <ErrorSpan error={categoryError} />
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>
                  <i className="bx bxs-key"></i> Keywords:
                </label>
                <input
                  value={keyWords}
                  onInput={handleChangeKeyWords}
                  type="text"
                  className={`form-control ${
                    keyWordsError ? "is-invalid" : ""
                  }`}
                  placeholder="Maximum 15 , should be separated by commas"
                />
                <ErrorSpan error={keyWordsError} />
              </div>
            </div>
          </div>
        </div>

        <div className="add-listings-box">
          <h3>Pricing</h3>

          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>
                  <i className="bx bx-purchase-tag"></i> Pricing per day:
                </label>
                <input
                  type="text"
                  value={pricePerDay}
                  onInput={handleChangePricePerDay}
                  className={`form-control ${
                    pricePerDayError ? "is-invalid" : ""
                  }`}
                  placeholder="12.00"
                />
                <ErrorSpan error={pricePerDayError} />
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>
                  <i className="bx bx-purchase-tag"></i> Compensation price:
                </label>
                <input
                  type="text"
                  value={compensationCost}
                  onInput={handleChangeCompensationCost}
                  className={`form-control ${
                    compensationCostError ? "is-invalid" : ""
                  }`}
                  placeholder="542.00"
                />
                <ErrorSpan error={compensationCostError} />
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>
                  <i className="bx bx-menu-alt-left"></i> Minimal rent days:
                </label>
                <input
                  type="text"
                  value={minRentalDays}
                  onInput={handleChangeMinRentalDays}
                  className={`form-control ${
                    minRentalDaysError ? "is-invalid" : ""
                  }`}
                  placeholder="-"
                />
                <ErrorSpan error={minRentalDaysError} />
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>
                  <i className="bx bx-menu-alt-left"></i> Count tools:
                </label>
                <input
                  type="text"
                  value={countStoredItems}
                  onInput={handleChangeCountStoredItems}
                  className={`form-control ${
                    countStoredItemsError ? "is-invalid" : ""
                  }`}
                  placeholder="1"
                />
                <ErrorSpan error={countStoredItemsError} />
              </div>
            </div>
          </div>
        </div>

        <div className="add-listings-box">
          <h3>Location</h3>

          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>
                  <i className="bx bx-menu-alt-left"></i> Country:
                </label>
                <select
                  onChange={handleChangeCountry}
                  value={country}
                  className="dashbaord-category-select"
                >
                  <option value="New York">New York</option>
                  <option value="London">London</option>
                </select>
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>
                  <i className="bx bx-menu-alt-left"></i> Postcode:
                </label>
                <input
                  value={postcode}
                  onInput={handleChangePostcode}
                  type="text"
                  className={`form-control ${
                    postcodeError ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. 55 County Laois"
                />
                <ErrorSpan error={postcodeError} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <GoogleMap
              center={center}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
              mapContainerStyle={{ height: "400px", width: "100%" }}
              className="my-map"
              onRightClick={() => setMarkerActive(false)}
              onDragEnd={() => {
                if (!mapRef.current) return;
                const center = mapRef.current.center;
                const lat = center.lat();
                const lng = center.lng();

                setCenter({ lat, lng });
              }}
              onClick={(e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setMarkerActive(true);
                setLat(lat);
                setLng(lng);
              }}
            >
              <Marker
                ref={markerRef}
                position={{ lat: lat, lng: lng }}
                onClick={() => setMarkerActive(true)}
              />
              <Circle
                center={{ lat: lat, lng: lng }}
                radius={radius}
                ref={circleRef}
                onClick={() => setMarkerActive(true)}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#FF0000",
                  fillOpacity: 0.35,
                  draggable: markerActive,
                  editable: markerActive,
                }}
                onRadiusChanged={() => {
                  if (!circleRef.current) return;
                  setRadius(circleRef.current.state.circle.radius);
                }}
                onCenterChanged={() => {
                  if (!circleRef.current) return;

                  const center = circleRef.current.state.circle.center;
                  const newLat = center.lat();
                  const newLng = center.lng();

                  if ((lat == newLat, lng == newLng)) {
                    return;
                  }

                  setLat(lat);
                  setLng(lng);
                }}
                onDrag={(e) => {
                  if (!e) return;
                  const newCenter = e.latLng.toJSON();
                  setLat(newCenter.lat);
                  setLng(newCenter.lng);
                }}
              />
            </GoogleMap>
          </div>
        </div>

        <div {...getRootProps()} className="dropzone add-listings-box">
          <h3>Photos</h3>

          <div className="row" style={{ width: "100%" }}>
            {files.map((file, index) => (
              <div className="col-xl-3 col-lg-4 col-md-6 gallery-flex-parent">
                <div className="invoice-btn-box gallery-flex form-group">
                  <img src={file.preview} />
                  <input {...getInputProps()} />
                  <button
                    type="button"
                    className="default-btn remove-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <i className="flaticon-more"></i>
                  </button>
                </div>
              </div>
            ))}

            {files.length < 5 && (
              <div className="col-xl-3 col-lg-4 col-md-6 gallery-flex-parent">
                <div className="gallery-flex form-group">
                  <div
                    className="add-more-image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoPopupActive(true);
                    }}
                  >
                    Drag 'n' drop some files here, or click to select files
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="add-listings-box">
          <h3>Details</h3>

          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="form-group">
                <label>
                  <i className="bx bx-text"></i> Description:
                </label>
                <textarea
                  cols={30}
                  rows="7"
                  className={`form-control ${
                    descriptionError ? "is-invalid" : ""
                  }`}
                  placeholder="Details..."
                  value={description}
                  onInput={handleChangeDescription}
                ></textarea>
                <ErrorSpan error={descriptionError} />
              </div>
            </div>
          </div>
        </div>

        <div className="add-listings-box">
          <h3>Rental Terms</h3>

          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="form-group">
                <label>
                  <i className="bx bx-text"></i> Rental Terms:
                </label>
                <textarea
                  cols={30}
                  rows="7"
                  className={`form-control ${
                    rentalTermsError ? "is-invalid" : ""
                  }`}
                  placeholder="Terms..."
                  value={rentalTerms}
                  onInput={handleChangeRentalTerms}
                ></textarea>
                <ErrorSpan error={rentalTermsError} />
              </div>
            </div>
          </div>
        </div>

        {mainError && (
          <div
            className="alert-dismissible fade show alert alert-danger"
            role="alert"
          >
            {mainError}
          </div>
        )}

        <div className="add-listings-btn">
          <button type="button" disabled={disabled} onClick={handleSubmit}>
            Submit Listings
          </button>
        </div>
      </div>

      <BaseModal active={photoPopupActive} toggleActive={handleClosePhotoPopup}>
        <span className="sub-title mb-2">
          <span>Photo Popup</span>
        </span>

        <form method="get">
          <div className="form-group">
            <select
              onChange={(e) => setPhotoPopupPhoto(e.target.value)}
              value={photoPopupLinkType}
              className="dashbaord-category-select"
              style={{ marginBottom: "10px" }}
            >
              <option value="storage">Storage</option>
              <option value="instagram">Instagram</option>
              <option value="google_drive">Google Drive</option>
              <option value="dropbox">Dropbox</option>
            </select>

            {photoPopupLinkType !== "storage" && (
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={photoPopupLink}
                  onInput={(e) => setPhotoPopupLink(e.target.value)}
                  placeholder="https://storage.google.com"
                />
              </div>
            )}

            {photoPopupLinkType === "storage" && (
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={photoPopupLink}
                  onInput={(e) => setPhotoPopupLink(e.target.value)}
                  placeholder="test"
                />
              </div>
            )}
          </div>

          <button type="button" onClick={handlePhotoAddByPopup}>
            Add
          </button>
        </form>
      </BaseModal>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const baseSideProps = await authSideProps(context);

  if (baseSideProps.notFound) {
    return {
      notFound: true,
    };
  }

  const options = await getCreateListingOptions(baseSideProps.props.authToken);

  return {
    props: { ...baseSideProps.props, ...options },
  };
};

export default AddListing;
