import {
  USERS_DATA_STATE_CHANGE,
  USERS_POST_STATE_CHANGE,
  CLEAR_DATA,
  USERS_LIKES_STATE_CHANGE,
  USERS_STORY_STATE_CHANGE,
} from "../action/action";

const usersState = {
  users: [],
  feed: [],
  userLoaded: 0,
  stories: [],
};

export const users = (state = usersState, action) => {
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.user],
      };
    case USERS_POST_STATE_CHANGE:
      if (action.posts.length > 0) {
        return {
          ...state,
          userLoaded: state.userLoaded + 1,
          feed: [...state.feed, ...action.posts],
        };
      } else {
        return {
          ...state,
          userLoaded: state.userLoaded + 1,
        };
      }
    case USERS_STORY_STATE_CHANGE:
      if (action.stories.length > 0) {
        return {
          ...state,

          stories: [...state.stories, ...action.stories],
        };
      } else {
        return {
          ...state,
        };
      }
    case USERS_LIKES_STATE_CHANGE:
      const feed = [...state.feed];
      for (let i = 0; i < feed.length; i++) {
        if (feed[i].id === action.postId) {
          feed[i] = { ...feed[i], currentUserLike: action.currentUserLike };
          break;
        }
      }
      return {
        ...state,
        feed,
      };

    case CLEAR_DATA:
      return {
        users: [],
        userLoaded: 0,
        feed: [],
        stories: [],
      };

    default:
      return state;
  }
};
