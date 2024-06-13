import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import NavbarThree from "../_App/NavbarThree";
import DashboardNavbar from "../Dashboard/DashboardNavbar";
import lodash from "lodash";
import STATIC from "../../static";
import {
  byteConverter,
  convertToSelectPopupCategories,
  onCurrentUserLocation,
  uniqueImageId,
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
import { useCoordsAddress, useListingPhotosEdit } from "../../hooks";
import CategorySelect from "./CategorySelect";
import YesNoModal from "../_App/YesNoModal";
import {
  createListingApprovalRequest,
  deleteListing,
  changeActiveListing,
} from "../../services";
import Switch from "../FormComponents/Switch";
import { useRouter } from "next/router";
import env from "../../env";

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
  defects,
}) => {
  const { success, authToken, error } = useContext(IndiceContext);
  const router = useRouter();
  categories = convertToSelectPopupCategories(categories);

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
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const [changeActiveDisabled, setChangeActiveDisabled] = useState(false);
  const [activeDeletePopup, setActiveDeletePopup] = useState(false);
  const [activeSentRequestPopup, setActiveSentRequestPopup] = useState(false);
  const [activeUpdatePopup, setActiveUpdatePopup] = useState(false);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

  const [defect, setDefect] = useState("");
  const [defectError, setDefectError] = useState(null);

  const [listingDefects, setListingDefects] = useState([]);

  const [category, setCategory] = useState(baseCategoryId);
  const [categoryError, setCategoryError] = useState(null);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(null);

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

  const [active, setActive] = useState(true);

  const [center, setCenter] = useState({
    lat: STATIC.CITY_COORDS[baseCity].lat,
    lng: STATIC.CITY_COORDS[baseCity].lng,
  });
  const [markerActive, setMarkerActive] = useState(false);

  const [lat, setLat] = useState(STATIC.CITY_COORDS[baseCity].lat);
  const [lng, setLng] = useState(STATIC.CITY_COORDS[baseCity].lng);
  const [radius, setRadius] = useState(STATIC.BASE_LISTING_MAP_CIRCLE_RADIUS);

  const [mainError, setMainError] = useState(null);

  useEffect(() => {
    if (!canChange) {
      setMainError(
        "The listing has a unfinished booking or order. Please finish all listing orders and bookings before updating"
      );
    }
  }, [canChange]);

  const { getAddressByCoords, getCoordsByAddress } = useCoordsAddress();

  const handleChangeName = (e) => {
    setName(e.target.value);
    setNameError(null);
    setMainError(null);
  };

  const handleChangeAddress = async (event) => {
    try {
      const newAddress = event.target.value;
      setAddress(newAddress);
      setAddressError(null);
      setMainError(null);

      const newCoords = await getCoordsByAddress(newAddress);
      if (!newCoords) return;

      setLat(newCoords.lat);
      setLng(newCoords.lng);
      setCenter({ lat: newCoords.lat, lng: newCoords.lng });
    } catch (e) {
      if (!e.message.includes("ZERO_RESULTS")) {
        error.set(e.message);
      }
    }
  };

  const handleChangeCoords = async ({ lat: newLat, lng: newLng }) => {
    try {
      setLat(newLat);
      setLng(newLng);
      const newAddress = await getAddressByCoords({ lat: newLat, lng: newLng });
      setAddress(newAddress);
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleChangeActive = async () => {
    try {
      if (!canChange) {
        error.set(
          "The listing has a unfinished booking or order. Please finish all listing orders and bookings before updating"
        );
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

  const handleChangeCategory = (categoryId) => {
    setCategory(categoryId);
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
    const lat = STATIC.CITY_COORDS[city].lat;
    const lng = STATIC.CITY_COORDS[city].lng;

    setCity(city);
    setCenter({ lat, lng });
    setLat(lat);
    setLng(lng);
    setRadius(STATIC.BASE_LISTING_MAP_CIRCLE_RADIUS);
    setMainError(null);
  };

  const handleChangePostcode = (e) => {
    setPostcode(e.target.value);
    setPostcodeError(null);
    setMainError(null);
  };

  const handleChangeDopDefect = (e) => {
    setDefect(e.target.value);
    setDefectError(null);
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

  const handleChangeListingDefectActive = (defectId) => {
    if (listingDefects.includes(defectId)) {
      setListingDefects((prev) => prev.filter((id) => id != defectId));
    } else {
      setListingDefects((prev) => [...prev, defectId]);
    }
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
    const lat = listing.rentalLat
      ? Number(listing.rentalLat)
      : STATIC.CITY_COORDS[city].lat;
    const lng = listing.rentalLng
      ? Number(listing.rentalLng)
      : STATIC.CITY_COORDS[city].lng;

    const listingImages = (listing.listingImages ?? []).map((elem) => ({
      link: elem.link,
      type: elem.type,
      id: elem.id,
    }));

    const listingDefects = listing.defects ?? [];
    const listingDefectIds = listingDefects.map((defect) => defect.defectId);

    return {
      address: listing.address ?? "",
      name: listing.name ?? "",
      categoryId: listing.categoryId ?? baseCategoryId,
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
      rentalRadius: listing.radius ?? STATIC.BASE_LISTING_MAP_CIRCLE_RADIUS,
      listingImages,
      active: listing.active ?? true,
      defects: listingDefectIds,
      dopDefect: listing.dopDefect ?? "",
    };
  };

  const objectToSave = () => {
    const listingImages = linkFiles.map((elem) => ({
      link: elem.link,
      type: elem.type,
      id: elem.id,
    }));

    return {
      address,
      name,
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
      active,
      defects: listingDefects,
      dopDefect: defect,
    };
  };

  useEffect(() => {
    const data = listingToState();
    setName(data.name);
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
    setAddress(data.address);
    setActive(data.active);
    setListingDefects(data.defects);
    setDefect(data.dopDefect);

    const adaptedImages = data.listingImages.map((image) => ({
      ...image,
      date: Date.now(),
      localId: uniqueImageId(),
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

    if (files && files.length > 0) {
      let indexCount = 0;
      let totalSize = 0;

      files.forEach((file) => {
        if (file.id) {
          formData.append(`files[id][${file.id}]`, file);
        } else {
          formData.append(`files[index][${indexCount}]`, file);
          indexCount++;
        }

        totalSize += file.size;
      });

      const maxFileSize = Number(env.MAX_SUMMARY_FILE_SIZE);

      if (totalSize > maxFileSize) {
        throw new Error(
          "The total size of the files cannot be larger than " +
            byteConverter(maxFileSize)
        );
      }
    }

    const info = objectToSave();
    info["listingImages"] = JSON.stringify(info["listingImages"]);
    info["defects"] = JSON.stringify(info["defects"]);
    Object.keys(info).forEach((key) => formData.append(key, info[key]));

    return formData;
  };

  const validate = () => {
    let hasError = false;

    if (!name) {
      setNameError("Required field");
      hasError = true;
    }

    if (name && validateSmallText(name) !== true) {
      setNameError(validateSmallText(name));
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

    if (minRentalDays && minRentalDays > 350) {
      setMinRentalDaysError(
        "You cannot make the minimum rental duration longer than 350 days"
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

    if (defect.trim().length && validateBigText(defect) !== true) {
      setDefectError(validateBigText(defect));
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
      error.set(
        "The listing has a unfinished booking or order. Please finish all listing orders and bookings before updating"
      );
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

  const activateDeletePopup = (e) => {
    e.preventDefault();

    if (!canChange) {
      error.set(
        "The listing has a unfinished booking or order. Please finish all listing orders and bookings before updating"
      );
      return;
    }

    setActiveDeletePopup(true);
  };

  const handleAcceptDelete = async () => {
    try {
      setDeleteDisabled(true);
      await deleteListing(listing.id, authToken);
      setActiveDeletePopup(false);
      router.push("/dashboard/listings");
      success.set("Deleted successfully");
    } catch (e) {
      error.set(e.message);
    } finally {
      setDeleteDisabled(false);
    }
  };

  const activateUpdatePopup = (e) => {
    e.preventDefault();
    setActiveUpdatePopup(true);
  };

  const handleAcceptUpdate = async () => {
    await handleSubmit(true);
    setActiveUpdatePopup(false);
  };

  const handleBaseUpdateClick = async (e) => {
    if (listing.id && listing.approved) {
      if (disabled) return;
      setMainError(null);

      if (!validate()) return false;

      if (hasChanges()) {
        activateUpdatePopup(e);
      } else {
        success.set(messageOnSuccess);
      }
    } else {
      handleSubmit(true);
    }
  };

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />
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
              <Link href="/dashboard/listings">Listings</Link>
            </li>
            <li className="item">{listing.name ?? "Add Listings"}</li>
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
            <div className="col-lg-6 col-md-6">
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
                  categoryError={categoryError}
                  handleChangeCategory={handleChangeCategory}
                />
              </ErrorIconWrapper>
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
                name="pricePerDay"
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
                name="compensationCostError"
              />
            </div>

            <div className="col-lg-6 col-md-6">
              <InputWithIcon
                label="Min rental days(not required):"
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
                name="city"
              />
            </div>

            <div className="col-lg-6 col-md-6">
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

            <div className="col-12 mb-1">
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
        {defects.length > 0 && (
          <div className="add-listings-box">
            <h3>Defects</h3>

            <div className="row">
              <div className="col-lg-12 col-md-12">
                {defects
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((defect) => (
                    <Switch
                      key={defect.id}
                      title={defect.name}
                      active={listingDefects.includes(defect.id)}
                      onChange={() =>
                        handleChangeListingDefectActive(defect.id)
                      }
                    />
                  ))}

                <div className="form-group switch-form-group">
                  <div className="sidebar-widgets">
                    <div className="box" style={{ padding: "0" }}>
                      <InputWithIcon
                        placeholder="Other defects..."
                        value={defect}
                        onInput={handleChangeDopDefect}
                        error={defectError}
                        name="dopDefect"
                        dopGroupClass="mb-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="add-listings-box">
          <h3>Details</h3>

          <div className="row">
            <div className="col-lg-12 col-md-12">
              <TextareaWithIcon
                name="description"
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
                name="rentalTerms"
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

        {canChange ? (
          <div className="add-listings-box footer-section">
            <div className="d-flex gap-2 justify-content-between">
              <button
                type="button"
                disabled={disabled}
                onClick={handleBaseUpdateClick}
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
                  onClick={handleChangeActive}
                  disabled={changeActiveDisabled}
                >
                  {active ? "Delete" : "Restore"}
                </button>
              )}

              {/*listing.approved && listing.id && (
              <button
                type="button"
                onClick={activateDeletePopup}
                disabled={deleteDisabled}
              >
                Delete
              </button>
            )*/}
            </div>
          </div>
        ) : (
          <div className="mt-4"></div>
        )}

        <YesNoModal
          active={activeUpdatePopup}
          closeModal={() => setActiveUpdatePopup(false)}
          onAccept={handleAcceptUpdate}
          title="Are you sure you want update listing?"
          body={
            "When you update a listing, it automatically changes to unapproved status. Until an administrator approves your listing, users will not be able to rent the listing. An approval request will be sent automatically"
          }
          acceptText="Update"
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
        {/*<YesNoModal
          active={activeDeletePopup}
          closeModal={() => setActiveDeletePopup(false)}
          onAccept={handleAcceptDelete}
          title="Confirm Action"
          body={`Confirmation is required to continue. Are you sure you want to delete listing "${listing.name}"?`}
          acceptText="Send"
        />*/}
      </div>
    </>
  );
};

export default EditForm;
