import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState } from "react";

const FilterButton = ({
  data,
  filter,
  setFilter,
  setSearch,
  setData,
  dataKey,
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleFilterDropdown = (item) => {
    setFilter(item);
    setSearch("");
    setData(data);
    setShowFilterDropdown(false);
  };

  return (
    <View style={{ zIndex: 999 }}>
      <TouchableOpacity
        style={{
          width: 42,
          height: 42,
          backgroundColor: "#062659",
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          setShowFilterDropdown(!showFilterDropdown);
        }}
      >
        <Image
          source={require("../assets/images/filter.png")}
          style={{ width: 24, height: 24, resizeMode: "contain" }}
        />
      </TouchableOpacity>

      {/* Dropdown Filter */}
      {showFilterDropdown === true && (
        <ScrollView
          style={{
            width: 184,
            height: 144,
            backgroundColor: "white",
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            position: "absolute",
            zIndex: 999,
            top: 49,
            left: -142,
            padding: 8,
          }}
        >
          {dataKey.map((item, index) => {
            return (
              <TouchableOpacity
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 6,
                  backgroundColor: filter === item ? "#F0F0F0" : "white",
                  borderRadius: 4,
                }}
                key={index}
                onPress={() => {
                  handleFilterDropdown(item);
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Medium",
                    fontSize: 14,
                    color: "#333333",
                    includeFontPadding: false,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default FilterButton;
