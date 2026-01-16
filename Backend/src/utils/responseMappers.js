import { USER_RELATION_STATUS } from "../constants/index.js";

/**
 * Maps a user object to a standardized response structure.
 * @param {Object} user - The user object from the database.
 * @param {string} user_relation_status - The relationship status with the current user.
 * @returns {Object|null} - The formatted user object with meta data.
 */
export const mapUserToResponse = (
  user,
  user_relation_status = USER_RELATION_STATUS.NONE
) => {
  if (!user) return null;
  return {
    user: {
      _id: user._id,
      userName: user.userName,
      fullName: user.fullName,
      avatar: user.avatar,
      institution: user.institution
        ? { _id: user.institution._id, name: user.institution.name }
        : null,
    },
    meta: {
      user_relation_status,
    },
  };
};
