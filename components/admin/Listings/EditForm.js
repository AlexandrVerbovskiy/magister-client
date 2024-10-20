import React, { useState, useContext, useEffect, useRef } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Switch from "../../../partials/admin/base/Switch";
import DropdownClassic from "../DropdownClassic";
import Input from "../Form/Input";
import DateInput from "../Form/DateInput";
import { getUserNameIdList } from "../../../services";
import { IndiceContext } from "../../../contexts";
import EditMap from "../../Listings/EditMap";
import lodash from "lodash";
import EditPhotosSection from "./EditPhotosSection";
import {
  useListingPhotosEdit,
  useAdminPage,
  useCoordsAddress,
} from "../../../hooks";
import {
  convertToSelectPopupCategories,
  uniqueImageId,
  validateBigText,
  validatePrice,
  validateSmallText,
  byteConverter,
  getCityCoords,
  sortListingImages,
} from "../../../utils";
import DropdownClassicAjax from "../DropdownClassicAjax";
import STATIC from "../../../static";
import ErrorSpan from "../ErrorSpan";
import CategorySelect from "./CategorySelect";

const baseCity = STATIC.CITIES[0]["value"];

const OwnerSection = ({
  ownerId,
  ownerName,
  handleChangeOwner,
  ownerIdError,
  isOtherCategory,
}) => (
  <div className={isOtherCategory ? "w-full" : "w-full sm:w-1/2"}>
    <label className="block text-sm font-medium mb-1" htmlFor="role">
      Owner
    </label>
    <DropdownClassicAjax
      fetchOptions={(page, filter) => getUserNameIdList({ page, filter })}
      selected={ownerId}
      onChange={handleChangeOwner}
      selectedTitle={ownerName}
      disabledText="You can't select not verified user"
      placeholder="Select Owner"
    />
    <ErrorSpan error={ownerIdError} />
  </div>
);

const CategorySection = ({
  categories,
  category,
  isOtherCategory,
  categoryError,
  handleChangeCategory,
  otherCategoryParentId,
}) => (
  <div className="w-full sm:w-1/2">
    <label className="block text-sm font-medium mb-1" htmlFor="role">
      Category
    </label>
    <CategorySelect
      categories={categories}
      selectedCategoryId={category}
      categoryError={isOtherCategory ? null : categoryError}
      handleChangeCategory={handleChangeCategory}
      otherCategoryParentId={otherCategoryParentId}
    />
  </div>
);

const OtherCategorySection = ({
  otherCategory,
  setOtherCategory,
  categoryError,
  setCategoryError,
}) => (
  <div className="w-full sm:w-1/2">
    <Input
      name="otherCategory"
      value={otherCategory}
      setValue={setOtherCategory}
      error={categoryError}
      setError={setCategoryError}
      label="Category Name"
      placeholder="Describe category..."
      labelClassName="block text-sm font-medium mb-1"
      inputClassName="form-input w-full"
    />
  </div>
);

const EditForm = ({ listing, categories, save }) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [prevListing, setPrevListing] = useState(listing);

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
  const [active, setActive] = useState(true);

  const [approved, setApproved] = useState(false);

  const [ownerId, setOwnerId] = useState(null);
  const [ownerIdError, setOwnerIdError] = useState(null);

  const [ownerName, setOwnerName] = useState("");

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

  const [category, setCategory] = useState(null);
  const [otherCategory, setOtherCategory] = useState("");
  const [otherCategoryParentId, setOtherCategoryParentId] = useState(null);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);

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

  const baseCoords = getCityCoords(baseCity);

  const [center, setCenter] = useState(baseCoords);
  const [markerActive, setMarkerActive] = useState(false);

<<<<<<< HEAD
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState(null);
=======
  const [totalPrice, setTotalPrice] = useState("");
  const [totalPriceError, setTotalPriceError] = useState(null);

  const [finishTime, setFinishTime] = useState("");
  const [finishTimeError, setFinishTimeError] = useState(null);
