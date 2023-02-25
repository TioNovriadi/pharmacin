import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Modal,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../../component/Header";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import LoadingScreen from "../../../component/LoadingScreen";
import toast from "../../../utils/helper/Toast";
import LoadingModal from "../../../component/LoadingModal";
import DeleteModal from "../../../component/DeleteModal";
import FilterButton from "../../../component/FilterButton";
import useResponsive from "../../../utils/hook/useResponsive";

const ObatKategori = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const { isDesktopOrLaptop } = useResponsive();

  const [search, setSearch] = useState("");
  const [dataKategori, setDataKategori] = useState(null);
  const [dataKategoriView, setDataKategoriView] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [namaKategori, setNamaKategori] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [kategoriId, setKategoriId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filter, setFilter] = useState("Nama Kategori");

  const addKategori = async (namaKategori) => {
    setShowAddModal(false);
    setIsLoading(true);

    await fetch(API_ACCESS.kategori_obat, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        namaKategori,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Kategori Obat berhasil ditambahkan!") {
          toast.success({ message: json.message });
          setRefresh(!refresh);
        } else {
          toast.danger({ message: json.messages.errors[0].message });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
        setNamaKategori("");
      });
  };

  const updateKategori = async (namaKategori, updateId) => {
    setShowAddModal(false);
    setIsLoading(true);

    await fetch(API_ACCESS.kategori_obat + `/${updateId}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        namaKategori,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Data kategori obat berhasil diubah!") {
          toast.success({ message: json.message });
          setRefresh(!refresh);
        } else {
          toast.danger({ message: json.messages.errors[0].message });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
        setKategoriId(null);
        setNamaKategori("");
      });
  };

  const searchFilter = (text, filter) => {
    if (text) {
      const newData = dataKategori.filter((tmp) => {
        let itemData = null;

        if (filter === "ID Kategori") {
          itemData = tmp.id
            ? tmp.id.toString().toUpperCase()
            : "".toUpperCase();
        } else if (filter === "Nama Kategori") {
          itemData = tmp.nama_kategori
            ? tmp.nama_kategori.toUpperCase()
            : "".toUpperCase();
        }

        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });

      setDataKategoriView(newData);
      setSearch(text);
    } else {
      setDataKategoriView(dataKategori);
      setSearch(text);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(API_ACCESS.kategori_obat, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setDataKategori(json.data);
            setDataKategoriView(json.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, [refresh]);

  if (dataKategori === null || dataKategoriView === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <Header title="Obat" subtitle="/ Kategori" navigation={navigation} />

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
              data={dataKategori}
              filter={filter}
              setFilter={setFilter}
              setSearch={setSearch}
              setData={setDataKategoriView}
              dataKey={["ID Kategori", "Nama Kategori"]}
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
                width: 201,
                height: 42,
                backgroundColor: "#2FA33B",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setShowAddModal(true);
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
                Tambah Kategori
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
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                textAlign: "center",
                marginRight: 15,
              }}
            >
              ID Kategori
            </Text>

            <Text
              style={{
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                textAlign: "center",
                marginRight: 15,
              }}
            >
              Nama Kategori
            </Text>

            <Text
              style={{
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                textAlign: "center",
                marginRight: 15,
              }}
            >
              Tindakan
            </Text>
          </View>

          <FlatList
            data={dataKategoriView}
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
                    flex: 1,
                    textAlign: "center",
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                  }}
                >
                  {item.id}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                  }}
                >
                  {item.nama_kategori}
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
                      setNamaKategori(item.nama_kategori);
                      setShowAddModal(true);
                      setKategoriId(item.id);
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
                      setKategoriId(item.id);
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
        <Modal visible={showAddModal} transparent>
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
                width: 640,
                height: 357,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 18,
                  color: "#001B45",
                  includeFontPadding: false,
                  textAlign: "center",
                  marginTop: 54,
                }}
              >
                Nama Kategori
              </Text>

              <View style={{ alignItems: "center", marginTop: 47, flex: 1 }}>
                <View
                  style={{
                    width: 394,
                    height: 42,
                    borderWidth: 2,
                    borderColor: "#BDBDBD",
                    borderRadius: 10,
                    justifyContent: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <TextInput
                    value={namaKategori}
                    onChangeText={(text) => setNamaKategori(text)}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontFamily: "Poppins-Medium",
                      fontSize: 16,
                      color: "#333333",
                      includeFontPadding: false,
                      outline: "none",
                    }}
                    onSubmitEditing={() => {
                      if (kategoriId === null) {
                        addKategori(namaKategori);
                      } else {
                        updateKategori(namaKategori, kategoriId);
                      }
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginRight: 18,
                  marginBottom: 18,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 122,
                    height: 45,
                    backgroundColor: "#A5A5A5",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 20,
                  }}
                  onPress={() => {
                    setNamaKategori("");
                    setShowAddModal(false);
                    setKategoriId(null);
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
                    width: 138,
                    height: 45,
                    backgroundColor: "#2FA33B",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    if (kategoriId === null) {
                      addKategori(namaKategori);
                    } else {
                      updateKategori(namaKategori, kategoriId);
                    }
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
                    {kategoriId !== null ? "Ubah" : "Tambah"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <DeleteModal
          visible={showDeleteModal}
          setVisible={setShowDeleteModal}
          id={kategoriId}
          setId={setKategoriId}
          mainData="kategori obat"
          subData="obat"
          setIsLoading={setIsLoading}
          url={API_ACCESS.kategori_obat}
          deleteMessage="Kategori Obat berhasil dihapus!"
          setRefresh={setRefresh}
          refresh={refresh}
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

export default ObatKategori;
