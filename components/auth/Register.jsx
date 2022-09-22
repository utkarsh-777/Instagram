import React, { useState } from "react";
import { View, Button, TextInput } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const saveUser = async (user) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: name });
    } catch (error) {
      console.log(error);
    }
  };

  const onSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userData) => {
        await updateUser();
        await saveUser(userData.user);
      })
      .catch((error) => console.log(error));
  };

  return (
    <View>
      <TextInput placeholder="name" onChangeText={(name) => setName(name)} />
      <TextInput
        placeholder="email"
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <Button onPress={() => onSignUp()} title="Signup" />
    </View>
  );
};

export default Register;
