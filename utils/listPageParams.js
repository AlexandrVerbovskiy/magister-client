export const baseListPageParams = (params) => ({
  order: params["order"],
  page: params["page"],
  filter: params["filter"],
  orderType: params["order-type"],
  itemsPerPage: 10,
});

export const baseTimeListPageParams = (params) => ({
  ...baseListPageParams(params),
  fromTime: params["from-time"],
  toTime: params["to-time"],
  clientTime: Date.now(),
});

export const baseTimeTypePageParams = (params) => ({
  clientTime: Date.now(),
  timeFilterType: params["time-filter-type"],
});

export const baseAdminTimeListPageParams = (params) => ({
  ...baseListPageParams(params),
  ...baseTimeTypePageParams(params),
});
