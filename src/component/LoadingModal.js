import { View, Text, Modal, ActivityIndicator } from "react-native";
import React from "react";

const LoadingModal = ({ visible }) => {
  return (
    <Modal visible={visible} transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{ padding: 20, borderRadius: 10, backgroundColor: "white" }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
