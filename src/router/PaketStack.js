import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PaketLangganan from "../pages/paket/PaketLangganan";

const Stack = createNativeStackNavigator();

const PaketStack = () => {
  return (
    <Stack.Navigator initialRouteName="PaketLangganan">
      <Stack.Screen
        name="PaketLangganan"
        component={PaketLangganan}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default PaketStack;
