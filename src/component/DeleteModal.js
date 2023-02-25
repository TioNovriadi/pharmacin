import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../utils/context/AuthContext";
import toast from "../utils/helper/Toast";

const DeleteModal = ({
  visible,
  setVisible,
  id,
  setId,
  mainData,
  subData,
  setIsLoading,
  url,
  deleteMessage,
  setRefresh,
  refresh,
}) => {
  const { userToken } = useContext(AuthContext);

  const deleteData = async () => {
    setVisible(false);
    setIsLoading(true);

    await fetch(url + `/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === deleteMessage) {
          toast.success({ message: json.message });
          setRefresh(!refresh);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
        setId(null);
      });
  };

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
          style={{
            backgroundColor: "white",
            paddingHorizontal: 14,
            paddingVertical: 34,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Poppins-SemiBold",
              fontSize: 24,
              color: "#373737",
            }}
          >
            Anda yakin ingin menghapus {mainData}?
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontFamily: "Poppins-Regular",
              fontSize: 18,
              color: "#868686",
              marginHorizontal: 50,
              marginTop: 30,
            }}
          >
            Jika anda menghapus {mainData}, maka data {subData} juga akan
            terhapus
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 28,
                paddingVertical: 15,
                backgroundColor: "#D8D8D8",
                borderRadius: 10,
              }}
              onPress={() => {
                setId(null);
                setVisible(false);
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 20,
                  color: "#505050",
                }}
              >
                Batalkan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                paddingHorizontal: 48,
                paddingVertical: 15,
                backgroundColor: "#2FA33B",
                borderRadius: 10,
                marginLeft: 30,
              }}
              onPress={() => {
                deleteData();
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 20,
                  color: "white",
                }}
              >
                Hapus
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
