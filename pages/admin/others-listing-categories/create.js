import { useContext, useState } from "react";
import { adminSideProps } from "../../../middlewares";
import { getAdminCreateCategoryByOthersOptions } from "../../../services";
import { IndiceContext } from "../../../contexts";
import { useAdminPage } from "../../../hooks";
import { useRouter } from "next/router";
import { createCategoryByOther } from "../../../services/listingCategories";
import DropdownClassic from "../../../components/admin/DropdownClassic";
import InputView from "../../../components/admin/Form/InputView";
import Link from "next/link";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import ImageInput from "../../../components/admin/Form/ImageInput";
import STATIC from "../../../static";
import YesNoModal from "../../../components/admin/YesNoModal";
import { useIdPage } from "../../../hooks";

const CreateCategory = (baseProps) => {
  const router = useRouter();
  const { name: baseName } = router.query;

  const { props } = useIdPage({
    baseProps,
    observingField: "name",
    getPagePropsFunc: ({ authToken }) =>
      getAdminCreateCategoryByOthersOptions(authToken),
    onUpdate: (newProps, newName) => setName(newName),
  });

  const { groupedCategories } = props;

  const [submitting, setSubmitting] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [confirmModalActive, setConfirmModalActive] = useState(true);

  const { success, authToken } = useContext(IndiceContext);
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [level, setLevel] = useState(1);
  const [name, setName] = useState(baseName);
  const [parentId, setParentId] = useState(null);
  const [parentIdOptions, setParentIdOptions] = useState([]);

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

  const handlePhotoChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewPhoto(img);
    setPhotoUrl(url);
  };
  const getParentOptions = (level) =>
    groupedCategories[level].map((elem, index) => ({
      value: elem.id,
      title: elem.name,
      default: index === 0,
    }));

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
      formData.append("baseName", name);

      if (parentId) {
        formData.append("parentId", parentId);
      }

      if (newPhoto) {
        formData.append("photo", newPhoto);
      }

      await createCategoryByOther(formData, authToken);

      success.set(`Listing "${name}" created successfully!`);
      router.push(`/admin/others-listing-categories/`);
    } catch (e) {
      setFormError(e.message);
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
                        href="/admin/others-listing-categories/"
                        aria-controls="access-leave-modal"
                        className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                      >
                        Cancel
                      </Link>
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

const boostServerSideProps = async ({ baseSideProps }) => {
  const data = await getAdminCreateCategoryByOthersOptions(
    baseSideProps.authToken
  );
  return { ...data };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Create category" },
  });

export default CreateCategory;
