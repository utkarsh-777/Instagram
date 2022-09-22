import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const Add = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.fixedRatio}
          ref={(ref) => setCamera(ref)}
          type={type}
          ratio={"1:1"}
        />
      </View>

      <Button
        title="Flip Camera"
        onPress={() => {
          setType(
            type === CameraType.back ? CameraType.front : CameraType.back,
          );
        }}
      />
      <Button title="Take Picture" onPress={() => takePicture()} />
      <Button title="Pick Image from gallery" onPress={() => pickImage()} />

      {image && (
        <>
          <Button
            title="Make Post"
            onPress={() =>
              navigation.navigate("Make post", { image, type: "Post" })
            }
          />
          <Image source={{ uri: image }} style={{ flex: 1 }} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});

export default Add;
