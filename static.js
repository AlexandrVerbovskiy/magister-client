export default {
  CITY_COORDS: {
    Warrington: { lat: 53.390044, lng: -2.59695 },
    Manchester: { lat: 53.48095, lng: -2.23743 },
  },
  BASE_LISTING_MAP_CIRCLE_RADIUS: 500,
  DEFAULT_PHOTO_LINK: "/images/admin/user-avatar-80.png",
  MAX_SEARCH_INPUT_LENGTH: 255,
  ORDER_STATUSES: {
    PENDING_OWNER: "pending_owner",
    PENDING_TENANT: "pending_tenant",
    PENDING_CLIENT_PAYMENT: "pending_client_payment",
    PENDING_ITEM_TO_CLIENT: "pending_item_to_client",
    PENDING_ITEM_TO_OWNER: "pending_item_to_owner",
    FINISHED: "finished",
    REJECTED: "rejected",
  },
  ORDER_CANCELATION_STATUSES: {
    WAITING_OWNER_APPROVE: "waiting_owner_approve",
    WAITING_TENANT_APPROVE: "waiting_tenant_approve",
    WAITING_ADMIN_APPROVE: "waiting_admin_approve",
    CANCELED: "canceled",
  },
};
