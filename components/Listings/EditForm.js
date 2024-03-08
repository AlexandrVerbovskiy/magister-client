import Link from "next/link";
import NavbarThree from "../_App/NavbarThree";
import DashboardNavbar from "../Dashboard/DashboardNavbar";
import React, { useState, useContext, useEffect } from "react";
import lodash from "lodash";
import STATIC from "../../static";

import {
  uniqueId,
  validateBigText,
  validateInteger,
  validatePrice,
  validateSmallText,
} from "../../utils";
import EditMap from "../Listings/EditMap";
import SelectWithIcon from "../FormComponents/SelectWithIcon";
import InputWithIcon from "../FormComponents/InputWithIcon";
import ErrorIconWrapper from "../FormComponents/ErrorIconWrapper";
import TextareaWithIcon from "../FormComponents/TextareaWithIcon";
import EditPhotosSection from "../Listings/EditPhotosSection";
import { IndiceContext } from "../../contexts";
import { useListingPhotosEdit } from "../../hooks";
import CategorySelect from "./CategorySelect";
import YesNoModal from "../_App/YesNoModal";
import { createListingApprovalRequest } from "../../services";

const cityOptions = [
  { value: "Warrington", label: "Warrington" },
  { value: "Manchester", label: "Manchester" },
];

const baseCity = cityOptions[0]["value"];

