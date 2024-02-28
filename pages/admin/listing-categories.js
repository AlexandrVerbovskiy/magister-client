import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import { adminSideProps } from "../../middlewares";
import { useAdminPage } from "../../hooks";
import { IndiceContext } from "../../contexts";
import {
  getListingCategoriesList,
  saveListingCategories,
} from "../../services/listingCategories";
import CategoryList from "../../partials/admin/listingCategories/CategoryList";
import { uniqueId } from "../../utils";
import lodash from "lodash";

const ListingCategories = ({ categories: baseCategories }) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [submitting, setSubmitting] = useState(false);
  const [prevCategories, setPrevCategories] = useState(baseCategories);

  const categoriesToState = (categories) => {
    const initCategories = {};

    ["firstLevel", "secondLevel", "thirdLevel"].forEach((level) => {
      initCategories[level] = [];
      categories[level].forEach((category) => {
        const parentId = category.parentId;
        let parentLocalId = null;
        let parentName = "";

        if (level == "secondLevel") {
          initCategories["firstLevel"].forEach((initCategory) => {
            if (initCategory.id === parentId) {
              parentLocalId = initCategory.localId;
              parentName = initCategory.name;
            }
          });
        }

        if (level == "thirdLevel") {
          initCategories["secondLevel"].forEach((initCategory) => {
            if (initCategory.id === parentId) {
              parentLocalId = initCategory.localId;
              parentName = initCategory.name;
            }
          });
        }

        initCategories[level].push({
          ...category,
          localId: uniqueId(),
          error: null,
          parentLocalId: null,
          parentId,
          parentLocalId,
          parentName,
        });
      });
    });

    return initCategories;
  };

  const getParentOptions = (list = []) => {
    const levelOptions = [];

    list.forEach((category) => {
      if (category.name.length > 0) {
        levelOptions.push({
          value: category.localId,
          title: category.name,
          default: levelOptions.length < 1,
        });
      }
    });

    return levelOptions;
  };

  const initCategories = categoriesToState(baseCategories);

  const initFirstOptions = getParentOptions([]);
  const initSecondOptions = getParentOptions(initCategories["firstLevel"]);
  const initThirdOptions = getParentOptions(initCategories["secondLevel"]);

  const [categories, setCategories] = useState(initCategories);
  const [firstLevelOptions, setFirstLevelOptions] = useState(initFirstOptions);
  const [secondLevelOptions, setSecondLevelOptions] =
    useState(initSecondOptions);
  const [thirdLevelOptions, setThirdLevelOptions] = useState(initThirdOptions);

  useEffect(() => {
    setFirstLevelOptions(getParentOptions([]));
    setSecondLevelOptions(getParentOptions(categories["firstLevel"]));
    setThirdLevelOptions(getParentOptions(categories["secondLevel"]));
  }, [categories]);

  const handleChangeField = ({ localId, level, field, value }) => {
    setCategories((prev) => {
      const res = { ...prev };

      for (let i = 0; i < res[level].length; i++) {
        if (res[level][i]["localId"] === localId) {
          res[level][i][field] = value;
        }
      }

      return res;
    });
  };

  const handleRemove = ({ level, localId }) => {
    setCategories((prev) => {
      const res = { ...prev };
      res[level] = res[level].filter((elem) => elem.localId !== localId);

      const parentLocalIdsToDelete = [localId];

      Object.keys(res).forEach((key) =>
        res[key]
          .filter((elem) => elem.parentLocalId == localId)
          .forEach((elem) => parentLocalIdsToDelete.push(elem.localId))
      );

      Object.keys(res).forEach((key) => {
        const resKey = [];

        res[key].forEach((elem) => {
          if (
            !(
              parentLocalIdsToDelete.includes(elem.localId) ||
              parentLocalIdsToDelete.includes(elem.parentLocalId)
            )
          ) {
            resKey.push(elem);
          }
        });

        res[key] = resKey;
      });

      return res;
    });
  };

  const handleCreate = (level) => {
    setCategories((prev) => {
      const res = { ...prev };

      let parentName = "";
      let parentLocalId = null;

      if (level == "secondLevel") {
        secondLevelOptions.forEach((option) => {
          if (option.default) {
            parentName = option["title"];
            parentLocalId = option["value"];
          }
        });
      }

      if (level == "thirdLevel") {
        thirdLevelOptions.forEach((option) => {
          if (option.default) {
            parentName = option["title"];
            parentLocalId = option["value"];
          }
        });
      }

      res[level] = [
        {
          name: "",
          parentName,
          parentLocalId,
          error: null,
          parentId: null,
          popular: false,
          localId: uniqueId(),
        },
        ...res[level],
      ];

      return res;
    });
  };

  const getLevelInfo = (level) => ({
    handleChangeField: ({ localId, field, value }) =>
      handleChangeField({ level, localId, field, value }),
    handleRemove: (localId) => handleRemove({ level, localId }),
    handleCreate: () => handleCreate(level),
    list: categories[level],
  });

  const findCategoryByLocalId = (localId) => {
    let res = null;

    Object.keys(categories).forEach((level) => {
      categories[level].forEach((category) => {
        if (category.localId == localId) {
          res = category;
        }
      });
    });

    return res;
  };

  const handleSaveClick = async () => {
    if (submitting) return;

    setSubmitting(true);

    let hasError = false;

    const names = {
      firstLevel: [],
      secondLevel: [],
      thirdLevel: [],
    };

    Object.keys(categories).forEach((key) => {
      categories[key].forEach((category) => {
        if (category.name.length < 1) {
          handleChangeField({
            localId: category.localId,
            level: key,
            field: "error",
            value: "Cannot save an empty category",
          });

          hasError = true;
          return;
        }

        if (names[key].includes(category.name)) {
          handleChangeField({
            localId: category.localId,
            level: key,
            field: "error",
            value: "Cannot create two identical categories",
          });

          hasError = true;
        }

        names[key].push(category.name);
      });
    });

    if (hasError) {
      setSubmitting(false);
      return;
    }

    const dataToSave = { firstLevel: [], secondLevel: [], thirdLevel: [] };
    const dataToCompare = { firstLevel: [], secondLevel: [], thirdLevel: [] };

    Object.keys(categories).forEach((level) => {
      categories[level].forEach((category) => {
        const categoryToSave = { ...category };

        delete categoryToSave["parentLocalId"];
        delete categoryToSave["localId"];
        delete categoryToSave["parentName"];

        const parent = findCategoryByLocalId(category.parentLocalId);
        dataToSave[level].push({
          id: category.id,
          level: category.level,
          name: category.name,
          popular: category.popular,
          parentId: parent?.id ?? null,
          parentName: parent?.name ?? null,
        });

        dataToCompare[level].push({
          id: category.id,
          level: category.level,
          name: category.name,
          popular: category.popular,
          parentId: parent?.id ?? null,
        });
      });
    });

    try {
      if (!lodash.isEqual(prevCategories, dataToCompare)) {
        const res = await saveListingCategories(dataToSave, authToken);
        setPrevCategories(res);
        setCategories(categoriesToState(res));
      }

      success.set("Categories saved successfully");
    } catch (err) {
      error.set(err.message);
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
              <BreadCrumbs links={[{ title: "Listing Categories" }]} />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:-mr-px">
                <CategoryList
                  deletePopupMessage={
                    "Are you sure you want to delete this category?<br/> (all subcategories will be deleted too)"
                  }
                  parentOptions={firstLevelOptions}
                  canCreate={true}
                  name="First Level"
                  {...getLevelInfo("firstLevel")}
                />

                <CategoryList
                  deletePopupMessage={
                    "Are you sure you want to delete this category?<br/> (all subcategories will be deleted too)"
                  }
                  parentOptions={secondLevelOptions}
                  name="Second Level"
                  hasParent={true}
                  disabledReason="Can't be created without first level category"
                  {...getLevelInfo("secondLevel")}
                />

                <CategoryList
                  deletePopupMessage={
                    "Are you sure you want to delete this category?"
                  }
                  parentOptions={thirdLevelOptions}
                  name="Third Level"
                  hasParent={true}
                  disabledReason="Can't be created without second level category"
                  {...getLevelInfo("thirdLevel")}
                />

                <div className="grow">
                  <div className="border-t border-slate-200 dark:border-slate-700 p-6 space-y-6 flex justify-end">
                    <button
                      onClick={handleSaveClick}
                      disabled={submitting}
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-indigo-400"
                    >
                      <span className="hidden xs:block ml-2">
                        Save Categories
                      </span>
                    </button>
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

export const getServerSideProps = async (context) => {
  const baseSideProps = await adminSideProps(context);

  if (baseSideProps.notFound) {
    return {
      notFound: true,
    };
  }

  try {
    const categories = await getListingCategoriesList();

    return {
      props: { ...baseSideProps.props, categories },
    };
  } catch (e) {
    console.log(e);

    return {
      notFound: true,
    };
  }
};

export default ListingCategories;
