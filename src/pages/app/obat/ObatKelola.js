import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import useResponsive from "../../../utils/hook/useResponsive";
import Header from "../../../component/Header";
import FilterButton from "../../../component/FilterButton";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import LoadingScreen from "../../../component/LoadingScreen";
import { useIsFocused } from "@react-navigation/native";
import DeleteModal from "../../../component/DeleteModal";
import LoadingModal from "../../../component/LoadingModal";
import useFormatter from "../../../utils/hook/useFormatter";

const ObatKelola = ({ navigation }) => {
  const { isDesktopOrLaptop } = useResponsive();
  const { formatter } = useFormatter();

  const { userToken } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [dataObat, setDataObat] = useState(null);
  const [dataObatView, setDataObatView] = useState(null);
  const [filter, setFilter] = useState("Nama Obat");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [obatId, setObatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const isFocused = useIsFocused();

  const searchFilter = (text, filter) => {
    if (text) {
      const newData = dataObat.filter((tmp) => {
        let itemData = null;

        if (filter === "Nama Obat") {
          itemData = tmp.nama_obat
            ? tmp.nama_obat.toUpperCase()
            : "".toUpperCase();
        } else if (filter === "Nama Generik") {
          itemData = tmp.nama_generik
            ? tmp.nama_generik.toUpperCase()
            : "".toUpperCase();
        } else if (filter === "Kategori") {
          itemData = tmp.kategoriObat.nama_kategori
            ? tmp.kategoriObat.nama_kategori.toUpperCase()
            : "".toUpperCase();
        } else if (filter === "Pabrik") {
          itemData = tmp.pabrik.nama_pabrik
            ? tmp.pabrik.nama_pabrik.toUpperCase()
            : "".toUpperCase();
        } else if (filter === "Harga Beli") {
          itemData = tmp.harga_beli
            ? tmp.harga_beli.toString().toUpperCase()
            : "".toUpperCase();
        } else if (filter === "Harga Jual") {
          itemData = tmp.harga_jual
            ? tmp.harga_jual.toString().toUpperCase()
            : "".toUpperCase();
        } else if (filter === "Takaran") {
          itemData = tmp.takaran ? tmp.takaran.toUpperCase() : "".toUpperCase();
        }

        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });

      setDataObatView(newData);
      setSearch(text);
    } else {
      setDataObatView(dataObat);
      setSearch(text);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(API_ACCESS.obat, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setDataObat(json.data);
            setDataObatView(json.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    if (isFocused) {
      fetchData();
    }
  }, [isFocused, refresh]);

  if (dataObat === null || dataObatView === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <Header title="Obat" subtitle="/ Kelola Obat" navigation={navigation} />

        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 10,
            marginHorizontal: 14,
            marginBottom: 14,
            marginTop: 17,
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
              data={dataObat}
              filter={filter}
              setFilter={setFilter}
              setSearch={setSearch}
              setData={setDataObatView}
              dataKey={[
                "Nama Obat",
                "Nama Generik",
                "Kategori",
                "Harga Beli",
                "Harga Jual",
                "Takaran",
              ]}
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
                width: 173,
                height: 42,
                backgroundColor: "#2FA33B",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("ObatAdd", {
                  obatId: null,
                });
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
                Tambah Obat
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
              Nama Obat
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
              Nama Generik
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
              Kategori
            </Text>

            <Text
              style={{
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
                textAlign: "right",
              }}
            >
              Harga Beli
            </Text>

            <Text
              style={{
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
                textAlign: "right",
              }}
            >
              Harga Jual
            </Text>

            <Text
              style={{
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
                textAlign: "center",
              }}
            >
              Takaran
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
            data={dataObatView}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 7,
                  backgroundColor: (index + 1) % 2 === 0 ? "#F4F4F4" : "white",
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
                  {item.nama_obat}
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
                  {item.nama_generik === null ? "-" : item.nama_generik}
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
                  {item.kategoriObat.nama_kategori}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    marginRight: 15,
                    textAlign: "right",
                  }}
                >
                  {formatter.format(item.harga_beli)}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    marginRight: 15,
                    textAlign: "right",
                  }}
                >
                  {formatter.format(item.harga_jual)}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    marginRight: 15,
                    textAlign: "center",
                  }}
                >
                  {item.takaran === null ? "0" : item.takaran}
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
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#EBC86E",
                      marginRight: 12,
                    }}
                    onPress={() => {
                      navigation.navigate("ObatAdd", {
                        obatId: item.id,
                      });
                    }}
                  >
                    <Image
                      source={require("../../../assets/images/edit.png")}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#CD4A4F",
                    }}
                    onPress={() => {
                      setShowDeleteModal(true);
                      setObatId(item.id);
                    }}
                  >
                    <Image
                      source={require("../../../assets/images/delete.png")}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        {/* Modal */}
        <DeleteModal
          visible={showDeleteModal}
          setVisible={setShowDeleteModal}
          id={obatId}
          setId={setObatId}
          mainData="obat"
          subData="batch dan stock"
          setIsLoading={setIsLoading}
          url={API_ACCESS.obat}
          deleteMessage="Obat berhasil dihapus!"
          setRefresh={setRefresh}
        />

        <LoadingModal visible={isLoading} />
      </View>
    );
  }

  return (
    <View>
      <Text>Obat Mobile</Text>
    </View>
  );
};

export default ObatKelola;
