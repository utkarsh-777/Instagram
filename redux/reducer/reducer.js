import {
  USER_POST_STATE_CHANGE,
  USER_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  CLEAR_DATA,
} from "../action/action";

const userState = {
  currentUser: null,
  posts: [],
  following: [],
};

export const userReducer = (state = userState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case USER_POST_STATE_CHANGE:
      return {
        ...state,
        posts: action.posts,
      };
    case USER_FOLLOWING_STATE_CHANGE: {
      return {
        ...state,
        following: [...action.following],
      };
    }
    case CLEAR_DATA:
      return {
        currentUser: null,
        posts: [],
        following: [],
      };
    default:
      return state;
  }
};
