import React, { useState, useEffect } from "react";
import Input from "../../../components/admin/Form/Input";
import DropdownClassic from "../../../components/admin/DropdownClassic";
import ModalBlank from "../../../components/admin/ModalBlank";
import ErrorSpan from "../../../components/admin/ErrorSpan";
import ImageInput from "../../../components/admin/Form/ImageInput";
import STATIC from "../../../static";
import { getFilePath, getNumberLevelByName } from "../../../utils";

const CategoryListItem = ({
  popular,
  name,
  image,
  localId,
  categories,
  imageFile = null,
  hasParent = false,
  parentLocalId = null,
  parentOptions,
  checkHasError,
  onChangeParent = (value) => {},
  onChangeName = (value) => {},
  onChangePhoto = (value) => {},
  onPopularClick = () => {},
  onDeleteClick = () => {},
  error = null,
  deletePopupMessage = null,
  isNew = false,
}) => {
  const [defaultNewCategory, setDefaultNewCategory] = useState(null);
  const [categoriesToChangeOptions, setCategoriesToChangeOptions] = useState(
    []
  );
  const [categoriesToChange, setCategoriesToChange] = useState([]);

  useEffect(() => {
    const firstSecondLevelCategoriesIdsToIgnore = [];

    ["firstLevel", "secondLevel"].forEach((level) =>
      categories[level]
        .filter(
          (category) =>
            category.parentLocalId == localId || category.localId == localId
        )
        .forEach((category) =>
          firstSecondLevelCategoriesIdsToIgnore.push(category.localId)
        )
    );

    const totalCategoriesIdsToIgnore = [
      ...firstSecondLevelCategoriesIdsToIgnore,
    ];

    categories["thirdLevel"]
      .filter(
        (category) =>
          firstSecondLevelCategoriesIdsToIgnore.includes(
            category.parentLocalId
          ) || category.localId === localId
      )
      .forEach((category) => totalCategoriesIdsToIgnore.push(category.localId));

    const options = [];
    const categoriesToChange = [];

    Object.keys(categories).forEach((level) => {
      categories[level].forEach((category) => {
        if (!totalCategoriesIdsToIgnore.includes(category.localId)) {
          categoriesToChange.push({
            ...category,
            level: getNumberLevelByName(level),
          });
          options.push({
            value: category.name,
            title: category.name,
            default: options.length == 0,
            key: category.localId,
          });
        }
      });
    });

    setCategoriesToChange(categoriesToChange);
    setCategoriesToChangeOptions(options);
    setDefaultNewCategory(categoriesToChange[0]);
  }, [categories]);

  const [newChildCategory, setNewChildCategory] = useState(null);
  const [newChildCategoryError, setNewChildCategoryError] = useState(null);

  const handleChangeNewChildCategory = (name) => {
    const filtered = categoriesToChange.filter((elem) => elem.name === name);
    setNewChildCategory(filtered[0]);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const onDeleteAccept = () => {
    if (newChildCategory) {
      onDeleteClick(newChildCategory);
      setNewChildCategory(null);
    } else {
      setNewChildCategoryError(
        "You cannot delete a category without replacing it for children"
      );
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();

    if (isNew) {
      onDeleteClick();
      setNewChildCategory(null);
      return;
    }

    if (checkHasError()) return;

    if (deletePopupMessage) {
      setModalOpen(true);
      setNewChildCategory(defaultNewCategory);
      setNewChildCategoryError(null);
    } else {
      onDeleteAccept();
    }
  };

  let photoUrl = null;

  if (imageFile) {
    photoUrl = image;
  } else if (image) {
    photoUrl = getFilePath(image);
  }

  return (
    <div className="category-list-item">
      <div
        className={
          "shadow rounded-sm border px-5 py-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        }
      >
        <div className="md:flex justify-between items-center space-y-4 md:space-y-0 space-x-2 gap-x-4">
          <div className="flex items-center space-x-3 md:space-x-4 w-full">
            <div className="flex-col inline-flex text-slate-800 dark:text-slate-100 relative w-full">
              <Input
                inputClassName="form-input w-full"
                value={name}
                name="name"
                label="Name"
                labelClassName="block text-sm font-medium relative-label"
                setValue={onChangeName}
              />
            </div>
          </div>
          <div
            className="flex flex-col xs:flex-row space-x-4 gap-4 items-start sm:items-center sm:justify-between md:justify-start"
            style={{ marginLeft: "0" }}
          >
            <div
              className="category-list-item-image"
              style={{ marginLeft: "0" }}
            >
              <ImageInput
                btnText="Change"
                photoUrl={photoUrl}
                fileSizeLimit={STATIC.LIMITS.SMALL_FILE_SIZE}
                onChange={onChangePhoto}
              />
            </div>

            {hasParent && (
              <div
                className="inline-flex text-slate-800 dark:text-slate-100 relative listing-categories-parent-select"
                style={{ marginLeft: "0" }}
              >
                <label className="block text-sm font-medium relative-label">
                  Parent Name
                </label>
                <DropdownClassic
                  options={parentOptions}
                  selected={parentLocalId}
                  setSelected={onChangeParent}
                />
              </div>
            )}

            <div style={{ marginLeft: 0 }} className="flex gap-x-4">
              <div
                onClick={onPopularClick}
                className={`transition ease-in-out duration-150 w-20 justify-center cursor-pointer text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${
                  popular
                    ? "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-400/30 dark:hover:bg-emerald-300/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-100 hover:bg-red-200 dark:bg-red-400/30 dark:hover:bg-red-300/30 text-red-600 dark:text-red-400"
                }`}
              >
                {popular ? "Popular" : "Unpopular"}
              </div>

              <button
                onClick={handleDeleteClick}
                className="text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500"
                style={{ marginLeft: 0 }}
              >
                <span className="sr-only">Delete</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-x"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#656565"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {deletePopupMessage && (
          <ModalBlank
            id="access-delete-category-listing-modal"
            modalOpen={modalOpen}
            setModalOpen={() => {
              setModalOpen(false);
              setNewChildCategory(null);
            }}
          >
            <div className="p-5 flex space-x-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100 dark:bg-rose-500/30">
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-rose-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                </svg>
              </div>
              <div className="w-full">
                <div className="mb-2">
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Delete category?
                  </div>
                </div>
                <div
                  className={
                    newChildCategoryError ? "text-sm mb-3" : "text-sm mb-10"
                  }
                >
                  <div className="space-y-2">
                    <p
                      dangerouslySetInnerHTML={{ __html: deletePopupMessage }}
                    ></p>
                    <DropdownClassic
                      options={categoriesToChangeOptions}
                      selected={newChildCategory?.name}
                      setSelected={handleChangeNewChildCategory}
                    />
                    <ErrorSpan error={newChildCategoryError} />
                  </div>
                </div>

                <div className="flex flex-wrap justify-end space-x-2">
                  <button
                    className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOpen(false);
                      setNewChildCategory(null);
                    }}
                  >
                    No, Close
                  </button>
                  <button
                    onClick={onDeleteAccept}
                    className="btn bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </ModalBlank>
        )}
      </div>

      {error && <ErrorSpan error={error} />}
    </div>
  );
};

export default CategoryListItem;
