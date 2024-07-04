export default {
  CITY_COORDS: {
    Warrington: { lat: 53.390044, lng: -2.59695 },
    Manchester: { lat: 53.48095, lng: -2.23743 },
  },
  BASE_LISTING_MAP_CIRCLE_RADIUS: 500,
  DEFAULT_PROFILE_PHOTO_LINK: "/images/admin/user-avatar-80.png",
  DEFAULT_PHOTO_LINK: "/images/admin/default-photo.png",
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
    CANCELLED: "cancelled",
  },
  DISPUTE_STATUSES: {
    SOLVED: "solved",
    OPEN: "open",
    UNSOLVED: "unsolved",
  },
  MIN_PRICE_LIMIT: 1,
  MAX_PRICE_LIMIT: 1000000,
  ORDER_ACTION_BUTTONS: {
    BOOKING_AGREEMENT_SECTION: "booking-agreement-section",
    PAY_BUTTON: "pay-button",
    PAY_UPDATE_BUTTON: "pay-update-button",
    CANCEL_BUTTON: "cancel-button",
    FOR_TENANT_QRCODE: "for-tenant-qrcode",
    FOR_OWNER_QRCODE: "for-owner-qrcode",
    TENANT_GOT_LISTING_APPROVE_BUTTON: "tenant-got-listing-approve-button",
    FAST_CANCEL_BUTTON: "fast-cancel-button",
    ACCEPT_FINISH_BUTTON: "accept-finish-button",
    ACCEPT_OWNER_CANCEL_BUTTON: "accept-owner-cancel-button",
    ACCEPT_TENANT_CANCEL_BUTTON: "accept-tenant-cancel-button",
    EXTEND_BUTTON: "extend-button",
    TENANT_REVIEW: "renter-review",
    OWNER_REVIEW: "owner-review",
    OPEN_DISPUTE: "open-dispute",
    ORDER_CHAT: "order-chat",
    VIEW_DISPUTE_CHAT: "view-dispute-chat",
  },
  ACCEPT_IMAGE_FORMAT: {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
  },
  DISPUTE_TYPE_TITLE: {
    damage: "Damage",
    communication: "Communication",
    "problems-with-withdrawal": "Problems with withdrawal",
    payment: "Payment",
    others: "Others",
  },
  VIDEO_EXTENSIONS: [
    "mp4",
    "avi",
    "mov",
    "wmv",
    "flv",
    "mkv",
    "mpg",
    "mpeg",
    "3gp",
    "swf",
  ],
  AUDIO_EXTENSIONS: [
    "mp3",
    "wav",
    "ogg",
    "aac",
    "wma",
    "flac",
    "m4a",
    "ac3",
    "aiff",
    "au",
    "mid",
    "midi",
  ],
  IMAGE_EXTENSIONS: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "ico",
    "svg",
    "tif",
    "tiff",
    "webp",
  ],
  FILE_ACCEPT:
    ".txt, .doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .gif, .mp3, .wav, .mp4, .avi, .mov, .csv, .html, .css, .js, .xml, .json, .svg, .bmp, .ico, .tif, .tiff, .psd, .ai, .eps, .wmv, .flv, .mkv, .ogg, .aac, .wma, .flac, .exe, .dll, .bat, .cmd, .apk, .jar, .cpp, .c, .java, .py, .php, .html, .htm, .asp, .aspx, .jsp, .rb, .pl, .sql, .db, .bak, .tar, .gz, .tgz, .deb, .rpm, .iso, .img, .dmg, .swf, .mpg, .mpeg, .3gp, .wmv, .mov, .ogg, .m4a, .aac, .ac3, .aiff, .au, .mid, .midi, .wma, .rtf, .odt, .ods, .odp, .odg, .odf, .log, .yaml, .m3u, .pls, .log, .ini, .cfg, .inf, .nfo, .url, .torrent, .bak, .tmp, .tmp, .old, .temp, .part, .bak, .dmp, .crash, .swp, .srt, .sub, .ass, .vtt, .ttf, .otf, .woff, .woff2, .eot, .tsv, .webp",
  BLOB_CHUNK_SIZE: 200 * 1024,
  UNBLOB_CHUNK_SIZE: 200 * 1024,
  MESSAGE_TYPES: {
    TEXT: "text",
    FILE: "file",
    VIDEO: "video",
    AUDIO: "audio",
    IMAGE: "image",
    NEW_ORDER: "new-order",
    UPDATE_ORDER: "update-order",
    ACCEPTED_ORDER: "accepted-order",
    REJECTED_ORDER: "rejected-order",
    CANCELED_ORDER: "canceled-order",
    TENANT_PAYED: "tenant-payed",
    PENDED_TO_CLIENT: "pending_item_to_client",
    FINISHED: "finished",
    CREATED_CANCEL_REQUEST: "created-cancel",
    ACCEPTED_CANCEL_REQUEST: "accepted-cancel",
    LISTING_REVIEW: "listing-review",
    USER_REVIEW: "user-review",
    STARTED_DISPUTE: "started-dispute",
    RESOLVED_DISPUTE: "resolved-dispute",
  },
  CHAT_TYPES: { DISPUTE: "dispute", ORDER: "order" },
  ADMIN_CHAT_LOGO: "/images/short-rent-about-logo.png",
  AUTHOR_MESSAGE_LOCATIONS: { RIGHT: "right", LEFT: "left" },
  MAX_CHAT_FILE_SIZE: 1 * 1024 * 1024 * 1024,
  PAYMENT_TYPES: {
    PAYPAL: "paypal",
    CREDIT_CARD: "credit-card",
    BANK_TRANSFER: "bank-transfer",
  },
};
