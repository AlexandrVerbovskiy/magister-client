import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import React, { useState, useContext } from "react";
import lodash from "lodash";

import { authSideProps } from "../../../middlewares";
import { createListing, getCreateListingOptions } from "../../../services";

import {
  uniqueId,
  validateBigText,
  validateInteger,
  validatePrice,
  validateSmallText,
} from "../../../utils";
import EditMap from "../../../components/Listings/EditMap";
import SelectWithIcon from "../../../components/FormComponents/SelectWithIcon";
import InputWithIcon from "../../../components/FormComponents/InputWithIcon";
import ErrorIconWrapper from "../../../components/FormComponents/ErrorIconWrapper";
import TextareaWithIcon from "../../../components/FormComponents/TextareaWithIcon";
import EditPhotosSection from "../../../components/Listings/EditPhotosSection";
import { IndiceContext } from "../../../contexts";

const cityCoords = {
  Warrington: { lat: 53.48095, lng: -2.23743 },
  Manchester: { lat: 53.390044, lng: -2.59695 },
};

const baseRadius = 500;

const cityOptions = [
  { value: "Warrington", label: "Warrington" },
  { value: "Manchester", label: "Manchester" },
];

const baseCity = cityOptions[0]["value"];

const AddListing = ({ categories, listing = {} }) => {
  const { success, authToken } = useContext(IndiceContext);

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

  const baseCategoryKey = Object.keys(categorizedCategories).filter(
    (key) =>
      categorizedCategories[key].popular.length ||
      categorizedCategories[key].unpopular.length
  )[0];

  const baseCategory = baseCategoryKey
    ? (
        categorizedCategories[baseCategoryKey].popular[0] ??
        categorizedCategories[baseCategoryKey].unpopular[0]
      ).id
    : "";

  const [files, setFiles] = useState([]);
  const [linkFiles, setLinkFiles] = useState([]);

  const removeFile = (localIdToRemove, type) => {
    if (type == "storage") {
      const newFiles = files.filter((file) => file.localId !== localIdToRemove);
      setFiles(newFiles);
    }

    if (type == "url") {
      const newLinkFiles = linkFiles.filter(
        (file) => file.localId !== localIdToRemove
      );
      setLinkFiles(newLinkFiles);
    }
  };

  const [photoPopupActive, setPhotoPopupActive] = useState(false);
  const [photoPopupPhoto, setPhotoPopupPhoto] = useState(null);
  const [photoPopupLink, setPhotoPopupLink] = useState("null");
  const [photoPopupType, setPhotoPopupType] = useState("storage");
  const [photoPopupLocalFileId, setPhotoPopupLocalFileId] = useState(null);

  const handleClosePhotoPopup = () => {
    setPhotoPopupLink("");
    setPhotoPopupType("storage");
    setPhotoPopupPhoto(null);
    setPhotoPopupActive(null);
    setPhotoPopupLocalFileId(null);
  };

  const adaptLinkPropsToLocal = (list) =>
    list.map((info) => ({
      link: info.link,
      localId: uniqueId(),
      type: info.type,
      date: Date.now(),
    }));

  const handlePhotoAddByPopup = () => {
    if (photoPopupType === "storage") {
      let found = null;
      let date = Date.now();

      if (photoPopupLocalFileId) {
        const newFiles = files.map((file) => {
          if (file.localId != photoPopupLocalFileId) return file;

          found = { ...file, preview: URL.createObjectURL(photoPopupPhoto) };
          return found;
        });

        setFiles(newFiles);
      }

      if (photoPopupLocalFileId && !found) {
        const file = linkFiles.filter(
          (file) => file.localId == photoPopupLocalFileId
        )[0];

        if (file) {
          date = file.date;
        }

        const newLinkFiles = linkFiles.filter(
          (file) => file.localId != photoPopupLocalFileId
        );
        setLinkFiles(newLinkFiles);
      }

      if (!photoPopupLocalFileId || !found) {
        setFiles((prev) => [
          ...prev,
          Object.assign(photoPopupPhoto, {
            preview: URL.createObjectURL(photoPopupPhoto),
            localId: uniqueId(),
            date,
          }),
        ]);
      }
    } else {
      let found = null;
      let date = Date.now();

      if (photoPopupLocalFileId) {
        const newLinkFiles = linkFiles.map((file) => {
          if (file.localId != photoPopupLocalFileId) return file;

          found = { ...file, link: photoPopupPhoto, type: "url" };
          return found;
        });

        setLinkFiles(newLinkFiles);
      }

      if (photoPopupLocalFileId && !found) {
        const file = files.filter(
          (file) => file.localId == photoPopupLocalFileId
        )[0];

        if (file) {
          date = file.date;
        }

        const newFiles = files.filter(
          (file) => file.localId != photoPopupLocalFileId
        );

        setFiles(newFiles);
      }

      if (!photoPopupLocalFileId || !found) {
        setLinkFiles((prev) => [
          ...prev,
          {
            link: photoPopupLink,
            localId: uniqueId(),
            type: "url",
            date,
          },
        ]);
      }
    }

    handleClosePhotoPopup();
  };

  const [disabled, setDisabled] = useState(false);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

  const [keyWords, setKeyWords] = useState("");
  const [keyWordsError, setKeyWordsError] = useState(null);

  const [category, setCategory] = useState(baseCategory);
  const [categoryError, setCategoryError] = useState(null);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);

  const [rentalTerms, setRentalTerms] = useState("");
  const [rentalTermsError, setRentalTermsError] = useState(null);

  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState(null);

  const [city, setCity] = useState(baseCity);

  const [compensationCost, setCompensationCost] = useState("");
  const [compensationCostError, setCompensationCostError] = useState(null);

  const [countStoredItems, setCountStoredItems] = useState("");
  const [countStoredItemsError, setCountStoredItemsError] = useState(null);

  const [pricePerDay, setPricePerDay] = useState("");
  const [pricePerDayError, setPricePerDayError] = useState(null);

  const [minRentalDays, setMinRentalDays] = useState("");
  const [minRentalDaysError, setMinRentalDaysError] = useState(null);

  const [center, setCenter] = useState({
    lat: cityCoords[baseCity].lat,
    lng: cityCoords[baseCity].lng,
  });
  const [markerActive, setMarkerActive] = useState(false);

  const [lat, setLat] = useState(cityCoords[baseCity].lat);
  const [lng, setLng] = useState(cityCoords[baseCity].lng);
  const [radius, setRadius] = useState(baseRadius);

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

  const handleChangeCity = (e) => {
    const city = e.target.value;
    const lat = cityCoords[city].lat;
    const lng = cityCoords[city].lng;

    setCity(city);
    setCenter({ lat, lng });
    setLat(lat);
    setLng(lng);
    setRadius(baseRadius);
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

  const listingToState = () => {
    const city = listing.city ?? baseCity;
    const lat = (cityCoords[city] ?? cityCoords[baseCity]).lat;
    const lng = (cityCoords[city] ?? cityCoords[baseCity]).lng;

    return {
      name: listing.name ?? "",
      keyWords: listing.keyWords ?? "",
      categoryId: listing.categoryId ?? baseCategory,
      description: listing.description ?? "",
      rentalTerms: listing.rentalTerms ?? "",
      postcode: listing.postcode ?? "",
      city: city,
      compensationCost: listing.compensationCost ?? "",
      countStoredItems: listing.countStoredItems ?? "",
      pricePerDay: listing.pricePerDay ?? "",
      minRentalDays: listing.minRentalDays ?? "",
      rentalLat: lat,
      rentalLng: lng,
      rentalRadius: listing.radius ?? baseRadius,
      listingImages: listing.listingImages ?? [],
    };
  };

  const objectToSave = () => ({
    name,
    keyWords,
    categoryId: category,
    description,
    rentalTerms,
    postcode,
    city,
    compensationCost,
    countStoredItems,
    pricePerDay,
    minRentalDays,
    rentalLat: lat,
    rentalLng: lng,
    rentalRadius: radius,
    listingImages: linkFiles,
  });

  const hasChanges = () => {
    if (files.length > 0) return true;
    const dataToSave = objectToSave();
    const listingToCheck = listingToState();
    return !lodash.isEqual(listingToCheck, dataToSave);
  };

  const handleSubmit = async () => {
    try {
      if (disabled) return;
      setMainError(null);

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

      if (hasChanges()) {
        const formData = new FormData();

        if (files) {
          files.forEach((file, index) =>
            formData.append(`files[${index}]`, file)
          );
        }

        const info = objectToSave();
        info["listingImages"] = JSON.stringify(info["listingImages"]);
        Object.keys(info).forEach((key) => formData.append(key, info[key]));

        const res = await createListing(formData, authToken);

        setFiles([]);
        setLinkFiles(adaptLinkPropsToLocal(res.listingImages));

        success.set("Created successfully");
      } else {
        success.set("Created successfully");
        return true;
      }
    } catch (e) {
      setMainError(e.message);
    } finally {
      setDisabled(false);
    }
  };

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
              <InputWithIcon
                label="Title:"
                icon="bx bx-briefcase-alt"
                placeholder="Name of your tool"
                value={name}
                onInput={handleChangeName}
                error={nameError}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <ErrorIconWrapper
                icon="bx bx-duplicate"
                label="Category:"
                error={categoryError}
              >
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
              </ErrorIconWrapper>
            </div>

            <div className="col-lg-6 col-md-6">
              <InputWithIcon
                label="Keywords:"
                icon="bx bxs-key"
                placeholder="Maximum 15 , should be separated by commas"
                value={keyWords}
                onInput={handleChangeKeyWords}
                error={keyWordsError}
              />
            </div>
          </div>
        </div>

        <div className="add-listings-box">
          <h3>Pricing</h3>

          <div className="row">
            <div className="col-lg-6 col-md-6">
              <InputWithIcon
                label="Rental price per day:"
                icon="bx bx-purchase-tag"
                placeholder="12.00"
                value={pricePerDay}
                onInput={handleChangePricePerDay}
                error={pricePerDayError}
              />
            </div>
            <div className="col-lg-6 col-md-6">
              <InputWithIcon
                label="Item value:"
                icon="bx bx-purchase-tag"
                placeholder="532.00"
                value={compensationCost}
                onInput={handleChangeCompensationCost}
                error={compensationCostError}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputWithIcon
                label="Min rental days:"
                icon="bx bx-menu-alt-left"
                placeholder="0"
                value={minRentalDays}
                onInput={handleChangeMinRentalDays}
                error={minRentalDaysError}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputWithIcon
                label="Quantity:"
                icon="bx bx-menu-alt-left"
                placeholder="1"
                value={countStoredItems}
                onInput={handleChangeCountStoredItems}
                error={countStoredItemsError}
              />
            </div>
          </div>
        </div>

        <div className="add-listings-box">
          <h3>Location</h3>

          <div className="row">
            <div className="col-lg-6 col-md-6">
              <SelectWithIcon
                onChange={handleChangeCity}
                value={city}
                label="City:"
                icon="bx bx-menu-alt-left"
                options={cityOptions}
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputWithIcon
                label="Postcode:"
                icon="bx bx-menu-alt-left"
                placeholder="e.g. 55 County Laois"
                value={postcode}
                onInput={handleChangePostcode}
                error={postcodeError}
              />
            </div>
          </div>

          <EditMap
            markerActive={markerActive}
            setMarkerActive={setMarkerActive}
            center={center}
            setCenter={setCenter}
            lat={lat}
            setLat={setLat}
            lng={lng}
            setLng={setLng}
            radius={radius}
            setRadius={setRadius}
          />
        </div>

        <EditPhotosSection
          files={files}
          linkFiles={linkFiles}
          removeFile={removeFile}
          photoPopupLink={photoPopupLink}
          photoPopupActive={photoPopupActive}
          setPhotoPopupActive={setPhotoPopupActive}
          setPhotoPopupLink={setPhotoPopupLink}
          setPhotoPopupPhoto={setPhotoPopupPhoto}
          handlePhotoAddByPopup={handlePhotoAddByPopup}
          photoPopupType={photoPopupType}
          setPhotoPopupType={setPhotoPopupType}
          photoPopupLocalFileId={photoPopupLocalFileId}
          setPhotoPopupLocalFileId={setPhotoPopupLocalFileId}
          handleClosePhotoPopup={handleClosePhotoPopup}
          photoPopupPhoto={photoPopupPhoto}
          setFiles={setFiles}
        />

        <div className="add-listings-box">
          <h3>Details</h3>

          <div className="row">
            <div className="col-lg-12 col-md-12">
              <TextareaWithIcon
                value={description}
                onChange={handleChangeDescription}
                icon="bx bx-text"
                label="How Item Is Stored:"
                error={descriptionError}
                placeholder="Details..."
              />
            </div>
          </div>
        </div>

        <div className="add-listings-box">
          <h3>Rental Terms</h3>

          <div className="row">
            <div className="col-lg-12 col-md-12">
              <TextareaWithIcon
                value={rentalTerms}
                onChange={handleChangeRentalTerms}
                icon="bx bx-text"
                label="Rental Terms:"
                error={rentalTermsError}
                placeholder="Terms..."
              />
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
