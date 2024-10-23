import React, { useState, useContext } from "react";
import {
  createCategoryBySearchWord,
  getSearchedWordById,
} from "../../../../services";
import { IndiceContext } from "../../../../contexts";
import Sidebar from "../../../../partials/admin/Sidebar";
import BreadCrumbs from "../../../../partials/admin/base/BreadCrumbs";
import Header from "../../../../partials/admin/Header";
import { useAdminPage } from "../../../../hooks";
import { adminSideProps } from "../../../../middlewares";
import DropdownClassic from "../../../../components/admin/DropdownClassic";
import InputView from "../../../../components/admin/Form/InputView";
import ImageInput from "../../../../components/admin/Form/ImageInput";
import Link from "next/link";
import ImageView from "../../../../components/admin/Form/ImageView";
import STATIC from "../../../../static";
import { getFilePath } from "../../../../utils";
import YesNoModal from "../../../../components/admin/YesNoModal";
import { useIdPage } from "../../../../hooks";

const getParentOptions = (groupedCategories, level) =>
  groupedCategories[level].map((elem, index) => ({
    value: elem.id,
    title: elem.name,
    default: index === 0,
  }));

const getBaseCategoryInfo = ({
  searchedWord,
  createdCategory,
  groupedCategories,
}) => {
  const baseLevel = createdCategory ? createdCategory["level"] : 1;
  const baseParentId = createdCategory ? createdCategory["parentId"] : null;
  const baseName = createdCategory
    ? createdCategory["name"]
    : searchedWord["name"];

  let baseParentOptions = [];

  if (baseLevel == 2) {
    baseParentOptions = getParentOptions(groupedCategories, "firstLevel");
  }

  if (baseLevel == 3) {
    baseParentOptions = getParentOptions(groupedCategories, "secondLevel");
  }

  return { baseLevel, baseParentId, baseName, baseParentOptions };
};

