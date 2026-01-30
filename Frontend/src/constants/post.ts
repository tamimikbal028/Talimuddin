// 📝 পোস্টের ধরন (Updated: ANNOUNCEMENT -> NOTICE)
export const POST_TYPES = {
  GENERAL: "GENERAL",
  NOTICE: "NOTICE", // ✅ Updated
  RESOURCE: "RESOURCE",
  POLL: "POLL",
  QUESTION: "QUESTION",
  ASSIGNMENT: "ASSIGNMENT", // ✅ Added
  VIDEO: "VIDEO", // ✅ Added
  BUY_SELL: "BUY_SELL", // ✅ Added for marketplace
};

export const ATTACHMENT_TYPES = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  PDF: "PDF",
  DOC: "DOC",
  LINK: "LINK",
};

export const POST_TARGET_MODELS = {
  BRANCH: "Branch",
  USER: "User",
};

export const POST_VISIBILITY = {
  PUBLIC: "PUBLIC",
  CONNECTIONS: "CONNECTIONS",
  ONLY_ME: "ONLY_ME",
};

export const POST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
