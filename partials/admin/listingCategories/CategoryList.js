import React, { useEffect, useState, useRef } from "react";
import CategoryListItem from "./CategoryListItem";
import Tooltip from "../../../components/admin/Tooltip";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import lodash from "lodash";
import { reorderList } from "../../../utils";
import { useWindowSizeUpdate } from "../../../hooks";

const CategoryList = ({
  name,
  categories,
  handleChangeField,
  handleChangeFieldList,
  handleRemove,
  handleCreate,
  handleChangePhoto,
  checkCategoryListingDoubling,
  list = [],
  hasParent = false,
  parentOptions = [{ value: "", title: "-", default: true }],
  disabledReason = null,
  canCreate = null,
  getDeletePopupMessage = null,
  handleChangeOrderIndexes,
}) => {
  const [state, setState] = useState({ items: [] });
  const [listHeight, setListHeight] = useState(0);
  const categoryListRef = useRef(null);

  if (!lodash.isEqual(state.items, list)) {
    list = list.sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex));

    setState({ items: list });
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    const newItems = reorderList(state.items, startIndex, endIndex);

    const updatedItems = newItems.map((item, index) => {
      return {
        ...item,
        orderIndex: index,
      };
    });

    setState({
      items: updatedItems,
    });

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

    categoryListRef.current
      .querySelectorAll(".category-list-item")
      .forEach((elem) => (height += elem.offsetHeight));

    setListHeight(height + 1);
  };

  useWindowSizeUpdate(updateListHeight);

  useEffect(() => {
    updateListHeight();
  }, [JSON.stringify(list)]);

  if (canCreate === null) canCreate = parentOptions.length > 0;

  const createButton = (
    <button
      className="btn bg-teal-500 hover:bg-teal-600 text-white disabled:bg-teal-400"
      onClick={handleCreate}
      disabled={!canCreate}
    >
      <svg
        className="w-4 h-4 fill-current opacity-50 shrink-0"
        viewBox="0 0 16 16"
      >
        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
      </svg>

      <span className="hidden xs:block ml-2">Add New</span>
    </button>
  );

  return (
    <div
      ref={categoryListRef}
      className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8"
    >
      <div className="flex flex-col md:-mr-px">
        <div className="grow">
          <div className="p-6">
            <h2 className="flex items-center justify-between text-2xl text-slate-800 dark:text-slate-100 font-bold">
              {name}

              {!canCreate && disabledReason && (
                <Tooltip
                  className="text-sm create-listing-category-button"
                  title={disabledReason}
                >
                  {createButton}
                </Tooltip>
              )}
              {(canCreate || !disabledReason) && createButton}
            </h2>
          </div>

          {state.items.length > 0 && (
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
                        {state.items.map((elem, index) => (
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
                              >
                                <CategoryListItem
                                  deletePopupMessage={getDeletePopupMessage(
                                    elem.name
                                  )}
                                  parentOptions={parentOptions}
                                  key={elem.localId}
                                  categories={categories}
                                  {...elem}
                                  hasParent={hasParent}
                                  checkHasError={checkCategoryListingDoubling}
                                  onChangePhoto={(e) => {
                                    if (e.target.files.length) {
                                      handleChangePhoto({
                                        localId: elem.localId,
                                        image: e.target.files[0],
                                      });
                                    }
                                  }}
                                  onChangeParent={(value) => {
                                    handleChangeField({
                                      localId: elem.localId,
                                      value,
                                      field: "parentLocalId",
                                    });
                                  }}
                                  onChangeName={(value) => {
                                    handleChangeFieldList({
                                      localId: elem.localId,
                                      data: [
                                        { value, field: "name" },
                                        { value: null, field: "error" },
                                      ],
                                    });
                                  }}
                                  onPopularClick={() =>
                                    handleChangeField({
                                      localId: elem.localId,
                                      value: !elem.popular,
                                      field: "popular",
                                    })
                                  }
                                  onDeleteClick={(newChildCategory) => {
                                    handleRemove({
                                      localId: elem.localId,
                                      newChildCategory,
                                    });
                                  }}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
