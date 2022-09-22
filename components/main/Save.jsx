import React, { useState } from "react";
import { View, TextInput, Image, Text, Button } from "react-native";
import { storage, auth, db } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const Save = (props) => {
  const [caption, setCaption] = useState("");

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const response = await fetch(uri);
    const blob = await response.blob();
    const metadata = {
      contentType: "image/jpeg",
    };
    let path;
    if (props.route.params.type === "Post") {
      path = `posts/${auth.currentUser.uid}/${Math.random().toString(36)}`;
    } else {
      path = `stories/${auth.currentUser.uid}/${Math.random().toString(36)}`;
    }
    console.log(path);
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    const taskProgress = (snapshot) => {
      const progress = Math.ceil(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      );
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    };

    const taskError = (error) => {
      switch (error.code) {
        case "storage/unauthorized":
          break;
        case "storage/canceled":
          break;
        case "storage/unknown":
          break;
      }
    };

    const taskCompleted = () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        await saveData(downloadURL, props.route.params.type);
      });
    };
    uploadTask.on(
      "state_changed",
      (snapshot) => taskProgress(snapshot),
      (error) => taskError(error),
      () => taskCompleted(),
    );
  };

  const saveData = async (downloadURL, type) => {
    try {
      const docRef = doc(
        db,
        type === "Post" ? "posts" : "stories",
        auth.currentUser.uid,
        type === "Post" ? "userPosts" : "userStories",
        Math.random().toString(36),
      );
      await setDoc(docRef, {
        downloadURL: downloadURL || "No url",
        date: Timestamp.now().toDate(),
        caption: caption === "" ? "No caption" : caption,
      });
      props.navigation.popToTop();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {props.route.params.image && (
        <Image
          source={{ uri: props.route.params.image }}
          style={{ flex: 1, aspectRatio: 1 / 1 }}
        />
      )}

      <TextInput
        placeholder="Write a Caption..."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Create" onPress={() => uploadImage()} />
    </View>
  );
};

export default Save;
