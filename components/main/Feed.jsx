import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Image, Button } from "react-native";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import Stories from "../home/Stories";
import { faker } from "@faker-js/faker";
import { TouchableOpacity } from "react-native";
import { POST_FOOTER_ICONS } from "../../data/postFooterIcons";

const Feed = ({ navigation }) => {
  const { following } = useSelector((state) => state.userState);
  const { userLoaded, feed } = useSelector((state) => state.usersState);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (userLoaded == following.length) {
      setPosts(feed);
    }
  }, [userLoaded, feed]);

  const onLikePress = async (uid, postId) => {
    const docRef = doc(
      db,
      "posts",
      uid,
      "userPosts",
      postId,
      "likes",
      auth.currentUser.uid,
    );
    await setDoc(docRef, {});
  };

  const onDisLikePress = async (uid, postId) => {
    const docRef = doc(
      db,
      "posts",
      uid,
      "userPosts",
      postId,
      "likes",
      auth.currentUser.uid,
    );
    await deleteDoc(docRef, {});
  };

  return (
    <View style={styles.containerGallery}>
      <Stories />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.containerPost}>
            <Divider width={1} orientation="vertical" />
            <PostHeader post={item} />
            <PostImage post={item} />
            <View style={{ marginHorizontal: 15, marginTop: 10 }}>
              <PostFooter />
            </View>
            {item.currentUserLike !== undefined && item.currentUserLike ? (
              <Button
                title="Dislike"
                onPress={() => onDisLikePress(item.uid, item.id)}
              />
            ) : (
              <Button
                title="Like"
                onPress={() => onLikePress(item.uid, item.id)}
              />
            )}

            <Text>{item.caption}</Text>
            <Text
              onPress={() =>
                navigation.navigate("Comment", {
                  postId: item.id,
                  uid: item.uid,
                })
              }
            >
              View Comments...
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const PostHeader = ({ post }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 5,
      alignItems: "center",
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image source={{ uri: faker.internet.avatar() }} style={styles.story} />
      <Text style={{ color: "white", marginLeft: 5, fontWeight: "700" }}>
        {post?.user?.name}
      </Text>
    </View>
    <Text style={{ color: "white", fontWeight: "900", marginRight: 5 }}>
      ...
    </Text>
  </View>
);

const PostImage = ({ post }) => (
  <Image source={{ uri: post.downloadURL }} style={styles.image} />
);

const PostFooter = ({ imgUrl }) => (
  <Icon
    imgStyle={styles.footerIcon}
    imgUrl={POST_FOOTER_ICONS[0].likedImageUrl}
  />
);

const Icon = ({ imgStyle, imgUrl }) => (
  <TouchableOpacity>
    <Image style={imgStyle} source={{ uri: imgUrl }} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  containerGallery: {
    flex: 1,
  },
  containerPost: {
    marginBottom: 30,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  story: {
    width: 35,
    height: 35,
    borderRadius: 50,
    margin: 2,
    borderWidth: 1.5,
    borderColor: "#ff8501",
  },
  footerIcon: {
    width: 33,
    height: 33,
  },
});

export default Feed;