const createCategoryBySearch = (baseProps) => {
  const { props, authToken } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getSearchedWordById(field, authToken),
    onUpdate: (newProps) => {
      const { baseLevel, baseParentId, baseName, baseParentOptions } =
        getBaseCategoryInfo(newProps);

      setPrevCategory(newProps.createdCategory);
      setLevel(baseLevel);
      setName(baseName);
      setParentId(baseParentId);
      setParentIdOptions(baseParentOptions);
    },
  });

  const { searchedWord, groupedCategories, createdCategory } = props;

  const [prevCategory, setPrevCategory] = useState(createdCategory);
  const [submitting, setSubmitting] = useState(false);

  const [newPhoto, setNewPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(
    prevCategory?.image ? getFilePath(prevCategory.image) : null
  );
  const [openImage, setOpenImage] = useState(false);
  const [confirmModalActive, setConfirmModalActive] = useState(true);

  const handlePhotoChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewPhoto(img);
    setPhotoUrl(url);
  };

  const { baseLevel, baseParentId, baseName, baseParentOptions } =
    getBaseCategoryInfo(props);

  const { success } = useContext(IndiceContext);
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [formError, setFormError] = useState(null);

  const [level, setLevel] = useState(baseLevel);
  const [name, setName] = useState(baseName);
  const [parentId, setParentId] = useState(baseParentId);
  const [parentIdOptions, setParentIdOptions] = useState(baseParentOptions);

  const levelOptions = [
    {
      value: 1,
      title: "first level",
      default: true,
    },
    {
      value: 2,
      title: "second level",
      default: true,
    },
    {
      value: 3,
      title: "third level",
      default: true,
    },
  ];

  const handleChangeName = (name) => {
    setName(name);
    setFormError(null);
  };

  const handleChangeLevel = (level) => {
    setLevel(level);
    setFormError(null);

    if (level == 1) {
      setParentIdOptions([]);
    }

    if (level == 2) {
      const options = getParentOptions(groupedCategories, "firstLevel");

      if (options.length > 0) {
        setParentId(groupedCategories["firstLevel"][0]["id"]);
      }

      setParentIdOptions(options);
    }

    if (level == 3) {
      const options = getParentOptions(groupedCategories, "secondLevel");

      if (options.length > 0) {
        setParentId(groupedCategories["secondLevel"][0]["id"]);
      }

      setParentIdOptions(options);
    }
  };

  const handleChangeParentId = (parentId) => {
    setParentId(parentId);
    setFormError(null);
  };

  const handleSaveClick = async () => {
    setFormError(null);
    if (submitting) return;
    setSubmitting(true);

    let currentLevelName = "thirdLevel";
    if (level == 1) currentLevelName = "firstLevel";
    if (level == 2) currentLevelName = "secondLevel";

    const names = groupedCategories[currentLevelName].map(
      (category) => category.name
    );

    try {
      if (names.includes(name)) {
        throw new Error(`Category '${name}' was created earlier`);
      }

      if ((level == 2 || level == 3) && !parentId) {
        throw new Error(`Category with level '${level}' must have a parent`);
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("level", level);

      if (parentId) {
        formData.append("parentId", parentId);
      }

      formData.append("searchedWordId", searchedWord["id"]);

      if (newPhoto) {
        formData.append("photo", newPhoto);
      }

      const res = await createCategoryBySearchWord(formData, authToken);
      setPrevCategory(res);
      success.set("Category created successfully");
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <BreadCrumbs
                links={[
                  {
                    title: "Users Search Story",
                    href: "/admin/searched-words",
                  },
                  { title: "Create Category" },
                ]}
              />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
              <div className="flex flex-col">
                <div className="grow">
                  <div className="p-6 space-y-6">
                    {prevCategory && (
                      <>
                        <section className="flex gap-y-4 flex-col category-image-parent">
                          <div
                            className="col-lg-4 col-md-6"
                            style={{ cursor: "zoom-in" }}
                            onClick={() => setOpenImage(true)}
                          >
                            <div className="single-image-bpx">
                              <img
                                className="w-20 h-20"
                                src={photoUrl ?? STATIC.DEFAULTS.PHOTO_LINK}
                                alt={`${name} image`}
                              />
                            </div>
                          </div>
                          <ImageView
                            imgSrc={photoUrl}
                            open={openImage}
                            close={() => setOpenImage(false)}
                          />
                        </section>

                        <section className="flex gap-y-4 flex-col">
                          <div className="sm:flex-row gap-4 flex-col inline-flex text-slate-800 dark:text-slate-100">
                            <div className="inline-flex flex-col w-full">
                              <label className="block font-medium">
                                Search Word
                              </label>
                              <div className="form-input">
                                {searchedWord["name"]}
                              </div>
                            </div>
                            <div className="inline-flex flex-col w-full">
                              <label className="block font-medium">
                                Category Name
                              </label>
                              <div className="form-input">{name}</div>
                            </div>
                          </div>

                          <div className="sm:flex-row gap-4 flex-col inline-flex text-slate-800 dark:text-slate-100">
                            <div className="inline-flex flex-col w-full">
                              <label className="block font-medium">
                                Category Level
                              </label>
                              <div className="form-input">
                                {
                                  levelOptions.filter(
                                    (option) => option.value == level
                                  )[0]["title"]
                                }
                              </div>
                            </div>
                            <div className="inline-flex flex-col w-full">
                              <label className="block font-medium">
                                Parent Category
                              </label>

                              <div className="form-input">
                                {parentIdOptions.length > 0
                                  ? parentIdOptions.filter(
                                      (option) => option.value == parentId
                                    )[0]["title"]
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        </section>
                      </>
                    )}

                    {!prevCategory && (
                      <>
                        <section className="flex gap-y-4 flex-col category-image-parent">
                          <ImageInput
                            photoUrl={photoUrl}
                            onChange={handlePhotoChange}
                            fileSizeLimit={STATIC.LIMITS.SMALL_FILE_SIZE}
                          />
                        </section>

                        <section className="flex gap-y-4 flex-col">
                          <div className="sm:flex-row gap-4 flex-col inline-flex text-slate-800 dark:text-slate-100">
                            <div className="inline-flex flex-col w-full">
                              <InputView
                                inputClassName="form-input"
                                value={name}
                                name="name"
                                label="Category Name"
                                labelClassName="block font-medium"
                              />
                            </div>
                          </div>

                          <div className="sm:flex-row gap-4 flex-col inline-flex text-slate-800 dark:text-slate-100">
                            <div className="inline-flex flex-col w-full">
                              <label className="block font-medium">
                                Category Level
                              </label>

                              <DropdownClassic
                                options={levelOptions}
                                selected={level}
                                setSelected={handleChangeLevel}
                                needSearch={false}
                              />
                            </div>

                            {parentIdOptions.length > 0 && (
                              <div className="inline-flex flex-col w-full gap-x-4 ">
                                <label className="block font-medium">
                                  Parent Category
                                </label>

                                <DropdownClassic
                                  options={parentIdOptions}
                                  selected={parentId}
                                  setSelected={handleChangeParentId}
                                />
                              </div>
                            )}
                          </div>
                        </section>
                      </>
                    )}

                    {formError && (
                      <section className="flex gap-x-4 flex-row">
                        <div
                          className="w-full fade text-sm show bg-rose-500 text-white px-4 py-3 rounded relative"
                          role="alert"
                        >
                          <span className="block sm:inline">{formError}</span>
                        </div>
                      </section>
                    )}
                  </div>
                </div>

                <footer>
                  <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex self-end">
                      <Link
                        href="/admin/searched-words/"
                        aria-controls="access-leave-modal"
                        className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                      >
                        Cancel
                      </Link>
                      {!prevCategory && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmModalActive(true);
                          }}
                          className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
                        >
                          Create
                        </button>
                      )}
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </main>

        <YesNoModal
          title="Confirm action"
          body={`Confirmation is required to continue. Are you sure you want to create category "${name}"?`}
          modalOpen={confirmModalActive}
          handleCloseModal={() => setConfirmModalActive(false)}
          onAccept={handleSaveClick}
          acceptText="Confirm"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const searchedWordInfo = await getSearchedWordById(
    id,
    baseSideProps.authToken
  );
  return {
    ...searchedWordInfo,
    pageTitle: searchedWordInfo?.searchedWord?.name,
  };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
  });

export default createCategoryBySearch;
