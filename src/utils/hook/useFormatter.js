import { View, Text } from "react-native";
import React from "react";

const useFormatter = () => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return { formatter };
};

export default useFormatter;