const EditForm = ({
  categories,
  listing,
  save,
  messageOnSuccess,
  canSendRequest,
  setCanSendRequest,
  rejectDescription,
  clearRejectDescription,
}) => {
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

  const {
    adaptLinkPropsToLocal,
    files,
    linkFiles,
    removeFile,
    photoPopupLink,
    photoPopupActive,
    setPhotoPopupActive,
    setPhotoPopupLink,
    setPhotoPopupPhoto,
    handlePhotoAddByPopup,
    photoPopupType,
    setPhotoPopupType,
    photoPopupLocalFileId,
    setPhotoPopupLocalFileId,
    handleClosePhotoPopup,
    photoPopupPhoto,
    setFiles,
    setLinkFiles,
    fileError,
    setFileError,
  } = useListingPhotosEdit();

  const [disabled, setDisabled] = useState(false);
  const [sendRequestDisabled, setSendRequestDisabled] = useState(false);
  const [activeSentRequestPopup, setActiveSentRequestPopup] = useState(false);

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
    lat: STATIC.cityCoords[baseCity].lat,
    lng: STATIC.cityCoords[baseCity].lng,
  });
  const [markerActive, setMarkerActive] = useState(false);

  const [lat, setLat] = useState(STATIC.cityCoords[baseCity].lat);
  const [lng, setLng] = useState(STATIC.cityCoords[baseCity].lng);
  const [radius, setRadius] = useState(STATIC.baseListingMapCircleRadius);

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
    setCategory(e.value);
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
    const city = e.value;
    const lat = STATIC.cityCoords[city].lat;
    const lng = STATIC.cityCoords[city].lng;

    setCity(city);
    setCenter({ lat, lng });
    setLat(lat);
    setLng(lng);
    setRadius(STATIC.baseListingMapCircleRadius);
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
    const lat = (STATIC.cityCoords[city] ?? STATIC.cityCoords[baseCity]).lat;
    const lng = (STATIC.cityCoords[city] ?? STATIC.cityCoords[baseCity]).lng;

    const listingImages = (listing.listingImages ?? []).map((elem) => ({
      link: elem.link,
      type: elem.type,
    }));

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
      rentalRadius: listing.radius ?? STATIC.baseListingMapCircleRadius,
      listingImages,
    };
  };

  const objectToSave = () => {
    const listingImages = linkFiles.map((elem) => ({
      link: elem.link,
      type: elem.type,
    }));

    return {
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
      listingImages,
    };
  };

  useEffect(() => {
    const data = listingToState();
    setName(data.name);
    setKeyWords(data.keyWords);
    setCategory(data.categoryId);
    setDescription(data.description);
    setRentalTerms(data.rentalTerms);
    setPostcode(data.postcode);
    setCity(data.city);
    setCompensationCost(data.compensationCost);
    setCountStoredItems(data.countStoredItems);
    setPricePerDay(data.pricePerDay);
    setMinRentalDays(data.minRentalDays);
    setLat(data.rentalLat);
    setLng(data.rentalLng);
    setRadius(data.rentalRadius);

    const adaptedImages = data.listingImages.map((image) => ({
      ...image,
      date: Date.now(),
      localId: uniqueId(),
    }));

    setLinkFiles(adaptedImages);
  }, [listing]);

  const hasChanges = () => {
    if (files.length > 0) return true;
    const dataToSave = objectToSave();
    const listingToCheck = listingToState();
    return !lodash.isEqual(listingToCheck, dataToSave);
  };

  const formDataToSave = () => {
    const formData = new FormData();

    if (files) {
      files.forEach((file, index) => formData.append(`files[${index}]`, file));
    }

    const info = objectToSave();
    info["listingImages"] = JSON.stringify(info["listingImages"]);
    Object.keys(info).forEach((key) => formData.append(key, info[key]));

    return formData;
  };

  const handleSubmit = async (needShowMessage = true) => {
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

      if (files.length + linkFiles.length < 1) {
        setFileError("At least one photo is required");
        hasError = true;
      }

      if (compensationCost && validatePrice(compensationCost) !== true) {
        setCompensationCostError(validatePrice(compensationCost));
        hasError = true;
      }

      if (hasError) return false;

      setDisabled(true);

      if (hasChanges()) {
        const formData = formDataToSave();
        const res = await save(formData, authToken);
        setFiles([]);
        setLinkFiles(adaptLinkPropsToLocal([...res.listingImages]));
      }

      if (needShowMessage) {
        success.set(messageOnSuccess);
      }

      return true;
    } catch (e) {
      setMainError(e.message);
      return false;
    } finally {
      setDisabled(false);
    }
  };

  const handleSendRequestToApprove = async () => {
    if (disabled || sendRequestDisabled || !listing.id) return;

    setSendRequestDisabled(true);

    try {
      const canSent = await handleSubmit(false);

      if (canSent) {
        await createListingApprovalRequest(listing.id, authToken);
        success.set("The request was sent successfully");
        setCanSendRequest(false);
        clearRejectDescription();
      }
    } catch (e) {
      setMainError(e.message);
    } finally {
      setSendRequestDisabled(false);
    }
  };

  const activateSendRequestPopup = (e) => {
    e.preventDefault();
    setActiveSentRequestPopup(true);
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

        {rejectDescription && (
          <div
            className="alert-dismissible fade show alert alert-danger"
            role="alert"
          >
            <b>Rejected feedback: </b> {rejectDescription}
          </div>
        )}

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
                <CategorySelect
                  categorizedCategories={categorizedCategories}
                  category={category}
                  categoryError={categoryError}
                  handleChangeCategory={handleChangeCategory}
                />
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
                isSearchable={false}
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
          fileError={fileError}
          setFileError={setFileError}
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

        <div className="add-listings-box footer-section">
          <div className="d-flex gap-2 justify-content-between">
            <button type="button" disabled={disabled} onClick={handleSubmit}>
              Submit Listings
            </button>

            {canSendRequest && (
              <button
                type="button"
                onClick={activateSendRequestPopup}
                disabled={sendRequestDisabled}
              >
                Send Request To Approve
              </button>
            )}
          </div>
        </div>

        <YesNoModal
          active={activeSentRequestPopup}
          toggleActive={() => setActiveSentRequestPopup(false)}
          onAccept={handleSendRequestToApprove}
          title="Confirm Action"
          body={"Confirmation is required to send a listing approval request"}
          acceptText="Send"
        />
      </div>
    </>
  );
};

export default EditForm;
