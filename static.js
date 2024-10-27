const config = {
  CITY_COORDS: {
    Warrington: { lat: 53.390044, lng: -2.59695 },
    Manchester: { lat: 53.48095, lng: -2.23743 },
  },
  ORDER_STATUSES: {
    PENDING_OWNER: "pending_owner",
    PENDING_WORKER: "pending_worker",
    PENDING_WORKER_PAYMENT: "pending_worker_payment",
    IN_PROCESS: "in_process",
    PENDING_OWNER_FINISHED: "pending_owner_finished",
    FINISHED: "finished",
    REJECTED: "rejected",
  },
  ORDER_CANCELATION_STATUSES: {
    WAITING_OWNER_APPROVE: "waiting_owner_approve",
    WAITING_WORKER_APPROVE: "waiting_worker_approve",
    WAITING_ADMIN_APPROVE: "waiting_admin_approve",
    CANCELLED: "cancelled",
  },
  DISPUTE_STATUSES: {
    SOLVED: "solved",
    OPEN: "open",
    UNSOLVED: "unsolved",
  },
  ORDER_ACTION_BUTTONS: {
    BOOKING_AGREEMENT_SECTION: "booking-agreement-section",
    BOOKING_UPDATING_SECTION: "booking-updating-section",
    PAY_BUTTON: "pay-button",
    PAY_UPDATE_BUTTON: "pay-update-button",
    CANCEL_BUTTON: "cancel-button",
    FAST_CANCEL_BUTTON: "fast-cancel-button",
    ACCEPT_OWNER_CANCEL_BUTTON: "accept-owner-cancel-button",
    ACCEPT_WORKER_CANCEL_BUTTON: "accept-worker-cancel-button",
    WORKER_REVIEW: "worker-review",
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
    WORKER_PAYED: "worker-payed",
    WORKER_PAYED_WAITING: "worker-payed-waiting",
    IN_PROCESS: "in_process",
    FINISHED: "finished",
    CANCELED_ORDER: "canceled-order",
    CREATED_CANCEL_REQUEST: "created-cancel",
    ACCEPTED_CANCEL_REQUEST: "accepted-cancel",
    OWNER_REVIEW: "owner-review",
    WORKER_REVIEW: "worker-review",
    STARTED_DISPUTE: "started-dispute",
    RESOLVED_DISPUTE: "resolved-dispute",
  },
  CHAT_TYPES: { DISPUTE: "dispute", ORDER: "order" },
  AUTHOR_MESSAGE_LOCATIONS: { RIGHT: "right", LEFT: "left" },
  PAYMENT_TYPES: {
    PAYPAL: "paypal",
    CREDIT_CARD: "credit-card",
    BANK_TRANSFER: "bank-transfer",
  },
  REDIRECTS: {
    EDIT_PROFILE_LINK: "/dashboard/profile-edit/",
    SUCCESS_LOGIN: "/dashboard/profile-edit?success=Successfully logged in",
    SUCCESS_LOGOUT: "/?success=Successfully logged out",
  },
  LIMITS: {
    CHAT_FILE_SIZE: 25 * 1024 * 1024,
    SEARCH_INPUT_LENGTH: 255,
    FILE_SIZE: 5 * 1024 * 1024,
    SMALL_FILE_SIZE: 1 * 1024 * 1024,
    SUMMARY_FILE_SIZE: 25 * 1024 * 1024,
    MIN_WORKER_COMMISSION: 5,
  },
  DEFAULTS: {
    LISTING_MAP_CIRCLE_RADIUS: 500,
    PROFILE_PHOTO_LINK: "/images/admin/user-avatar-80.png",
    PHOTO_LINK: "/images/admin/default-photo.png",
    ADMIN_CHAT_LOGO: "/images/short-rent-about-logo.png",
    CITY_COORDS: { lat: 53.390044, lng: -2.59695 },
  },
  RECIPIENT_PAYMENT_TYPES: {
    REFUND: "refund",
    RECIPIENT: "recipient",
  },
  FILE_ACCEPT:
    ".txt, .doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .gif, .mp3, .wav, .mp4, .avi, .mov, .csv, .html, .css, .js, .xml, .json, .svg, .bmp, .ico, .tif, .tiff, .psd, .ai, .eps, .wmv, .flv, .mkv, .ogg, .aac, .wma, .flac, .exe, .dll, .bat, .cmd, .apk, .jar, .cpp, .c, .java, .py, .php, .html, .htm, .asp, .aspx, .jsp, .rb, .pl, .sql, .db, .bak, .tar, .gz, .tgz, .deb, .rpm, .iso, .img, .dmg, .swf, .mpg, .mpeg, .3gp, .wmv, .mov, .ogg, .m4a, .aac, .ac3, .aiff, .au, .mid, .midi, .wma, .rtf, .odt, .ods, .odp, .odg, .odf, .log, .yaml, .m3u, .pls, .log, .ini, .cfg, .inf, .nfo, .url, .torrent, .bak, .tmp, .tmp, .old, .temp, .part, .bak, .dmp, .crash, .swp, .srt, .sub, .ass, .vtt, .ttf, .otf, .woff, .woff2, .eot, .tsv, .webp",
  BLOB_CHUNK_SIZE: 256 * 1024,
  UNBLOB_CHUNK_SIZE: 256 * 1024,
  SERVER_API: "/api",
  SERVER_STORAGE: "/public",
  SUPPORT_EMAIL: "support@rentabout.com",
  HELLO_EMAIL: "hello@rentabout.com",
  CURRENCY: "£", //"$"
  CURRENCY_NAME: "GBP", //"USD"
  MOBILE_SIZE: 1199,
  PHONE_COUNTRIES_CODES: ["gb", "ua"],
};

config["DEFAULT_PHONE_INFO"] = {
  code: config.PHONE_COUNTRIES_CODES[0],
  phone: "44",
};

export default config;
