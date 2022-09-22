import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import app, { db, auth } from "../../firebase";
export const USER_STATE_CHANGE = "USER_STATE_CHANGE";
export const USER_POST_STATE_CHANGE = "USER_POST_STATE_CHANGE";
export const USER_FOLLOWING_STATE_CHANGE = "USER_FOLLOWING_STATE_CHANGE";
export const USERS_DATA_STATE_CHANGE = "USERS_DATA_STATE_CHANGE";
export const USERS_POST_STATE_CHANGE = "USERS_POST_STATE_CHANGE";
export const USERS_STORY_STATE_CHANGE = "USERS_STORY_STATE_CHANGE";
export const USERS_LIKES_STATE_CHANGE = "USERS_LIKES_STATE_CHANGE";
export const CLEAR_DATA = "CLEAR_DATA";

export const clearData = () => (dispatch) => {
  dispatch({ type: CLEAR_DATA });
};

export const fetchUser = () => async (dispatch) => {
  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists) {
    dispatch({
      type: USER_STATE_CHANGE,
      currentUser: { uid: auth.currentUser.uid, ...docSnap.data() },
    });
  } else {
    console.log("user does not exist");
  }
};

export const fetchUserPosts = () => async (dispatch) => {
  const q = query(
    collection(db, "posts", auth.currentUser.uid, "userPosts"),
    orderBy("date", "desc"),
  );
  const querySnapshot = await getDocs(q);
  const posts = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    posts.push({ id, ...data });
  });
  dispatch({ type: USER_POST_STATE_CHANGE, posts });
};

export const fetchUserFollowing = () => async (dispatch) => {
  try {
    const q = query(
      collection(db, "following", auth.currentUser.uid, "userFollowing"),
    );
    onSnapshot(q, (all) => {
      const following = [];
      all.forEach((doc) => {
        const id = doc.id;
        following.push(id);
      });
      dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
      for (let i = 0; i < following.length; i++) {
        dispatch(fetchUsersData(following[i]));
      }
    });
  } catch (err) {
    console.log(err, "error in fetchUserFollowing");
  }
};

export const fetchUsersData = (uid) => async (dispatch, getState) => {
  const found = getState().usersState.users.some((el) => el.uid === uid);
  if (!found) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists) {
      let user = docSnap.data();
      user.uid = docSnap.id;
      dispatch({ type: USERS_DATA_STATE_CHANGE, user });
      dispatch(fetchUserFollowingPosts(user.uid, user));
      dispatch(fetchUserFollowingStories(user.uid));
    } else {
      console.log("user does not exist");
    }
  }
};

export const fetchUserFollowingPosts =
  (uid, user) => async (dispatch, getState) => {
    const allPosts = await getDocs(collection(db, "posts", uid, "userPosts"));
    let posts = [];
    allPosts.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      posts.push({ id, uid, ...data, user });
    });

    for (let i = 0; i < posts.length; i++) {
      dispatch(fetchUsersFollowingLikes(uid, posts[i].id));
    }
    dispatch({ type: USERS_POST_STATE_CHANGE, posts });
  };

export const fetchUserFollowingStories =
  (uid) => async (dispatch, getState) => {
    const allStories = await getDocs(
      collection(db, "stories", uid, "userStories"),
    );
    let stories = [];
    allStories.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;

      stories.push({ id, uid, ...data });
    });

    if (stories.length > 0) {
      dispatch({ type: USERS_STORY_STATE_CHANGE, stories });
    }
  };

export const fetchUsersFollowingLikes =
  (uid, postId) => async (dispatch, getState) => {
    try {
      const q = query(
        collection(db, "posts", uid, "userPosts", postId, "likes"),
      );
      onSnapshot(q, (allFollowing) => {
        let currentUserLike = false;
        allFollowing.forEach((doc) => {
          const id = doc.id;
          if (id === auth.currentUser.uid) {
            currentUserLike = true;
          }
        });
        dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike });
      });
    } catch (err) {
      console.log(err, "error in fetchUsersFollowingLikes");
    }
  };
