import React, { useState, useEffect, useContext } from "react";
import {
  createCategoryBySearchWord,
  getSearchedWordById,
} from "../../../services";
import { IndiceContext } from "../../../contexts";
import Sidebar from "../../../partials/admin/Sidebar";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Header from "../../../partials/admin/Header";
import { useAdminPage } from "../../../hooks";
import { adminSideProps } from "../../../middlewares";
import DropdownClassic from "../../../components/admin/DropdownClassic";
import Input from "../../../components/admin/Form/Input";
import Link from "next/link";

const createCategoryBySearch = ({
  searchedWord,
  groupedCategories,
  createdCategory,
}) => {
  const [prevCategory, setPrevCategory] = useState(createdCategory);
  const [submitting, setSubmitting] = useState(false);

  const baseLevel = createdCategory ? createdCategory["level"] : 1;
  const baseParentId = createdCategory ? createdCategory["parentId"] : null;

  const baseName = createdCategory
    ? createdCategory["name"]
    : searchedWord["name"];

  const getParentOptions = (level) =>
    groupedCategories[level].map((elem, index) => ({
      value: elem.id,
      title: elem.name,
      default: index === 0,
    }));

  const { error, success, authToken } = useContext(IndiceContext);
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [level, setLevel] = useState(baseLevel);
  const [name, setName] = useState(baseName);
  const [parentId, setParentId] = useState(baseParentId);

  let baseParentOptions = [];

  if (baseLevel == 2) {
    baseParentOptions = getParentOptions("firstLevel");
  }

  if (baseLevel == 3) {
    baseParentOptions = getParentOptions("thirdLevel");
  }

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

  const [formError, setFormError] = useState(null);

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
      const options = getParentOptions("firstLevel");
      if (options.length > 0) {
        setParentId(groupedCategories["firstLevel"][0]["id"]);
      }
      setParentIdOptions(options);
    }

    if (level == 3) {
      const options = getParentOptions("secondLevel");
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

      const res = await createCategoryBySearchWord(
        { name, level, parentId, searchedWordId: searchedWord["id"] },
        authToken
      );
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
                                : ""}
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    {!prevCategory && (
                      <section className="flex gap-y-4 flex-col">
                        <div className="sm:flex-row gap-4 flex-col inline-flex text-slate-800 dark:text-slate-100">
                          <div className="inline-flex flex-col w-full">
                            <Input
                              inputClassName="form-input"
                              value={name}
                              label="Category Name"
                              labelClassName="block font-medium"
                              setValue={handleChangeName}
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
                    )}

                    {formError && (
                      <section className="flex gap-x-4 flex-row">
                        <div
                          className="w-full fade text-sm show bg-red-500 text-white px-4 py-3 rounded relative"
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
                        href="/admin/searched-words"
                        aria-controls="access-leave-modal"
                        className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                      >
                        Cancel
                      </Link>
                      {!prevCategory && (
                        <button
                          type="button"
                          onClick={handleSaveClick}
                          className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
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
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const baseSideProps = await adminSideProps(context);
  const id = context.params.id;

  if (baseSideProps.notFound || !id) {
    return {
      notFound: true,
    };
  }

  try {
    const res = await getSearchedWordById(id, baseSideProps.props.authToken);

    return {
      props: { ...baseSideProps.props, ...res },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default createCategoryBySearch;
