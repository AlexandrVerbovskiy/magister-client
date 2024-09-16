import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import NavbarThree from "../_App/NavbarThree";
import DashboardNavbar from "../Dashboard/DashboardNavbar";
import lodash from "lodash";
import STATIC from "../../static";
import {
  byteConverter,
  convertToSelectPopupCategories,
  getCityCoords,
  getFilePath,
  onCurrentUserLocation,
  sortListingImages,
  uniqueImageId,
  validateBigText,
  validateInteger,
  validatePrice,
  validateSmallText,
} from "../../utils";
import EditMap from "./EditMap";
import SelectWithIcon from "../FormComponents/SelectWithIcon";
import InputWithIcon from "../FormComponents/InputWithIcon";
import ErrorIconWrapper from "../FormComponents/ErrorIconWrapper";
import TextareaWithIcon from "../FormComponents/TextareaWithIcon";
import EditPhotosSection from "./EditPhotosSection";
import { IndiceContext } from "../../contexts";
import { useCoordsAddress, useListingPhotosEdit } from "../../hooks";
import CategorySelect from "./CategorySelect";
import YesNoModal from "../_App/YesNoModal";
import DeleteModal from "./DeleteModal";
import {
  createListingApprovalRequest,
  changeActiveListing,
} from "../../services";

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
  canChange,
}) => {
  const { success, authToken, error } = useContext(IndiceContext);
  categories = convertToSelectPopupCategories(categories, true);

  let baseCategoryId = categories["firstLevel"][0]?.id ?? null;

  if (baseCategoryId) {
    ["secondLevel", "thirdLevel"].forEach((level) =>
      categories[level].forEach((category) => {
        if (category.parentId == baseCategoryId) baseCategoryId = category.id;
      })
    );
  }

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
    photoPopupError,
    setPhotoPopupError,
    linkSuccessPhoto,
    successLoadLinkPhoto,
  } = useListingPhotosEdit();

  const [disabled, setDisabled] = useState(false);
  const [sendRequestDisabled, setSendRequestDisabled] = useState(false);
  const [changeActiveDisabled, setChangeActiveDisabled] = useState(false);
  const [activeSentRequestPopup, setActiveSentRequestPopup] = useState(false);
  const [activeUpdatePopup, setActiveUpdatePopup] = useState(false);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

  const [category, setCategory] = useState(null);
  const [otherCategory, setOtherCategory] = useState("");
  const [otherCategoryParentId, setOtherCategoryParentId] = useState(null);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);

  const [hasDefects, setHasDefects] = useState(false);
  const [defects, setDefects] = useState("");
  const [defectsError, setDefectsError] = useState(null);

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(null);
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

  const [changePopupActive, setChangePopupActive] = useState(null);

  const [active, setActive] = useState(true);

  const baseCoords = getCityCoords(baseCity);
  const [center, setCenter] = useState(baseCoords);
  const [markerActive, setMarkerActive] = useState(false);

  const [lat, setLat] = useState(baseCoords.lat);
  const [lng, setLng] = useState(baseCoords.lng);
  const [radius, setRadius] = useState(
    STATIC.DEFAULTS.LISTING_MAP_CIRCLE_RADIUS
  );

  const [mainError, setMainError] = useState(null);

  const { getAddressByCoords, getCoordsByAddress } = useCoordsAddress();

  const getAddressByCoordsTimeoutRef = useRef(null);
  const getCoordsByAddressTimeoutRef = useRef(null);

  const handleChangeName = (e) => {
    setName(e.target.value);
    setNameError(null);
    setMainError(null);
  };

  const handleChangeOtherCategory = (e) => {
    setOtherCategory(e.target.value);
    setCategoryError(null);
    setMainError(null);
  };

  const setMainAddressError = (e) => {
    if (e.message.includes("REQUEST_DENIED")) {
      error.set("Information not found");
      return;
    }

    if (e.message.includes("ZERO_RESULTS")) {
      return;
    }

    error.set(e.message);
  };

  const handleChangeAddress = async (event) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
    setAddressError(null);
    setMainError(null);

    if (getCoordsByAddressTimeoutRef.current) {
      clearTimeout(getCoordsByAddressTimeoutRef.current);
    }

    getCoordsByAddressTimeoutRef.current = setTimeout(async () => {
      try {
        const newCoords = await getCoordsByAddress(newAddress);
        if (!newCoords) return;

        setLat(newCoords.lat);
        setLng(newCoords.lng);
        setCenter({ lat: newCoords.lat, lng: newCoords.lng });
      } catch (e) {
        setMainAddressError(e);
      }
    }, 500);
  };

  const handleChangeCoords = async ({ lat: newLat, lng: newLng }) => {
    setLat(newLat);
    setLng(newLng);

    if (getAddressByCoordsTimeoutRef.current) {
      clearTimeout(getAddressByCoordsTimeoutRef.current);
    }

    getAddressByCoordsTimeoutRef.current = setTimeout(async () => {
      try {
        const newAddress = await getAddressByCoords({
          lat: newLat,
          lng: newLng,
        });
        setAddress(newAddress);
      } catch (e) {
        setMainAddressError(e);
      }
    }, 100);
  };

  const handleChangeActive = async () => {
    try {
      if (!canChange) {
        return;
      }

      setChangeActiveDisabled(true);
      const { active } = await changeActiveListing(listing.id, authToken);
      setActive(active);
      success.set(`${name} ${active ? "restored" : "deleted"} successfully`);
    } catch (e) {
      error.set(e.message);
    } finally {
      setChangeActiveDisabled(false);
    }
  };

  const handleChangeCategory = (
    categoryId,
    newOtherCategoryParentId = null
  ) => {
    setCategory(categoryId);
    setIsOtherCategory(categoryId == "-");
    setOtherCategoryParentId(newOtherCategoryParentId);
    setCategoryError(null);
    setMainError(null);

    if (newOtherCategoryParentId != otherCategoryParentId) {
      setOtherCategory("");
    }
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
    setDescriptionError(null);
    setMainError(null);
  };

  const handleChangeDefects = (e) => {
    setDefects(e.target.value);
    setDefectsError(null);
    setMainError(null);
  };

  const handleChangeCity = (e) => {
    const city = e.value;
    const cityCords = getCityCoords(city);

    setCity(city);
    setCenter(cityCords);
    setLat(cityCords.lat);
    setLng(cityCords.lng);
    setRadius(STATIC.DEFAULTS.LISTING_MAP_CIRCLE_RADIUS);
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

  useEffect(() => {
    if (listing.id) return;

    onCurrentUserLocation(({ lat, lng }) => {
      if (listing.id) return;

      setCenter({ lat, lng });
      setLat(lat);
      setLng(lng);
    });
  }, []);

  const listingToState = () => {
    const city = listing.city ?? baseCity;
    const cityCords = getCityCoords(city);

    const lat = listing.rentalLat ? Number(listing.rentalLat) : cityCords.lat;
    const lng = listing.rentalLng ? Number(listing.rentalLng) : cityCords.lng;

    const listingImages = (listing.listingImages ?? []).map((elem) => ({
      link: elem.link,
      type: elem.type,
      id: elem.id,
    }));

    const categoryId = !!listing.otherCategory
      ? undefined
      : listing.categoryId ?? null;

    const data = {
      address: listing.address ?? "",
      name: listing.name ?? "",
      description: listing.description ?? "",
      defects: listing.defects ?? "",
      postcode: listing.postcode ?? "",
      city: city,
      compensationCost: listing.compensationCost ?? "",
      countStoredItems: listing.countStoredItems ?? "",
      pricePerDay: listing.pricePerDay ?? "",
      minRentalDays: listing.minRentalDays ?? "",
      rentalLat: lat,
      rentalLng: lng,
      rentalRadius: listing.radius ?? STATIC.DEFAULTS.LISTING_MAP_CIRCLE_RADIUS,
      listingImages,
      active: listing.active ?? true,
      otherCategory: listing.otherCategory ?? "",
      otherCategoryParentId: listing.otherCategoryParentId ?? null,
    };

    if (categoryId) {
      data["categoryId"] = categoryId;
    }

    return data;
  };

  const objectToSave = () => {
    const listingImages = linkFiles.map((elem) => ({
      link: elem.link,
      type: elem.type,
      id: elem.id,
    }));

    const dataToSave = {
      address: address.trim(),
      name: name.trim(),
      description: description.trim(),
      defects: hasDefects ? defects.trim() : "",
      postcode: postcode.trim(),
      city: city.trim(),
      compensationCost,
      countStoredItems,
      pricePerDay,
      rentalLat: lat,
      rentalLng: lng,
      rentalRadius: radius,
      listingImages,
      active,
    };

    if (`${minRentalDays}`.trim()) {
      dataToSave["minRentalDays"] = minRentalDays;
    }

    if (isOtherCategory) {
      dataToSave["otherCategory"] = otherCategory.trim();
      dataToSave["otherCategoryParentId"] = otherCategoryParentId;
    } else {
      dataToSave["categoryId"] = category;
    }

    return dataToSave;
  };

  useEffect(() => {
    const data = listingToState();
    let categoryInfo = data.categoryId ?? null;

    if (!categoryInfo && data.otherCategory) {
      categoryInfo = "-";
    }

    setName(data.name);
    setCategory(categoryInfo);
    setDescription(data.description);
    setDefects(data.defects);
    setHasDefects(data.defects && data.defects.length > 0);
    setPostcode(data.postcode);
    setCity(data.city);
    setCompensationCost(data.compensationCost);
    setCountStoredItems(data.countStoredItems);
    setPricePerDay(data.pricePerDay);
    setMinRentalDays(data.minRentalDays);
    setLat(data.rentalLat);
    setLng(data.rentalLng);
    setRadius(data.rentalRadius);
    setAddress(data.address);
    setActive(data.active);
    setIsOtherCategory(!!data.otherCategory);
    setOtherCategory(data.otherCategory);
    setOtherCategoryParentId(data.otherCategoryParentId);

    const adaptedImages = data.listingImages.map((image) => ({
      ...image,
      date: Date.now(),
      localId: uniqueImageId(),
    }));

    setLinkFiles(adaptedImages);
  }, [listing]);

  const hasChanges = () => {
    if (files.length > 0) {
      return true;
    }

    const dataToSave = objectToSave();
    const listingToCheck = listingToState();
    return !lodash.isEqual(listingToCheck, dataToSave);
  };

  const formDataToSave = () => {
    const formData = new FormData();

    if (files && files.length > 0) {
      let indexCount = 0;
      let totalSize = 0;

      sortListingImages(files).forEach((file) => {
        if (file.id) {
          formData.append(`files[id][${file.id}]`, file);
        } else {
          formData.append(`files[index][${indexCount}]`, file);
          indexCount++;
        }

        totalSize += file.size;
      });

      const maxFileSize = Number(STATIC.LIMITS.SUMMARY_FILE_SIZE);

      if (totalSize > maxFileSize) {
        throw new Error(
          "The total size of the files cannot be larger than " +
            byteConverter(maxFileSize)
        );
      }
    }

    const info = objectToSave();
    info["listingImages"] = JSON.stringify(info["listingImages"]);

    Object.keys(info).forEach((key) => formData.append(key, info[key]));

    return formData;
  };

  const validate = () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError("Required field");
      hasError = true;
    }

    if (name && validateSmallText(name) !== true) {
      setNameError(validateSmallText(name));
      hasError = true;
    }

    if (isOtherCategory) {
      if (!otherCategory.trim()) {
        setCategoryError("required field");
        hasError = true;
      }

      if (validateSmallText(otherCategory) !== true) {
        setCategoryError(validateSmallText(otherCategory));
        hasError = true;
      }
    } else {
      if (!category) {
        setCategoryError("Required field");
        hasError = true;
      }
    }

    if (!postcode.trim()) {
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

    if (minRentalDays && minRentalDays > STATIC.LIMITS.MAX_RENTAL_DURATION) {
      setMinRentalDaysError(
        `You can't rent a listing more than ${STATIC.LIMITS.MAX_RENTAL_DURATION} days`
      );
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

    if (
      countStoredItems &&
      validateInteger(countStoredItems) === true &&
      Number(countStoredItems) == 0
    ) {
      setCountStoredItemsError("Field must be higher than zero");
      hasError = true;
    }

    if (description && validateBigText(description) !== true) {
      setDescriptionError(validateBigText(description));
      hasError = true;
    }

    if (hasDefects) {
      if (!defects) {
        setDefectsError("Required field");
        hasError = true;
      }

      if (defects && validateBigText(defects) !== true) {
        setDefectsError(validateBigText(defects));
        hasError = true;
      }
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

    return !hasError;
  };

  const handleSubmit = async (needShowMessage = true) => {
    if (!canChange) {
      return;
    }

    try {
      if (disabled) return;
      setMainError(null);

      if (!validate()) return false;

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
    if (disabled || sendRequestDisabled) return;

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

  const activateUpdatePopup = (e) => {
    e.preventDefault();

    if (!canChange) {
      return;
    }

    if (!validate()) {
      return false;
    }

    setActiveUpdatePopup(true);
  };

  const handleAcceptUpdate = async () => {
    await handleSubmit(true);
    setActiveUpdatePopup(false);
  };

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="miran-grid-sorting row align-items-center d-none d-xl-block">
          <div className="col-12 result-count">
            <div className="breadcrumb-area">
              <h1>{listing.name ?? "Add Listings"}</h1>
              <ol className="breadcrumb">
                <li className="item">
                  <Link href="/">Home</Link>
                </li>
                <li className="item">
                  <Link href="/dashboard/">Dashboard</Link>
                </li>
                <li className="item">
                  <Link href="/dashboard/listings/">Listings</Link>
                </li>
                <li className="item">{listing.name ?? "Add Listings"}</li>
              </ol>
            </div>
          </div>
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
            <div className={isOtherCategory ? "" : "col-lg-6 col-md-6"}>
              <InputWithIcon
                label="Title:"
                icon="bx bx-briefcase-alt"
                placeholder="Name of your tool"
                value={name}
                onInput={handleChangeName}
                error={nameError}
                name="name"
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <ErrorIconWrapper
                icon="bx bx-duplicate"
                label="Category:"
                error={categoryError}
              >
                <CategorySelect
                  categories={categories}
                  selectedCategoryId={category}
                  categoryError={isOtherCategory ? null : categoryError}
                  handleChangeCategory={handleChangeCategory}
                  otherCategoryParentId={otherCategoryParentId}
                />
              </ErrorIconWrapper>
            </div>

            {isOtherCategory && (
              <div className="col-lg-6 col-md-6">
                <InputWithIcon
                  label="Category Name:"
                  icon="bx bx-duplicate"
                  placeholder="Describe category..."
                  value={otherCategory}
                  onInput={handleChangeOtherCategory}
                  error={categoryError}
                  name="category_name"
                />
              </div>
            )}
          </div>
        </div>
        <div className="add-listings-box">
          <h3>Pricing</h3>

          <div className="row">
            <div className="col-lg-6 col-md-6">
              <InputWithIcon
                label={`Rental price per day (${STATIC.CURRENCY}):`}
                icon="bx bx-purchase-tag"
                placeholder="12.00"
                value={pricePerDay}
                onInput={handleChangePricePerDay}
                error={pricePerDayError}
                name="pricePerDay"
              />
            </div>
            <div className="col-lg-6 col-md-6">
              <InputWithIcon
                label={`Item value (${STATIC.CURRENCY}):`}
                icon="bx bx-purchase-tag"
                placeholder="532.00"
                value={compensationCost}
                onInput={handleChangeCompensationCost}
                error={compensationCostError}
                name="compensationCostError"
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputWithIcon
                label="Minimum rental days:"
                icon="bx bx-menu-alt-left"
                placeholder="0"
                value={minRentalDays}
                onInput={handleChangeMinRentalDays}
                error={minRentalDaysError}
                name="minRentalDays"
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
                name="countStoredItems"
              />
            </div>
          </div>
        </div>
        <div className="add-listings-box">
          <h3>
            Collection Location{" "}
            <div className="form-hint">
              The location is where you plan to hand over the item to the
              renter. It could be your home, workplace, or any other convenient
              place. <br />
              <b>Note:</b> Your safety is our priority. The exact location will
              only be shared with the renter once you approve the rental.
            </div>
          </h3>
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-12">
                  <SelectWithIcon
                    onChange={handleChangeCity}
                    value={city}
                    label="City:"
                    icon="bx bx-menu-alt-left"
                    options={cityOptions}
                    isSearchable={false}
                    name="city"
                  />
                </div>

                <div className="col-12">
                  <InputWithIcon
                    label="Postcode:"
                    icon="bx bx-menu-alt-left"
                    placeholder="WA1 1AF"
                    value={postcode}
                    onInput={handleChangePostcode}
                    error={postcodeError}
                    name="postcode"
                  />
                </div>

                <div className="col-12">
                  <InputWithIcon
                    label="Address:"
                    icon="bx bx-menu-alt-left"
                    placeholder="e.g. 55 County Laois"
                    value={address}
                    onInput={handleChangeAddress}
                    error={addressError}
                    name="address"
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <EditMap
                markerActive={markerActive}
                setMarkerActive={setMarkerActive}
                center={center}
                setCenter={setCenter}
                lat={lat}
                changeCoords={handleChangeCoords}
                lng={lng}
                radius={radius}
                setRadius={setRadius}
              />
            </div>
          </div>
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
          photoPopupError={photoPopupError}
          setPhotoPopupError={setPhotoPopupError}
          linkSuccessPhoto={linkSuccessPhoto}
          successLoadLinkPhoto={successLoadLinkPhoto}
        />

        <div className="add-listings-box">
          <h3>Item Description</h3>

          <div className="row">
            <div className="col-lg-12 col-md-12">
              <TextareaWithIcon
                name="description"
                value={description}
                onChange={handleChangeDescription}
                icon="bx bx-text"
                label="Describe your Item:"
                error={descriptionError}
                placeholder="DETAILS"
              />
            </div>
          </div>
        </div>

        <div className="add-listings-box">
          <h3>Confirm the tools condition</h3>

          <div className="form-group">
            <div className="sidebar-widgets">
              <div className="box">
                <span className="title">Is your tool defective?</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={hasDefects}
                    onChange={(e) => setHasDefects(e.target.checked)}
                  />
                  <span></span>
                </label>
              </div>
            </div>
          </div>

          {hasDefects && (
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <TextareaWithIcon
                  name="defects"
                  value={defects}
                  onChange={handleChangeDefects}
                  icon="bx bx-text"
                  label="Describe item defects:"
                  error={defectsError}
                  placeholder="DEFECTS"
                />
              </div>
            </div>
          )}
        </div>

        {!canChange && (
          <div
            className="alert-dismissible fade show alert alert-danger"
            role="alert"
          >
            The listing has a unfinished booking or order. Please finish all
            listing orders and bookings before updating
          </div>
        )}

        {mainError && (
          <div
            className="alert-dismissible fade show alert alert-danger"
            role="alert"
          >
            {mainError}
          </div>
        )}

        {canChange ? (
          <div className="add-listings-box footer-section">
            <div className="d-flex gap-2 justify-content-between">
              <button
                type="button"
                disabled={disabled}
                onClick={activateUpdatePopup}
              >
                {listing.id ? "Update Listing" : "Create Listing"}
              </button>

              {canSendRequest && listing.id && (
                <button
                  type="button"
                  onClick={activateSendRequestPopup}
                  disabled={sendRequestDisabled}
                >
                  Send Request To Approve
                </button>
              )}

              {listing.id && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setChangePopupActive(true);
                  }}
                  disabled={changeActiveDisabled}
                  className={active ? "button-danger" : ""}
                >
                  {active ? "Delete" : "Restore"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4"></div>
        )}

        <YesNoModal
          active={activeUpdatePopup}
          closeModal={() => setActiveUpdatePopup(false)}
          onAccept={handleAcceptUpdate}
          title={
            listing.id
              ? "Are you sure you want update listing?"
              : "Are you sure you want create listing?"
          }
          body={
            listing.id
              ? "When you update a listing, it automatically changes to unapproved status. Until an administrator approves your listing, users will not be able to rent the listing. A confirmation request will be sent automatically to the administrators if it has not been sent before"
              : "When you create a listing, you should send request to verify it. Users will not be able to rent the tool until it is verified and your account is verified. A confirmation request will be sent automatically to administrators"
          }
          acceptText="Confirm"
          actionsParentClass="mt-4"
        />
        <YesNoModal
          active={activeSentRequestPopup}
          closeModal={() => setActiveSentRequestPopup(false)}
          onAccept={handleSendRequestToApprove}
          title="Confirm Action"
          body={"Confirmation is required to send a listing approval request"}
          acceptText="Send"
        />
        <DeleteModal
          active={changePopupActive}
          onAccept={handleChangeActive}
          closeModal={() => setChangePopupActive(false)}
          activeListing={active}
          listingName={listing.name}
        />
      </div>
    </>
  );
};

export default EditForm;
