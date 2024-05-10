import { getAdminListingDefectsEditOptions } from "../../services";
import { uniqueId } from "../../utils";

const ListingDefects = ({ defects: baseDefects }) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [submitting, setSubmitting] = useState(false);
  const [prevDefects, setPrevDefects] = useState(baseDefects);

  const defectsToState = (defects) =>
    defects.map((defect) => ({ ...defect, localId: uniqueId() }));

  const initDefects = defectsToState(baseDefects);
  const [defects, setDefects] = useState(initDefects);

  const getLocalIdErrors = (defects) => {
    let hasError = false;

    const names = {};
    const localIdErrors = {};

    defects.forEach((defect) => {
      if (defect.name.length < 1) {
        localIdErrors[defect.localId] = "Cannot save an empty category";
        hasError = true;
        return;
      }

      if (defect.name.length > 255) {
        localIdErrors[defect.localId] =
          "Name cannot be higher than 255 symbols";
        hasError = true;
        return;
      }

      if (defect.name.toLowerCase() === "all") {
        localIdErrors[defect.localId] = "Name cannot be 'All'";
        hasError = true;
        return;
      }

      if (Object.values(names).includes(defect.name)) {
        localIdErrors[defect.localId] =
          "Cannot create two identical categories";
        hasError = true;

        Object.keys(names).forEach((localId) => {
          if (names[localId] == defect.name)
            localIdErrors[localId] = "Cannot create two identical categories";
        });

        return;
      }

      localIdErrors[defect.localId] = null;
      names[defect.localId] = defect.name;
    });

    return { hasError, localIdErrors };
  };

  const handleChangeName = (index, name) => {
    setPrevDefects((defects) => {
      const result = [];

      defects.map((defect, defectIndex) => {
        if (defectIndex == index) {
          result.push({ ...defect });
        } else {
          result.push({ ...defect, name });
        }
      });

      return result;
    });
  };

  const handleChangeOrderIndexes = ({ info }) => {
    setDefects((defects) => {
      const res = [];

      Object.keys(info).forEach((id) => {
        for (let i = 0; i < defects.length; i++) {
          if (res[i]["id"] == id) {
            res[i]["orderIndex"] = info[id];
          } else {
            res[i]["orderIndex"] = info[id];
          }
        }
      });

      return res;
    });
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

    return res;
  };

  const handleClickRemove = (index) => {
    setPrevDefects((defects) => {
      const result = defects.filter(
        (defect, defectIndex) => index != defectIndex
      );
    });
  };

  const handleClickCreate = () => {
    setPrevDefects((defects) => {
      const result = [{ name: "", localId: uniqueId(), id: null }, ...defects];
      return autoUpdateOrderIndexes(result);
    });
  };
};

const boostServerSideProps = async () => {
  const defects = await getAdminListingDefectsEditOptions();
  return { defects };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default ListingDefects;
