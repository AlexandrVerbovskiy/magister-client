import React from "react";
import CategoryListItem from "./CategoryListItem";
import Tooltip from "../../../components/admin/Tooltip";

const CategoryList = ({
  name,
  handleChangeField,
  handleRemove,
  handleCreate,
  list = [],
  hasParent = false,
  parentOptions = [{ value: "", title: "-", default: true }],
  disabledReason = null,
  canCreate = null,
  deletePopupMessage = null,
}) => {
  if (canCreate === null) canCreate = parentOptions.length > 0;

  const createButton = (
    <button
      className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-indigo-400"
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
    <div className="grow">
      <div className="border-t border-slate-200 dark:border-slate-700 p-6">
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

      {list.length > 0 && (
        <div className="p-6 space-y-6 pt-0">
          <section className="flex gap-y-4 flex-col">
            {list.map((elem) => (
              <CategoryListItem
                deletePopupMessage={deletePopupMessage}
                parentOptions={parentOptions}
                key={elem.localId}
                {...elem}
                hasParent={hasParent}
                onChangeParent={(value) =>
                  handleChangeField({
                    localId: elem.localId,
                    value,
                    field: "parentLocalId",
                  })
                }
                onChangeName={(value) => {
                  handleChangeField({
                    localId: elem.localId,
                    value,
                    field: "name",
                  });
                  handleChangeField({
                    localId: elem.localId,
                    value: null,
                    field: "error",
                  });
                }}
                onPopularClick={() =>
                  handleChangeField({
                    localId: elem.localId,
                    value: !elem.popular,
                    field: "popular",
                  })
                }
                onDeleteClick={() => handleRemove(elem.localId)}
              />
            ))}
          </section>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
