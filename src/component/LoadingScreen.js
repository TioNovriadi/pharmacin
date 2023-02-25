import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={"large"} />
    </View>
  );
};

export default LoadingScreen;
