import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../../../../partials/admin/Sidebar";
import Header from "../../../../partials/admin/Header";
import BreadCrumbs from "../../../../partials/admin/base/BreadCrumbs";
import Switch from "../../../../partials/admin/base/Switch";
import DropdownClassic from "../../../../components/admin/DropdownClassic";
import Input from "../../../../components/admin/Form/Input";
import Textarea from "../../../../components/admin/Form/Textarea";
import {
  getAdminListingEditPageOptions,
  getUserNameIdList,
  updateListingByAdmin,
} from "../../../../services";
import { adminSideProps } from "../../../../middlewares";
import { useAdminPage } from "../../../../hooks";
import { IndiceContext } from "../../../../contexts";
import EditMap from "../../../../components/Listings/EditMap";
import lodash from "lodash";
import EditPhotosSection from "../../../../components/admin/Listings/EditPhotosSection";
import { useListingPhotosEdit } from "../../../../hooks";
import {
  uniqueId,
  validateBigText,
  validateInteger,
  validatePrice,
  validateSmallText,
} from "../../../../utils";
import DropdownClassicAjax from "../../../../components/admin/DropdownClassicAjax";

const categoryLevelOptions = [
  { value: "firstLevel", title: "First Level", default: true },
  { value: "secondLevel", title: "Second Level" },
  { value: "thirdLevel", title: "Third Level" },
];

const cityCoords = {
  Warrington: { lat: 53.390044, lng: -2.59695 },
  Manchester: { lat: 53.48095, lng: -2.23743 },
};

const baseRadius = 500;

const cityOptions = [
  { value: "Warrington", title: "Warrington" },
  { value: "Manchester", title: "Manchester" },
];

const baseCategoryLevel = "firstLevel";

const baseCity = cityOptions[0]["value"];

const ListingsEdit = ({ categories, listing, id }) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [prevListing, setPrevListing] = useState(listing);

  const [categoryLevel, setCategoryLevel] = useState(baseCategoryLevel);
  const baseCategory = categories[categoryLevel][0]["id"];

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

  const [approved, setApproved] = useState(false);

  const [ownerId, setOwnerId] = useState(null);
  const [ownerName, setOwnerName] = useState("");

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

  const handleChangeCategoryLevel = (newLevel) => {
    setCategoryLevel(newLevel);
    setCategory(categories[newLevel][0]["id"]);
  };

  const handleChangeCity = (city) => {
    const lat = cityCoords[city].lat;
    const lng = cityCoords[city].lng;

    setCity(city);
    setCenter({ lat, lng });
    setLat(lat);
    setLng(lng);
    setRadius(baseRadius);
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
    setApproved(data.approved);
    setOwnerId(data.ownerId);
    setOwnerName(prevListing.userName);

    const adaptedImages = data.listingImages.map((image) => ({
      ...image,
      date: Date.now(),
      localId: uniqueId(),
    }));

    setLinkFiles(adaptedImages);
  }, [prevListing]);

  const listingToState = () => {
    const city = prevListing.city ?? baseCity;
    const lat = (cityCoords[city] ?? cityCoords[baseCity]).lat;
    const lng = (cityCoords[city] ?? cityCoords[baseCity]).lng;

    const listingImages = (prevListing.listingImages ?? []).map((elem) => ({
      link: elem.link,
      type: elem.type,
    }));

    return {
      name: prevListing.name ?? "",
      keyWords: prevListing.keyWords ?? "",
      categoryId: prevListing.categoryId ?? baseCategory,
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
      rentalRadius: prevListing.radius ?? baseRadius,
      listingImages,
      approved: prevListing.approved,
      ownerId: prevListing.ownerId,
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
      approved,
      ownerId,
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

      if (files.length + linkFiles.length < 1) {
        setFileError("At least one photo is required");
        hasError = true;
      }

      if (hasError) return;

      setDisabled(true);

      if (hasChanges()) {
        const formData = new FormData();
        formData.append("id", id);

        if (files) {
          files.forEach((file, index) =>
            formData.append(`files[${index}]`, file)
          );
        }

        const info = objectToSave();
        info["listingImages"] = JSON.stringify(info["listingImages"]);
        Object.keys(info).forEach((key) => formData.append(key, info[key]));

        const res = await updateListingByAdmin(formData, authToken);

        setFiles([]);
        setLinkFiles(adaptLinkPropsToLocal([...res.listingImages]));
        success.set("Updated successfully");
      } else {
        success.set("Updated successfully");
        return true;
      }
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleChangeOwner = (ownerId, ownerName) => {
    setOwnerId(ownerId);
    setOwnerName(ownerName);
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
                    { title: listing.name },
                  ]}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow">
                    <div className="p-6 space-y-6">
                      <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                        {listing.name}
                      </h2>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Base information
                        </h2>

                        <div className="flex flex-col gap-2">
                          <div className="w-full">
                            <Input
                              value={name}
                              setValue={setName}
                              error={nameError}
                              setError={setNameError}
                              label="User Name"
                              placeholder="Name of tool"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className="flex w-full gap-2">
                            <div className=" w-full sm:w-1/2">
                              <Input
                                label="Keywords:"
                                placeholder="Maximum 15, should be separated by commas"
                                labelClassName="block text-sm font-medium mb-1"
                                value={keyWords}
                                setValue={setKeyWords}
                                error={keyWordsError}
                                setError={setKeyWordsError}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className=" w-full sm:w-1/2">
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
                              />
                            </div>
                          </div>
                          <div className="flex w-full gap-2">
                            <div className="w-1/2">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="role"
                              >
                                Category Level
                              </label>
                              <DropdownClassic
                                options={categoryLevelOptions}
                                selected={categoryLevel}
                                setSelected={handleChangeCategoryLevel}
                                needSearch={false}
                              />
                            </div>

                            <div className="w-1/2">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="role"
                              >
                                Category
                              </label>
                              <DropdownClassic
                                options={categories[categoryLevel].map(
                                  (category) => ({
                                    value: category.id,
                                    title: category.name,
                                  })
                                )}
                                selected={category}
                                setSelected={setCategory}
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
                                value={minRentalDays}
                                setValue={setMinRentalDays}
                                error={minRentalDaysError}
                                setError={setMinRentalDaysError}
                                label="Min rental days"
                                placeholder="0"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <Input
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
                                label="Postcode"
                                placeholder="e.g. 55 County Laois"
                                labelClassName="block text-sm font-medium mb-1"
                                value={postcode}
                                setValue={setPostcode}
                                error={postcodeError}
                                setError={setPostcodeError}
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full admin-map-parent">
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
                      />

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Details
                        </h2>

                        <div className="w-full">
                          <Textarea
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
                            changeChecked={() => setApproved(!approved)}
                            onText="Yes"
                            offText="No"
                          />
                        </div>
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

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;

  const options = await getAdminListingEditPageOptions(
    id,
    baseSideProps.authToken
  );

  return { ...options, id };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default ListingsEdit;
