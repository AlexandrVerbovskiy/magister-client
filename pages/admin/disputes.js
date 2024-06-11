import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import { getAdminDisputeListOptions, getDisputeList } from "../../services";
import { useAdminPage, useBaseAdminFilter, usePagination } from "../../hooks";
import { baseAdminTimeListPageParams } from "../../utils";
import { supportSideProps } from "../../middlewares";

const Disputes = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [typesCount, setTypesCount] = useState(pageProps.typesCount);

  const {
    timeFilterType,
    getBaseAdminFilterDopProps,
    handleChangeTimeFilterType,
    type,
    handleChangeType,
  } = useBaseAdminFilter({ props: pageProps, defaultTypeValue: "suspended" });

  const onRebuild = (data) => {
    setTypesCount(data.typesCount);
  };

  const {
    page,
    countItems,
    countPages,
    moveToPage,
    filter,
    changeFilter,
    order,
    orderType,
    currentTo,
    currentFrom,
    handleChangeOrder,
    canMoveNextPage,
    canMovePrevPage,
    items: reviews,
    rebuild,
    setItemFields,
  } = usePagination({
    getItemsFunc: (data) => getDisputeList(data, authToken),
    onError: (e) => error.set(e.message),
    getDopProps: getBaseAdminFilterDopProps,
    defaultData: pageProps,
    onRebuild,
  });

  return <div></div>;
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const type = context.query.type ?? null;
  const params = { ...baseAdminTimeListPageParams(context.query), type };
  const options = await getAdminDisputeListOptions(
    params,
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  supportSideProps(context, boostServerSideProps);

export default Disputes;
