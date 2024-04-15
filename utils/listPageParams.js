export const baseListPageParams = (params) => ({
  order: params["order"],
  page: params["page"],
  filter: params["filter"],
  orderType: params["order-type"],
});


export const baseTimeListPageParams = (params) => ({
  ...baseListPageParams(params),
  fromTime: params["from-time"],
  toTime: params["to-time"],
  clientTime: Date.now()
});
