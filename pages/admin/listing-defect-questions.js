import { useContext, useEffect, useState } from "react";
import { useAdminPage, useWindowSizeUpdate } from "../../hooks";
import { adminSideProps } from "../../middlewares";
import Header from "../../partials/admin/Header";
import Sidebar from "../../partials/admin/Sidebar";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import { getAdminListingDefectQuestionsEditOptions } from "../../services";
import { reorderList, uniqueId } from "../../utils";
import { IndiceContext } from "../../contexts";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import QuestionListItem from "../../partials/admin/listingDefectQuestions/QuestionListItem";
import lodash from "lodash";
import { saveListingDefectQuestions } from "../../services";

const ListingDefectQuestions = ({ questions: baseQuestions }) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [submitting, setSubmitting] = useState(false);
  const [prevQuestions, setPrevQuestions] = useState(baseQuestions);
  const [listHeight, setListHeight] = useState(71.56);

  const questionsToState = (questions) =>
    questions.map((question) => ({
      ...question,
      localId: uniqueId(),
      error: null,
    }));

  const initQuestions = questionsToState(baseQuestions);
  const [questions, setQuestions] = useState(initQuestions);

  const stateQuestionsToSave = () => {
    return questions.map((question) => {
      const filteredElem = { ...question };
      delete filteredElem["localId"];
      delete filteredElem["error"];

      return {
        ...filteredElem,
      };
    });
  };

  const getLocalIdErrors = (questions) => {
    let hasError = false;

    const names = {};
    const localIdErrors = {};

    questions.forEach((question) => {
      if (question.name.length < 1) {
        localIdErrors[question.localId] = "Cannot save an empty question";
        hasError = true;
        return;
      }

      if (Object.values(names).includes(question.name)) {
        localIdErrors[question.localId] =
          "Cannot create two identical questions";
        hasError = true;

        Object.keys(names).forEach((localId) => {
          if (names[localId] == question.name)
            localIdErrors[localId] = "Cannot create two identical questions";
        });

        return;
      }

      localIdErrors[question.localId] = null;
      names[question.localId] = question.name;
    });

    return { hasError, localIdErrors };
  };

  const handleChangeName = (localId, name) => {
    setQuestions((questions) => {
      const result = [];

      questions.map((question) => {
        if (question.localId == localId) {
          result.push({ ...question, name, error: null });
        } else {
          result.push({ ...question, error: null });
        }
      });

      const { hasError, localIdErrors } = getLocalIdErrors(result);

      if (hasError) {
        result.forEach((question, i) => {
          result[i]["error"] = localIdErrors[question.localId];
        });
      }

      return result;
    });
  };

  const handleChangeOrderIndexes = (info) => {
    setQuestions((questions) => {
      const res = [...questions];

      Object.keys(info).forEach((localId) => {
        for (let i = 0; i < questions.length; i++) {
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
    setQuestions((questions) => {
      const result = questions.filter(
        (question) => question.localId != localId
      );
      return autoUpdateOrderIndexes(result);
    });
  };

  const handleClickCreate = () => {
    setQuestions((questions) => {
      const result = [
        { name: "", localId: uniqueId(), id: null, error: null, orderIndex: 0 },
        ...incrementAllIndex(questions),
      ];
      return result;
    });
  };

  const checkQuestionListingDoubling = (newQuestions = null) => {
    if (!newQuestions) newQuestions = questions;

    const { hasError, localIdErrors } = getLocalIdErrors(newQuestions);

    setQuestions((prev) => {
      const res = [...prev];
      res.forEach(
        (question, i) => (res[i]["error"] = localIdErrors[question.localId])
      );
      return res;
    });

    return hasError;
  };

  const handleSaveClick = async () => {
    if (submitting) return;

    setSubmitting(true);

    const hasError = checkQuestionListingDoubling();

    if (hasError) {
      setSubmitting(false);
      return;
    }

    try {
      const questionsToSave = stateQuestionsToSave();

      if (!lodash.isEqual(questionsToSave, prevQuestions)) {
        const createdQuestions = await saveListingDefectQuestions(
          { questions: questionsToSave },
          authToken
        );

        setPrevQuestions(createdQuestions);
        setQuestions(questionsToState(createdQuestions));
      }

      success.set("Questions saved successfully");
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
    const newItems = reorderList(questions, startIndex, endIndex);

    const updatedItems = newItems.map((item, index) => {
      return {
        ...item,
        orderIndex: index,
      };
    });

    setQuestions(updatedItems);

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
      .querySelectorAll(".question-list-item")
      .forEach((elem) => (height += elem.scrollHeight));

    setListHeight(height + 1);
  };

  useWindowSizeUpdate(updateListHeight);

  useEffect(() => {
    updateListHeight();
  }, [JSON.stringify(questions)]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <BreadCrumbs links={[{ title: "Listing Questions" }]} />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:-mr-px">
                <div className="grow">
                  <div className="p-6">
                    <h2 className="flex items-center justify-between text-2xl text-slate-800 dark:text-slate-100 font-bold">
                      Questions about listing defects
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
                              {questions.map((elem, index) => (
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
                                      className="question-list-item"
                                    >
                                      <QuestionListItem
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
                          <span className="hidden xs:block">
                            Save Questions
                          </span>
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
  const questions = await getAdminListingDefectQuestionsEditOptions(
    baseSideProps.authToken
  );
  return { questions };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default ListingDefectQuestions;