>>>>>>> ebc90ab (listing updated)

  const [lat, setLat] = useState(baseCoords.lat);
  const [lng, setLng] = useState(baseCoords.lng);
  const [radius, setRadius] = useState(
    STATIC.DEFAULTS.LISTING_MAP_CIRCLE_RADIUS
  );

  const { getAddressByCoords, getCoordsByAddress } = useCoordsAddress();

  const getAddressByCoordsTimeoutRef = useRef(null);
  const getCoordsByAddressTimeoutRef = useRef(null);

  const handleChangeCity = (city) => {
    const coords = getCityCoords(city);

    setCity(city);
    setCenter(coords);
    setLat(coords.lat);
    setLng(coords.lng);
    setRadius(STATIC.DEFAULTS.LISTING_MAP_CIRCLE_RADIUS);
  };

  const handleChangeAddress = async (newAddress) => {
    setAddress(newAddress);
    setAddressError(null);

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
        if (!e.message.includes("ZERO_RESULTS")) {
          error.set(e.message);
        }
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
        error.set(e.message);
      }
    }, 100);
  };

  const handleChangeCategory = (
    newCategoryId,
    newOtherCategoryParentId = null
  ) => {
    setCategory(newCategoryId);
    setIsOtherCategory(newCategoryId == "-");
    setOtherCategoryParentId(newOtherCategoryParentId);
    setCategoryError(null);

    if (newOtherCategoryParentId != otherCategoryParentId) {
      setOtherCategory("");
    }
  };

  useEffect(() => {
    const data = listingToState();
    let categoryInfo = data.categoryId ?? null;

    if (!categoryInfo && data.otherCategory) {
      categoryInfo = "-";
    }

<<<<<<< HEAD
    setPrice(data.price);
=======
    setTotalPrice(data.totalPrice);
    setFinishTime(data.finishTime);
>>>>>>> ebc90ab (listing updated)
    setName(data.name);
    setCategory(categoryInfo);
    setDescription(data.description);
    setPostcode(data.postcode);
    setCity(data.city);
    setLat(data.lat);
    setLng(data.lng);
<<<<<<< HEAD
    setCenter({ lat: data.lat, lng: data.lng });
=======
    setCenter({ lat: data.lat, lng: data.lLng });
>>>>>>> ebc90ab (listing updated)
    setRadius(data.radius);
    setApproved(data.approved);
    setOwnerId(data.ownerId);
    setOwnerName(prevListing.userName);
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
  }, [prevListing]);

  const listingToState = () => {
    const city = prevListing.city ?? baseCity;
    const cityCoords = getCityCoords(city);

    const lat = prevListing.lat ? Number(prevListing.lat) : cityCoords.lat;
    const lng = prevListing.lng ? Number(prevListing.lng) : cityCoords.lng;

    const listingImages = (prevListing.listingImages ?? []).map((elem) => ({
      link: elem.link,
      type: elem.type,
      id: elem.id,
    }));

    const categoryId = !!listing.otherCategory
      ? undefined
      : listing.categoryId ?? null;

    const data = {
      name: prevListing.name ?? "",
      description: prevListing.description ?? "",
      postcode: prevListing.postcode ?? "",
      city: city,
      lat,
      lng,
<<<<<<< HEAD
      radius: prevListing.radius ?? STATIC.DEFAULTS.LISTING_MAP_CIRCLE_RADIUS,
=======
      radius:
        prevListing.radius ?? STATIC.DEFAULTS.LISTING_MAP_CIRCLE_RADIUS,
>>>>>>> ebc90ab (listing updated)
      listingImages,
      approved: prevListing.approved ?? false,
      ownerId: prevListing.ownerId,
      address: prevListing.address ?? "",
      active: prevListing.active ?? true,
      otherCategory: prevListing.otherCategory ?? "",
      otherCategoryParentId: listing.otherCategoryParentId ?? null,
<<<<<<< HEAD
      price: prevListing.price ?? "",
=======
      totalPrice: prevListing.totalPrice ?? "",
      finishTime: prevListing.finishTime ?? "",
>>>>>>> ebc90ab (listing updated)
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
      name: name.trim(),
      address: address.trim(),
      description: description.trim(),
      postcode: postcode.trim(),
      city: city.trim(),
      lat,
      lng,
      radius,
      listingImages,
      approved,
      ownerId,
      active,
<<<<<<< HEAD
      price,
=======
      totalPrice,
      finishTime,
>>>>>>> ebc90ab (listing updated)
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

  const hasChanges = () => {
    if (files.length > 0) {
      return true;
    }

    const dataToSave = objectToSave();
    const listingToCheck = listingToState();
    return !lodash.isEqual(listingToCheck, dataToSave);
  };

  const handleSubmit = async () => {
    try {
      if (disabled) {
        return;
      }

      error.set(null);

      let hasError = false;

      if (!name.trim()) {
        setNameError("Required field");
        hasError = true;
      }

      if (name && validateSmallText(name) !== true) {
        setNameError(validateSmallText(name));
        hasError = true;
      }

<<<<<<< HEAD
      if (!price) {
        setPrice("Required field");
        hasError = true;
      }

      if (price && validatePrice(price) !== true) {
        setPriceError(validatePrice(price));
=======
      if (!totalPrice) {
        setTotalPrice("Required field");
        hasError = true;
      }

      if (!finishTime) {
        setFinishTimeError("Required field");
        hasError = true;
      }

      if (totalPrice && validatePrice(totalPrice) !== true) {
        setTotalPriceError(validatePrice(totalPrice));
>>>>>>> ebc90ab (listing updated)
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

      if (minRentalDays > STATIC.LIMITS.MAX_RENTAL_DURATION) {
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

      if (!ownerId) {
        setOwnerIdError("Required field");
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

      if (files.length + linkFiles.length < 1) {
        setFileError("At least one photo is required");
        hasError = true;
      }

      if (hasError) {
        return;
      }

      setDisabled(true);

      if (hasChanges()) {
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

        const res = await save(formData, authToken);

        setFiles([]);
        setLinkFiles(adaptLinkPropsToLocal([...res.listingImages]));

        setPrevListing((prev) => ({
          ...prev,
          ...res,
          approved: res.approved === "true",
        }));
      }

      success.set("Updated successfully");
      return true;
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleChangeOwner = (ownerId, ownerName) => {
    setOwnerId(ownerId);
    setOwnerName(ownerName);
    setOwnerIdError(null);
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-8">
                <BreadCrumbs
                  links={[
                    { title: "Listings", href: "/admin/listings" },
                    { title: prevListing.name ?? "Create New Listing" },
                  ]}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow w-full">
                    <div className="p-6 space-y-6">
                      <h2 className="max-w-full overflow-separate text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                        {listing.name}
                      </h2>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Base information
                        </h2>

                        <div className="flex flex-col gap-2">
                          <div className="flex w-full gap-2">
                            <div className="w-full">
                              <Input
                                name="name"
                                value={name}
                                setValue={setName}
                                error={nameError}
                                setError={setNameError}
                                label="Name"
                                placeholder="Name of tool"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <OwnerSection
                              ownerId={ownerId}
                              ownerName={ownerName}
                              handleChangeOwner={handleChangeOwner}
                              ownerIdError={ownerIdError}
                              isOtherCategory={isOtherCategory}
                            />
                            {!isOtherCategory && (
                              <CategorySection
                                categories={categories}
                                category={category}
                                isOtherCategory={isOtherCategory}
                                categoryError={categoryError}
                                handleChangeCategory={handleChangeCategory}
                                otherCategoryParentId={otherCategoryParentId}
                              />
                            )}
                          </div>

                          {isOtherCategory && (
                            <div className="flex w-full gap-2">
                              <CategorySection
                                categories={categories}
                                category={category}
                                isOtherCategory={isOtherCategory}
                                categoryError={categoryError}
                                handleChangeCategory={handleChangeCategory}
                                otherCategoryParentId={otherCategoryParentId}
                              />
                              <OtherCategorySection
                                otherCategory={otherCategory}
                                setOtherCategory={setOtherCategory}
                                categoryError={categoryError}
                                setCategoryError={setCategoryError}
                              />
                            </div>
                          )}

<<<<<<< HEAD
                          <div>
                            <Textarea
                              name="description"
                              value={description}
                              setValue={setDescription}
                              error={descriptionError}
                              setError={setDescriptionError}
                              label="Description"
                              placeholder="Details..."
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <Input
                                name="price"
                                value={price}
                                setValue={setPrice}
                                error={priceError}
                                setError={setPriceError}
                                label="Price per day"
                                placeholder="Price per day"
=======
                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <Input
                                name="total-price"
                                value={totalPrice}
                                setValue={setTotalPrice}
                                error={totalPriceError}
                                setError={setTotalPriceError}
                                label="Total Price"
                                placeholder="Total Price"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <DateInput
                                label="Finish Time"
                                name="finishTime"
                                value={finishTime}
                                setValue={setFinishTime}
                                error={finishTimeError}
                                setError={setFinishTimeError}
                                placeholder="Finish Time"
>>>>>>> ebc90ab (listing updated)
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>
<<<<<<< HEAD
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Pricing
                        </h2>

                        <div className="flex flex-col gap-2">
                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <Input
                                name="pricePerPay"
                                value={pricePerDay}
                                setValue={setPricePerDay}
                                error={pricePerDayError}
                                setError={setPricePerDayError}
                                label={`Rental price per day (${STATIC.CURRENCY})`}
                                placeholder="12.00"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <Input
                                name="compensationCost"
                                label={`Item value (${STATIC.CURRENCY})`}
                                placeholder="532.00"
                                labelClassName="block text-sm font-medium mb-1"
                                value={compensationCost}
                                setValue={setCompensationCost}
                                error={compensationCostError}
                                setError={setCompensationCostError}
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <Input
                                name="minRentalDays"
                                value={minRentalDays}
                                setValue={setMinRentalDays}
                                error={minRentalDaysError}
                                setError={setMinRentalDaysError}
                                label="Minimum rental days"
                                placeholder="0"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <Input
                                name="countStoredItems"
                                label="Quantity"
                                placeholder="1"
                                labelClassName="block text-sm font-medium mb-1"
                                value={countStoredItems}
                                setValue={setCountStoredItems}
                                error={countStoredItemsError}
                                setError={setCountStoredItemsError}
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>
=======
>>>>>>> ebc90ab (listing updated)
                        </div>
                      </section>

                      <section>
                        <div className="flex w-full gap-2 flex-col md:flex-row">
                          <div className="w-full sm:w-1/2">
                            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                              Collection Location
                            </h2>

                            <div className="w-full mb-2">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="role"
                              >
                                City
                              </label>
                              <DropdownClassic
                                options={STATIC.CITIES}
                                selected={city}
                                setSelected={handleChangeCity}
                                needSearch={false}
                              />
                            </div>

                            <div className="w-full mb-2">
                              <Input
                                name="postcode"
                                label="Postcode"
                                placeholder="WA1 1AF"
                                labelClassName="block text-sm font-medium mb-1"
                                value={postcode}
                                setValue={setPostcode}
                                error={postcodeError}
                                setError={setPostcodeError}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full mb-2">
                              <Input
                                name="address"
                                label="Address"
                                placeholder="e.g. 55 County Laois"
                                labelClassName="block text-sm font-medium mb-1"
                                value={address}
                                setValue={handleChangeAddress}
                                error={addressError}
                                setError={setAddressError}
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="w-full sm:w-1/2">
                            <div className="flex w-full admin-map-parent mb-2">
                              <EditMap
                                markerActive={markerActive}
                                setMarkerActive={setMarkerActive}
                                center={center}
                                setCenter={setCenter}
                                lat={lat}
                                lng={lng}
                                changeCoords={handleChangeCoords}
                                radius={radius}
                                setRadius={setRadius}
                                height="240px"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

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

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Active
                        </h2>
                        <div className="flex flex-wrap mt-2">
                          <div className="mr-2">
                            <label
                              className="block text-sm font-medium mb-1"
                              htmlFor="approved"
                            >
                              If listing is active, users can rent it
                            </label>
                          </div>
                          <Switch
                            id="active"
                            checked={active}
                            changeChecked={() => setActive(!active)}
                            onText="Yes"
                            offText="No"
                          />
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Approved
                        </h2>
                        <div className="flex flex-wrap mt-2">
                          <div className="mr-2">
                            <label
                              className="block text-sm font-medium mb-1"
                              htmlFor="approved"
                            >
                              Are you sure that everything is normal with the
                              tool?
                            </label>
                          </div>
                          <Switch
                            id="approved"
                            checked={approved}
                            changeChecked={() => {
                              setApproved(!approved);
                            }}
                            onText="Yes"
                            offText="No"
                          />
                        </div>
                        <ErrorSpan
                          error={
                            prevListing.ownerId &&
                            prevListing.ownerId == ownerId &&
                            !prevListing.userVerified
                              ? "You shouldn't make the listing active because the owner of the listing is unverified"
                              : ""
                          }
                        />
                      </section>
                    </div>

                    <footer>
                      <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex self-end">
                          <button
                            disabled={disabled}
                            type="button"
                            onClick={handleSubmit}
                            className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditForm;
