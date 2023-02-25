import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../../component/Header";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import LoadingScreen from "../../../component/LoadingScreen";
import { useIsFocused } from "@react-navigation/native";
import FilterButton from "../../../component/FilterButton";
import useResponsive from "../../../utils/hook/useResponsive";

const PabrikanHome = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const { isDesktopOrLaptop } = useResponsive();

  const isFocused = useIsFocused();

  const [search, setSearch] = useState("");
  const [dataPabrik, setDataPabrik] = useState(null);
  const [dataPabrikView, setDataPabrikView] = useState(null);
  const [filter, setFilter] = useState("Nama Pabrik");

  const searchFilter = (text, filter) => {
    if (text) {
      const newData = dataPabrik.filter((tmp) => {
        let itemData = null;

        if (filter === "Nama Pabrik") {
          itemData = tmp.nama_pabrik
            ? tmp.nama_pabrik.toUpperCase()
            : "".toUpperCase();
        } else if (filter === "Email") {
          itemData = tmp.email_pabrik
            ? tmp.email_pabrik.toUpperCase()
            : "".toUpperCase();
        } else if (filter === "Telepon") {
          itemData = tmp.no_telp_pabrik
            ? tmp.no_telp_pabrik.toUpperCase()
            : "".toUpperCase();
        }

        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });

      setDataPabrikView(newData);
      setSearch(text);
    } else {
      setDataPabrikView(dataPabrik);
      setSearch(text);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(API_ACCESS.pabrik, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setDataPabrik(json.data);
            setDataPabrikView(json.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  if (dataPabrik === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <Header
          title="Pabrikan"
          subtitle="/ Kelola Pabrik"
          navigation={navigation}
        />

        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            marginHorizontal: 14,
            marginBottom: 14,
            marginTop: 17,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 14,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              zIndex: 999,
            }}
          >
            <FilterButton
              data={dataPabrik}
              filter={filter}
              setFilter={setFilter}
              setSearch={setSearch}
              setData={setDataPabrikView}
              dataKey={["Nama Pabrik", "Email", "Telepon"]}
            />

            <View
              style={{
                width: 253,
                height: 42,
                borderWidth: 2,
                borderColor: "#BDBDBD",
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 8,
                marginHorizontal: 10,
              }}
            >
              <Image
                source={require("../../../assets/images/search.png")}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: "contain",
                  marginRight: 15,
                }}
              />

              <TextInput
                value={search}
                placeholder="Cari..."
                placeholderTextColor="#333333"
                onChangeText={(text) => searchFilter(text, filter)}
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: "#333333",
                  includeFontPadding: false,
                  flex: 1,
                  outline: "none",
                }}
              />
            </View>

            <TouchableOpacity
              style={{
                width: 184,
                height: 42,
                backgroundColor: "#2FA33B",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("PabrikanAdd");
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  color: "white",
                  includeFontPadding: false,
                }}
              >
                Tambah Pabrik
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 17,
              paddingBottom: 13,
              borderBottomWidth: 2,
              borderBottomColor: "#D9D9D9",
            }}
          >
            <Text
              style={{
                width: 100,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                textAlign: "center",
                marginRight: 15,
              }}
            >
              No
            </Text>

            <Text
              style={{
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
              }}
            >
              Nama Pabrik
            </Text>

            <Text
              style={{
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
              }}
            >
              Email
            </Text>

            <Text
              style={{
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
              }}
            >
              Telepon
            </Text>

            <Text
              style={{
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                textAlign: "center",
              }}
            >
              Tindakan
            </Text>
          </View>

          <FlatList
            data={dataPabrikView}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 7,
                  backgroundColor: (index + 1) % 2 === 0 ? "#F4F4F4" : "white",
                }}
                onPress={() => {
                  navigation.navigate("PabrikanRincian", {
                    pabrikId: item.id,
                  });
                }}
              >
                <Text
                  style={{
                    width: 100,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    textAlign: "center",
                    marginRight: 15,
                  }}
                >
                  {index + 1}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    marginRight: 15,
                  }}
                >
                  {item.nama_pabrik}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    marginRight: 15,
                  }}
                >
                  {item.email_pabrik === null ? "-" : item.email_pabrik}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    marginRight: 15,
                  }}
                >
                  {item.no_telp_pabrik === null ? "-" : item.no_telp_pabrik}
                </Text>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 42,
                      height: 40,
                      backgroundColor: "#EBC86E",
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12.6,
                    }}
                  >
                    <Image
                      source={require("../../../assets/images/edit.png")}
                      style={{ width: 25.2, height: 24 }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      width: 42,
                      height: 40,
                      backgroundColor: "#CD4A4F",
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../../../assets/images/delete.png")}
                      style={{ width: 25.2, height: 24 }}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text>Pabrikan Mobile</Text>
    </View>
  );
};

export default PabrikanHome;
