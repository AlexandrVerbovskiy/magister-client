import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Switch from "../../../partials/admin/base/Switch";
import DropdownClassic from "../DropdownClassic";
import Input from "../Form/Input";
import Textarea from "../Form/Textarea";
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
  uniqueId,
  uniqueImageId,
  validateBigText,
  validateInteger,
  validatePrice,
  validateSmallText,
  byteConverter
} from "../../../utils";
import DropdownClassicAjax from "../DropdownClassicAjax";
import STATIC from "../../../static";
import ErrorSpan from "../ErrorSpan";
import CategorySelect from "./CategorySelect";
import env from "../../../env";

const cityOptions = [
  { value: "Warrington", title: "Warrington" },
  { value: "Manchester", title: "Manchester" },
];

const baseCity = cityOptions[0]["value"];

const EditForm = ({ listing, categories, defects, save }) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [prevListing, setPrevListing] = useState(listing);

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
  const [active, setActive] = useState(true);

  const [approved, setApproved] = useState(false);

  const [ownerId, setOwnerId] = useState(null);
  const [ownerIdError, setOwnerIdError] = useState(null);

  const [ownerName, setOwnerName] = useState("");

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

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

  const [defect, setDefect] = useState("");
  const [defectError, setDefectError] = useState(null);

  const [center, setCenter] = useState({
    lat: STATIC.CITY_COORDS[baseCity].lat,
    lng: STATIC.CITY_COORDS[baseCity].lng,
  });
  const [markerActive, setMarkerActive] = useState(false);

  const [lat, setLat] = useState(STATIC.CITY_COORDS[baseCity].lat);
  const [lng, setLng] = useState(STATIC.CITY_COORDS[baseCity].lng);
  const [radius, setRadius] = useState(STATIC.BASE_LISTING_MAP_CIRCLE_RADIUS);

  const { getAddressByCoords, getCoordsByAddress } = useCoordsAddress();

  const handleChangeCity = (city) => {
    const lat = STATIC.CITY_COORDS[city].lat;
    const lng = STATIC.CITY_COORDS[city].lng;

    setCity(city);
    setCenter({ lat, lng });
    setLat(lat);
    setLng(lng);
    setRadius(STATIC.BASE_LISTING_MAP_CIRCLE_RADIUS);
  };

  const handleChangeAddress = async (newAddress) => {
    try {
      setAddress(newAddress);
      setAddressError(null);

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

  const handleChangeListingDefectActive = (defectId) => {
    if (listingDefects.includes(defectId)) {
      setListingDefects((prev) => prev.filter((id) => id != defectId));
    } else {
      setListingDefects((prev) => [...prev, defectId]);
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

  const handleChangeCategory = (newCategoryId) => {
    setCategory(newCategoryId);
    setCategoryError(null);
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
    setCenter({ lat: data.rentalLat, lng: data.rentalLng });
    setRadius(data.rentalRadius);
    setApproved(data.approved);
    setOwnerId(data.ownerId);
    setOwnerName(prevListing.userName);
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
  }, [prevListing]);

  const listingToState = () => {
    const city = prevListing.city ?? baseCity;
    const lat = prevListing.rentalLat
      ? Number(prevListing.rentalLat)
      : STATIC.CITY_COORDS[city].lat;
    const lng = prevListing.rentalLng
      ? Number(prevListing.rentalLng)
      : STATIC.CITY_COORDS[city].lng;

    const listingImages = (prevListing.listingImages ?? []).map((elem) => ({
      link: elem.link,
      type: elem.type,
      id: elem.id,
    }));

    const categoryId = prevListing.categoryId ?? baseCategoryId;

    const listingDefects = prevListing.defects ?? [];
    const listingDefectIds = listingDefects.map((defect) => defect.defectId);

    return {
      name: prevListing.name ?? "",
      categoryId: categoryId,
      description: prevListing.description ?? "",
      rentalTerms: prevListing.rentalTerms ?? "",
      postcode: prevListing.postcode ?? "",
      city: city,
      compensationCost: prevListing.compensationCost ?? "",
      countStoredItems: prevListing.countStoredItems ?? "",
      pricePerDay: prevListing.pricePerDay ?? "",
      minRentalDays: prevListing.minRentalDays ?? "",
      rentalLat: lat,
      rentalLng: lng,
      rentalRadius: prevListing.radius ?? STATIC.BASE_LISTING_MAP_CIRCLE_RADIUS,
      listingImages,
      approved: prevListing.approved ?? false,
      ownerId: prevListing.ownerId,
      address: prevListing.address ?? "",
      active: prevListing.active ?? true,
      defects: listingDefectIds,
      dopDefect: prevListing.dopDefect ?? "",
    };
  };

  const objectToSave = () => {
    const listingImages = linkFiles.map((elem) => ({
      link: elem.link,
      type: elem.type,
      id: elem.id,
    }));

    return {
      name,
      address,
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
      approved,
      ownerId,
      active,
      defects: listingDefects,
      dopDefect: defect,
    };
  };

  const hasChanges = () => {
    if (files.length > 0) return true;
    const dataToSave = objectToSave();
    const listingToCheck = listingToState();
    return !lodash.isEqual(listingToCheck, dataToSave);
  };

  const handleSubmit = async () => {
    try {
      if (disabled) return;
      error.set(null);

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

      if (defect.length && validateBigText(defect) !== true) {
        setDefectError(validateBigText(defect));
        hasError = true;
      }

      if (hasError) return;

      setDisabled(true);

      if (hasChanges()) {
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
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
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
                      <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
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
                            <div className="w-full sm:w-1/2">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="role"
                              >
                                Owner
                              </label>
                              <DropdownClassicAjax
                                fetchOptions={(page, filter) =>
                                  getUserNameIdList({ page, filter })
                                }
                                selected={ownerId}
                                onChange={handleChangeOwner}
                                selectedTitle={ownerName}
                                disabledText="You can't select not verified user"
                              />
                              <ErrorSpan error={ownerIdError} />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="role"
                              >
                                Category
                              </label>

                              <CategorySelect
                                categories={categories}
                                selectedCategoryId={category}
                                categoryError={categoryError}
                                handleChangeCategory={handleChangeCategory}
                              />
                            </div>
                          </div>
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
                                label="Rental price per day"
                                placeholder="12.00"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <Input
                                name="compensationCost"
                                label="Item value"
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
                                label="Min rental days(not required)"
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
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Location
                        </h2>

                        <div className="flex flex-col gap-2">
                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="role"
                              >
                                City
                              </label>
                              <DropdownClassic
                                options={cityOptions}
                                selected={city}
                                setSelected={handleChangeCity}
                                needSearch={false}
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
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

                          <div className="flex w-full admin-map-parent">
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
                            />
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

                      {defects.length > 0 && (
                        <section>
                          <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                            Defects
                          </h2>

                          <div className="w-full">
                            {defects
                              .sort((a, b) => a.orderIndex - b.orderIndex)
                              .map((defect) => {
                                return (
                                  <div
                                    key={defect.id}
                                    className="form-input flex flex-wrap mt-2 justify-between"
                                  >
                                    <div className="mr-2">
                                      <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="suspicious"
                                      >
                                        {defect.name}
                                      </label>
                                    </div>
                                    <Switch
                                      id={uniqueId()}
                                      checked={listingDefects.includes(
                                        defect.id
                                      )}
                                      changeChecked={() =>
                                        handleChangeListingDefectActive(
                                          defect.id
                                        )
                                      }
                                    />
                                  </div>
                                );
                              })}

                            <Input
                              name="dop_defect"
                              placeholder="Other defects..."
                              labelClassName="block text-sm font-medium mb-1"
                              value={defect}
                              setValue={setDefect}
                              error={defectError}
                              setError={setDefectError}
                              inputClassName="form-input w-full mt-2"
                            />
                          </div>
                        </section>
                      )}

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Details
                        </h2>

                        <div className="w-full">
                          <Textarea
                            name="description"
                            value={description}
                            setValue={setDescription}
                            row="7"
                            error={descriptionError}
                            setError={setDescriptionError}
                          />
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Rental Terms
                        </h2>

                        <div className="w-full">
                          <Textarea
                            name="rentalTerms"
                            value={rentalTerms}
                            setValue={setRentalTerms}
                            row="7"
                            error={rentalTermsError}
                            setError={setRentalTermsError}
                          />
                        </div>
                      </section>

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
                              if (
                                prevListing.ownerId ||
                                prevListing.ownerId !== ownerId ||
                                prevListing.userVerified
                              ) {
                                setApproved(!approved);
                              }
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
                              ? "You cannot change verify the listing because the owner of the listing is unverified"
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
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
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
