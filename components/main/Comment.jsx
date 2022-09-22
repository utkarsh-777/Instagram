import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button } from "react-native";
import { db } from "../../firebase";
import { getDocs, collection, doc, setDoc } from "firebase/firestore";
import { auth } from "../../firebase";

const Comment = (props) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const allComments = await getDocs(
      collection(
        db,
        "posts",
        props.route.params.uid,
        "userPosts",
        props.route.params.postId,
        "comments",
      ),
    );
    const commentsArr = [];
    allComments.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      commentsArr.push({ id, ...data });
    });
    setComments(commentsArr);
    setPostId(props.route.params.postId);
  };

  const onCommentSend = async () => {
    try {
      const docRef = doc(
        db,
        "posts",
        props.route.params.uid,
        "userPosts",
        props.route.params.postId,
        "comments",
        Math.random().toString(36),
      );
      await setDoc(docRef, {
        text: text,
        creator: auth.currentUser.uid,
        name: auth.currentUser.displayName,
      });

      console.log("Added Comment ");
      await fetchComments();
      setText("");
    } catch (e) {
      console.error("Error adding comment: ", e);
    }
  };

  useEffect(() => {
    (async () => {
      if (postId !== props.route.params.postId) {
        await fetchComments();
      }
    })();
  }, [props.route.params.postId]);

  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#e0dede",
              borderRadius: 10,
              padding: 5,
              margin: 5,
            }}
          >
            <Text style={{ fontSize: 20 }}>{item.text}</Text>
            <Text>by, {item.name}</Text>
          </View>
        )}
      />
      <View>
        <TextInput
          placeholder="comment..."
          value={text}
          onChangeText={(comment) => setText(comment)}
        />
        <Button title="Send" onPress={() => onCommentSend()} />
      </View>
    </View>
  );
};

export default Comment;
