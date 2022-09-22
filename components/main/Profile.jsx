import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Text, View, StyleSheet, Image, FlatList, Button } from "react-native";
import { useSelector } from "react-redux";
import { auth, db } from "../../firebase";

const Profile = (props) => {
  const userState = useSelector((state) => state.userState);
  const { currentUser, posts, following } = userState;
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userFollowing, setUserFollowing] = useState(false);

  const fetchUserPosts = async (uid) => {
    const q = query(
      collection(db, "posts", uid, "userPosts"),
      orderBy("date", "desc"),
    );
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      posts.push({ id, ...data });
    });
    setUserPosts(posts);
  };

  useEffect(() => {
    (async () => {
      if (currentUser && following) {
        if (currentUser.uid === props.route.params.uid) {
          setUser(currentUser);
          setUserPosts(posts);
        } else {
          setUser(props.route.params.user);
          await fetchUserPosts(props.route.params.uid);
        }

        if (following.includes(props.route.params.uid)) {
          setUserFollowing(true);
        } else {
          setUserFollowing(false);
        }
      }
    })();
  }, [props.route.params.uid, following]);

  const onUnfollow = async () => {
    try {
      const q = doc(
        db,
        "following",
        currentUser.uid,
        "userFollowing",
        props.route.params.uid,
      );
      await deleteDoc(q);
    } catch (error) {
      console.log(error);
    }
  };

  const onFollow = async () => {
    try {
      const q = doc(
        db,
        "following",
        currentUser.uid,
        "userFollowing",
        props.route.params.uid,
      );
      console.log(q);
      await setDoc(q, {});
    } catch (error) {
      console.log(error);
    }
  };

  const onLogout = () => {
    try {
      auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {user && userPosts && currentUser && (
        <View style={styles.container}>
          <View style={styles.containerInfo}>
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>

            {props.route.params.uid !== currentUser.uid ? (
              <View>
                {userFollowing ? (
                  <Button title="Following" onPress={() => onUnfollow()} />
                ) : (
                  <Button title="Follow" onPress={() => onFollow()} />
                )}
              </View>
            ) : (
              <Button title="Logout" onPress={() => onLogout()} />
            )}
          </View>
          <View style={styles.containerGallery}>
            <FlatList
              numColumns={3}
              horizontal={false}
              data={userPosts}
              renderItem={({ item }) => (
                <View style={styles.containerImage}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.downloadURL }}
                  />
                </View>
              )}
            />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

export default Profile;
