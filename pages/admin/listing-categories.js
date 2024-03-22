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
  const [replaceDeleteInfosCategories, setReplaceDeleteInfosCategories] =
    useState([]);

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

          if (!parentLocalId) {
            parentLocalId = initCategories["firstLevel"][0].localId;
            parentName = initCategories["firstLevel"][0].name;
          }
        }

        if (level == "thirdLevel") {
          initCategories["secondLevel"].forEach((initCategory) => {
            if (initCategory.id === parentId) {
              parentLocalId = initCategory.localId;
              parentName = initCategory.name;
            }
          });

          if (!parentLocalId) {
            parentLocalId = initCategories["secondLevel"][0].localId;
            parentName = initCategories["secondLevel"][0].name;
          }
        }

        initCategories[level].push({
          ...category,
          localId: uniqueId(),
          error: null,
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
    const newCategories = { ...categories };

    for (let i = 0; i < newCategories[level].length; i++) {
      if (newCategories[level][i]["localId"] === localId) {
        newCategories[level][i][field] = value;
      }
    }

    setCategories(newCategories);
    checkCategoryListingDoubling(newCategories);
  };

  const handleChangePhoto = ({ localId, level, image }) => {
    setCategories((prev) => {
      const res = { ...prev };

      for (let i = 0; i < res[level].length; i++) {
        if (res[level][i]["localId"] === localId) {
          const url = URL.createObjectURL(image);
          res[level][i]["image"] = url;
          res[level][i]["imageFile"] = image;
        }
      }

      return res;
    });
  };

  const checkCategoryListingDoubling = (newCategories = null) => {
    if (!newCategories) newCategories = categories;

    let hasError = false;

    const names = {};
    const localIdErrors = {};

    Object.keys(newCategories).forEach((key) => {
      newCategories[key].forEach((category) => {
        if (category.name.length < 1) {
          localIdErrors[category.localId] = "Cannot save an empty category";
          hasError = true;
          return;
        }

        if (category.name.length > 255) {
          localIdErrors[category.localId] =
            "Name cannot be higher than 255 symbols";
          hasError = true;
          return;
        }

        if (Object.values(names).includes(category.name)) {
          localIdErrors[category.localId] =
            "Cannot create two identical categories";
          hasError = true;

          Object.keys(names).forEach(
            (localId) =>
              (localIdErrors[localId] =
                "Cannot create two identical categories")
          );

          return;
        }

        localIdErrors[category.localId] = null;
        names[category.localId] = category.name;
      });
    });

    setCategories((prev) => {
      const res = { ...prev };

      Object.keys(res).forEach((level) => {
        res[level].forEach((category, i) => {
          res[level][i]["error"] = localIdErrors[category.localId];
        });
      });

      return res;
    });

    return hasError;
  };

  const handleRemove = ({ localId, newChildCategory }) => {
    const firstSecondLevelIdsToDelete = [];
    const categoriesToDelete = [];

    Object.keys(categories).forEach((key) =>
      categories[key]
        .filter(
          (elem) => elem.parentLocalId == localId || elem.localId == localId
        )
        .forEach((elem) => firstSecondLevelIdsToDelete.push(elem.localId))
    );

    Object.keys(categories).forEach((key) =>
      categories[key]
        .filter(
          (elem) =>
            firstSecondLevelIdsToDelete.includes(elem.parentLocalId) ||
            firstSecondLevelIdsToDelete.includes(elem.localId)
        )
        .forEach((elem) => categoriesToDelete.push({ ...elem }))
    );

    const categoriesToDeleteIds = categoriesToDelete.map(
      (category) => category.localId
    );

    setReplaceDeleteInfosCategories((prev) => {
      prev = prev.map((elem) =>
        categoriesToDeleteIds.includes(elem.newChildCategory.localId)
          ? { ...elem, newChildCategory }
          : elem
      );

      Object.keys(categories).forEach((key) =>
        categories[key].forEach((category) => {
          if (categoriesToDeleteIds.includes(category.localId) && category.id) {
            prev = [
              {
                deletedId: category.id,
                deletedName: category.name,
                newChildCategory,
              },
              ...prev,
            ];
          }
        })
      );

      return prev;
    });

    setCategories((prev) => {
      const res = { firstLevel: [], secondLevel: [], thirdLevel: [] };

      Object.keys(prev).forEach((level) => {
        res[level] = prev[level].filter(
          (category) => !categoriesToDeleteIds.includes(category.localId)
        );
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
    handleRemove: ({ localId, newChildCategory }) =>
      handleRemove({ localId, newChildCategory }),
    handleCreate: () => handleCreate(level),
    handleChangePhoto: ({ localId, image }) =>
      handleChangePhoto({ localId, level, image }),
    list: categories[level],
    categories,
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

    const hasError = checkCategoryListingDoubling();

    if (hasError) {
      setSubmitting(false);
      return;
    }

    const dataToSave = new FormData();
    const dataToCompare = { firstLevel: [], secondLevel: [], thirdLevel: [] };

    Object.keys(categories).forEach((level) => {
      categories[level].forEach((category, index) => {
        const categoryToSave = { ...category };

        delete categoryToSave["parentLocalId"];
        delete categoryToSave["localId"];
        delete categoryToSave["parentName"];

        const parent = findCategoryByLocalId(category.parentLocalId);

        if (category.id) {
          dataToSave.append(
            `categoriesToSave[${level}][${index}][id]`,
            category.id
          );
        }

        if (category.level) {
          dataToSave.append(
            `categoriesToSave[${level}][${index}][level]`,
            category.level
          );
        }

        dataToSave.append(
          `categoriesToSave[${level}][${index}][name]`,
          category.name
        );

        if (category.popular) {
          dataToSave.append(`categoriesToSave[${level}][${index}][popular]`, 1);
        }

        if (parent?.id) {
          dataToSave.append(
            `categoriesToSave[${level}][${index}][parentId]`,
            parent.id
          );
        }

        if (parent?.name) {
          dataToSave.append(
            `categoriesToSave[${level}][${index}][parentName]`,
            parent.name
          );
        }

        if (category.imageFile ?? category.image) {
          dataToSave.append(
            `categoriesToSave[${level}][${index}][image]`,
            category.imageFile ?? category.image
          );
        }

        dataToCompare[level].push({
          id: category.id,
          level: category.level,
          name: category.name,
          popular: category.popular,
          parentId: parent?.id ?? null,
          image: category.imageFile ?? category.image,
        });
      });
    });

    try {
      if (!lodash.isEqual(prevCategories, dataToCompare)) {
        replaceDeleteInfosCategories.forEach((info, index) => {
          const newId = info["newChildCategory"]["id"] ?? null;
          const newName = info["newChildCategory"]["name"];
          const newLevel = info["newChildCategory"]["level"];
          const prevId = info["deletedId"];

          dataToSave.append(`categoriesToReplace[${index}][prevId]`, prevId);

          if (newId) {
            dataToSave.append(`categoriesToReplace[${index}][newId]`, newId);
          }

          dataToSave.append(`categoriesToReplace[${index}][newName]`, newName);
          dataToSave.append(
            `categoriesToReplace[${index}][newLevel]`,
            newLevel
          );
        });

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

            <CategoryList
              checkCategoryListingDoubling={checkCategoryListingDoubling}
              deletePopupMessage={
                "Are you sure you want to delete this category?<br/> (all subcategories will be deleted too)"
              }
              parentOptions={firstLevelOptions}
              canCreate={true}
              name="First Level"
              {...getLevelInfo("firstLevel")}
            />

            <CategoryList
              checkCategoryListingDoubling={checkCategoryListingDoubling}
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
              checkCategoryListingDoubling={checkCategoryListingDoubling}
              deletePopupMessage={
                "Are you sure you want to delete this category?"
              }
              parentOptions={thirdLevelOptions}
              name="Third Level"
              hasParent={true}
              disabledReason="Can't be created without second level category"
              {...getLevelInfo("thirdLevel")}
            />

            <div className="mb-8">
              <div className="flex justify-end">
                <button
                  onClick={handleSaveClick}
                  disabled={submitting}
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-indigo-400"
                >
                  <span className="hidden xs:block">Save Categories</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const boostServerSideProps = async () => {
  const categories = await getListingCategoriesList();

  return { categories };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default ListingCategories;