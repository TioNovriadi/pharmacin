import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import Header from "../../../component/Header";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import toast from "../../../utils/helper/Toast";
import LoadingModal from "../../../component/LoadingModal";
import useResponsive from "../../../utils/hook/useResponsive";

const PabrikanAdd = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const { isDesktopOrLaptop } = useResponsive();

  const [namaPabrik, setNamaPabrik] = useState("");
  const [emailPabrik, setEmailPabrik] = useState("");
  const [noTelpPabrik, setNoTelpPabrik] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addPabrik = async (namaPabrik, emailPabrik, noTelpPabrik, again) => {
    setIsLoading(true);

    await fetch(API_ACCESS.pabrik, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        namaPabrik,
        emailPabrik,
        noTelpPabrik,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Pabrik berhasil ditambahkan!") {
          toast.success({ message: json.message });

          if (again === true) {
            setNamaPabrik("");
            setEmailPabrik("");
            setNoTelpPabrik("");
          } else {
            navigation.goBack();
          }
        } else {
          toast.danger({ message: json.messages.errors[0].message });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isDesktopOrLaptop) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <Header
          title="Pabrikan"
          subtitle="/ Kelola Pabrik / Tambah Pabrik"
          navigation={navigation}
        />

        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 10,
            marginHorizontal: 14,
            marginTop: 17,
            marginBottom: 14,
          }}
        >
          <View style={{ marginLeft: 24, marginTop: 44, flex: 1 }}>
            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                color: "#001B45",
              }}
            >
              Pabrik
            </Text>

            <View
              style={{
                width: 394,
                height: 42,
                borderWidth: 2,
                borderColor: "#BDBDBD",
                borderRadius: 10,
                justifyContent: "center",
                paddingHorizontal: 14,
              }}
            >
              <TextInput
                value={namaPabrik}
                onChangeText={(text) => setNamaPabrik(text)}
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: "#333333",
                  includeFontPadding: false,
                  outline: "none",
                  flex: 1,
                }}
              />
            </View>

            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                color: "#001B45",
                marginTop: 21,
              }}
            >
              Email
            </Text>

            <View
              style={{
                width: 394,
                height: 42,
                borderWidth: 2,
                borderColor: "#BDBDBD",
                borderRadius: 10,
                justifyContent: "center",
                paddingHorizontal: 14,
              }}
            >
              <TextInput
                value={emailPabrik}
                onChangeText={(text) => setEmailPabrik(text)}
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: "#333333",
                  includeFontPadding: false,
                  outline: "none",
                  flex: 1,
                }}
              />
            </View>

            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                color: "#001B45",
                marginTop: 21,
              }}
            >
              Telepon
            </Text>

            <View
              style={{
                width: 394,
                height: 42,
                borderWidth: 2,
                borderColor: "#BDBDBD",
                borderRadius: 10,
                justifyContent: "center",
                paddingHorizontal: 14,
              }}
            >
              <TextInput
                value={noTelpPabrik}
                onChangeText={(text) => setNoTelpPabrik(text)}
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: "#333333",
                  includeFontPadding: false,
                  outline: "none",
                  flex: 1,
                }}
              />
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginRight: 34,
              marginBottom: 30,
            }}
          >
            <TouchableOpacity
              style={{
                width: 142,
                height: 45,
                backgroundColor: "#D76363",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 18,
                  color: "white",
                  includeFontPadding: false,
                }}
              >
                Batalkan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 131,
                height: 45,
                backgroundColor: "#062659",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                marginHorizontal: 20,
              }}
              onPress={() => {
                addPabrik(namaPabrik, emailPabrik, noTelpPabrik, false);
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 18,
                  color: "white",
                  includeFontPadding: false,
                }}
              >
                Simpan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 329,
                height: 45,
                backgroundColor: "#2FA33B",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
              onPress={() => {
                addPabrik(namaPabrik, emailPabrik, noTelpPabrik, true);
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 18,
                  color: "white",
                  includeFontPadding: false,
                }}
              >
                Simpan dan Tambah Lainnya
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal */}
        <LoadingModal visible={isLoading} />
      </View>
    );
  }

  return (
    <View>
      <Text>Pabrikan Mobile</Text>
    </View>
  );
};

export default PabrikanAdd;
