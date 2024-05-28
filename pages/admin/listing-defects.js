import { useContext, useEffect, useState } from "react";
import { useAdminPage, useWindowSizeUpdate } from "../../hooks";
import { adminSideProps } from "../../middlewares";
import Header from "../../partials/admin/Header";
import Sidebar from "../../partials/admin/Sidebar";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import { getAdminListingDefectsEditOptions } from "../../services";
import { reorderList, uniqueId } from "../../utils";
import { IndiceContext } from "../../contexts";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DefectListItem from "../../partials/admin/listingDefects/DefectListItem";
import lodash from "lodash";
import { saveListingDefects } from "../../services";

const ListingDefects = ({ defects: baseDefects }) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [submitting, setSubmitting] = useState(false);
  const [prevDefects, setPrevDefects] = useState(baseDefects);
  const [listHeight, setListHeight] = useState(71.56);

  const defectsToState = (defects) =>
    defects.map((defect) => ({ ...defect, localId: uniqueId(), error: null }));

  const initDefects = defectsToState(baseDefects);
  const [defects, setDefects] = useState(initDefects);

  const stateDefectsToSave = () => {
    return defects.map((defect) => {
      const filteredElem = { ...defect };
      delete filteredElem["localId"];
      delete filteredElem["error"];

      return {
        ...filteredElem,
      };
    });
  };

  const getLocalIdErrors = (defects) => {
    let hasError = false;

    const names = {};
    const localIdErrors = {};

    defects.forEach((defect) => {
      if (defect.name.length < 1) {
        localIdErrors[defect.localId] = "Cannot save an empty defect";
        hasError = true;
        return;
      }

      if (defect.name.length > 255) {
        localIdErrors[defect.localId] =
          "Name cannot be higher than 255 symbols";
        hasError = true;
        return;
      }

      if (Object.values(names).includes(defect.name)) {
        localIdErrors[defect.localId] = "Cannot create two identical defects";
        hasError = true;

        Object.keys(names).forEach((localId) => {
          if (names[localId] == defect.name)
            localIdErrors[localId] = "Cannot create two identical defects";
        });

        return;
      }

      localIdErrors[defect.localId] = null;
      names[defect.localId] = defect.name;
    });

    return { hasError, localIdErrors };
  };

  const handleChangeName = (localId, name) => {
    setDefects((defects) => {
      const result = [];

      defects.map((defect) => {
        if (defect.localId == localId) {
          result.push({ ...defect, name, error: null });
        } else {
          result.push({ ...defect, error: null });
        }
      });

      const { hasError, localIdErrors } = getLocalIdErrors(result);

      if (hasError) {
        result.forEach((defect, i) => {
          result[i]["error"] = localIdErrors[defect.localId];
        });
      }

      return result;
    });
  };

  const handleChangeOrderIndexes = (info) => {
    setDefects((defects) => {
      const res = [...defects];

      Object.keys(info).forEach((localId) => {
        for (let i = 0; i < defects.length; i++) {
          if (res[i]["localId"] == localId) {
            res[i]["orderIndex"] = info[localId];
          }
        }
      });

      return res;
    });
  };

  const incrementAllIndex = (prev) => {
    for (let i = 0; i < prev.length; i++) {
      prev[i]["orderIndex"]++;
    }

    return prev;
  };

  const autoUpdateOrderIndexes = (prev) => {
    const allOrderIndexes = prev.map((elem) => elem["orderIndex"]);
    allOrderIndexes.sort((a, b) => a - b);

    let deletedIndex;

    for (let i = 0; i < allOrderIndexes.length - 1; i++) {
      if (allOrderIndexes[i + 1] - allOrderIndexes[i] !== 1) {
        deletedIndex = allOrderIndexes[i] + 1;
        break;
      }
    }

    if (!deletedIndex) {
      deletedIndex = allOrderIndexes[allOrderIndexes.length - 1] + 1;
    }

    for (let i = 0; i < prev.length; i++) {
      if (prev[i]["orderIndex"] > deletedIndex) {
        prev[i]["orderIndex"]--;
      }
    }

    return prev;
  };

  const handleClickRemove = (localId) => {
    setDefects((defects) => {
      const result = defects.filter((defect) => defect.localId != localId);
      return autoUpdateOrderIndexes(result);
    });
  };

  const handleClickCreate = () => {
    setDefects((defects) => {
      const result = [
        { name: "", localId: uniqueId(), id: null, error: null, orderIndex: 0 },
        ...incrementAllIndex(defects),
      ];
      return result;
    });
  };

  const checkDefectListingDoubling = (newDefects = null) => {
    if (!newDefects) newDefects = defects;

    const { hasError, localIdErrors } = getLocalIdErrors(newDefects);

    setDefects((prev) => {
      const res = [...prev];
      res.forEach(
        (defect, i) => (res[i]["error"] = localIdErrors[defect.localId])
      );
      return res;
    });

    return hasError;
  };

  const handleSaveClick = async () => {
    if (submitting) return;

    setSubmitting(true);

    const hasError = checkDefectListingDoubling();

    if (hasError) {
      setSubmitting(false);
      return;
    }

    try {
      const defectsToSave = stateDefectsToSave();

      if (!lodash.isEqual(defectsToSave, prevDefects)) {
        const createdDefects = await saveListingDefects(
          { defects: defectsToSave },
          authToken
        );

        setPrevDefects(createdDefects);
        setDefects(defectsToState(createdDefects));
      }

      success.set("Defects saved successfully");
    } catch (err) {
      error.set(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    const newItems = reorderList(defects, startIndex, endIndex);

    const updatedItems = newItems.map((item, index) => {
      return {
        ...item,
        orderIndex: index,
      };
    });

    setDefects(updatedItems);

    const orderIndexesToUpdate = {};

    updatedItems.forEach(
      (updatedItem) =>
        (orderIndexesToUpdate[updatedItem["localId"]] =
          updatedItem["orderIndex"])
    );

    handleChangeOrderIndexes(orderIndexesToUpdate);
  };

  const updateListHeight = () => {
    let height = 0;

    document
      .querySelectorAll(".defect-list-item")
      .forEach((elem) => (height += elem.scrollHeight));

    setListHeight(height + 1);
  };

  useWindowSizeUpdate(updateListHeight);

  useEffect(() => {
    updateListHeight();
  }, [JSON.stringify(defects)]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <BreadCrumbs links={[{ title: "Listing Defects" }]} />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:-mr-px">
                <div className="grow">
                  <div className="p-6">
                    <h2 className="flex items-center justify-between text-2xl text-slate-800 dark:text-slate-100 font-bold">
                      Defect options
                      <button
                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-indigo-400"
                        onClick={handleClickCreate}
                      >
                        <svg
                          className="w-4 h-4 fill-current opacity-50 shrink-0"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                        </svg>

                        <span className="hidden xs:block ml-2">Add New</span>
                      </button>
                    </h2>
                  </div>

                  <div className="p-6 space-y-6 pt-0">
                    <section className="flex gap-y-4 flex-col">
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              style={{
                                height: listHeight + "px",
                              }}
                            >
                              {defects.map((elem, index) => (
                                <Draggable
                                  key={elem.localId}
                                  draggableId={`${elem.localId}`}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="defect-list-item"
                                    >
                                      <DefectListItem
                                        name={elem.name}
                                        error={elem.error}
                                        onChangeName={(name) =>
                                          handleChangeName(elem.localId, name)
                                        }
                                        onDeleteAccept={() =>
                                          handleClickRemove(elem.localId)
                                        }
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </section>

                    <div className="mb-8">
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveClick}
                          disabled={submitting}
                          className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-indigo-400"
                        >
                          <span className="hidden xs:block">Save Defects</span>
                        </button>
                      </div>
                    </div>
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

const boostServerSideProps = async ({ baseSideProps }) => {
  const defects = await getAdminListingDefectsEditOptions(
    baseSideProps.authToken
  );
  return { defects };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default ListingDefects;
