import React, { useState } from "react";
import {
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { db } from "../../firebase";
import { query, collection, where, getDocs } from "firebase/firestore";

const Search = (props) => {
  const [users, setUsers] = useState([]);
  const searchUsers = async (search) => {
    const q = query(collection(db, "users"), where("name", ">=", search));
    const querySnapshot = await getDocs(q);
    const arr = [];
    querySnapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      arr.push({ id, ...data });
    });
    setUsers(arr);
  };
  return (
    <View>
      <TextInput
        onChangeText={(search) => searchUsers(search)}
        placeholder={"Type here..."}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Profile", { uid: item.id, user: item })
            }
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;
