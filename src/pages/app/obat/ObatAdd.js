import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import useResponsive from "../../../utils/hook/useResponsive";
import Header from "../../../component/Header";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import LoadingScreen from "../../../component/LoadingScreen";
import toast from "../../../utils/helper/Toast";
import LoadingModal from "../../../component/LoadingModal";
import { TextInputMask } from "react-native-masked-text";

const ObatAdd = ({ navigation, route }) => {
  const { isDesktopOrLaptop } = useResponsive();

  const { obatId } = route.params;

  const { userToken } = useContext(AuthContext);

  const hargaBeliRef = useRef(null);
  const hargaJualRef = useRef(null);

  const [namaObat, setNamaObat] = useState("");
  const [namaGenerik, setNamaGenerik] = useState("");
  const [takaran, setTakaran] = useState("");
  const [kategori, setKategori] = useState(null);
  const [dataKategori, setDataKategori] = useState(null);
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const [pabrik, setPabrik] = useState(null);
  const [dataPabrik, setDataPabrik] = useState(null);
  const [showPabrikDropdown, setShowPabrikDropdown] = useState(false);
  const [hargaBeli, setHargaBeli] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addObat = async (
    namaObat,
    namaGenerik,
    takaran,
    kategoriId,
    pabrikId,
    hargaBeli,
    hargaJual,
    again
  ) => {
    setIsLoading(true);

    await fetch(API_ACCESS.obat, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        namaObat,
        namaGenerik,
        takaran,
        kategoriId,
        pabrikId,
        hargaBeli,
        hargaJual,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Obat berhasil ditambahkan!") {
          toast.success({ message: json.message });

          if (again === true) {
            setNamaObat("");
            setNamaGenerik("");
            setTakaran("");
            setKategori(null);
            setPabrik(null);
            setHargaBeli("");
            setHargaJual("");
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

  const updateObat = async (
    namaObat,
    namaGenerik,
    takaran,
    kategoriId,
    pabrikId,
    hargaBeli,
    hargaJual,
    obatId
  ) => {
    setIsLoading(true);

    await fetch(API_ACCESS.obat + `/${obatId}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        namaObat,
        namaGenerik,
        takaran,
        kategoriId,
        pabrikId,
        hargaBeli,
        hargaJual,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Data obat berhasil diubah!") {
          toast.success({ message: json.message });
          navigation.goBack();
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
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, []);

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
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async (obatId) => {
      await fetch(API_ACCESS.obat + `/${obatId}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setNamaObat(json.data[0].nama_obat);
            setNamaGenerik(json.data[0].nama_generik);
            setTakaran(json.data[0].takaran);
            setKategori(json.data[0].kategoriObat);
            setPabrik(json.data[0].pabrik);
            setHargaBeli(json.data[0].harga_beli);
            setHargaJual(json.data[0].harga_jual);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    if (obatId) {
      fetchData(obatId);
    }
  }, []);

  if (dataKategori === null || dataPabrik === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <Header
          title="Obat"
          subtitle="/ Kelola Obat / Tambah Obat"
          navigation={navigation}
        />

        <View
          style={{
            height: 908,
            backgroundColor: "white",
            borderRadius: 10,
            marginHorizontal: 14,
            marginBottom: 14,
            marginTop: 17,
          }}
        >
          <View style={{ marginTop: 44, marginLeft: 24, flex: 1 }}>
            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                color: "#001B45",
              }}
            >
              Nama Obat
            </Text>

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
                value={namaObat}
                onChangeText={(text) => setNamaObat(text)}
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

            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                color: "#001B45",
                marginTop: 21,
              }}
            >
              Nama Generik (Optional)
            </Text>

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
                value={namaGenerik}
                onChangeText={(text) => setNamaGenerik(text)}
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

            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                color: "#001B45",
                marginTop: 21,
              }}
            >
              Takaran (Optional)
            </Text>

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
                value={takaran}
                onChangeText={(text) => setTakaran(text)}
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

            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                color: "#001B45",
                marginTop: 21,
              }}
            >
              Kategori
            </Text>

            <View style={{ zIndex: 999 }}>
              <TouchableOpacity
                style={{
                  width: 394,
                  height: 42,
                  borderWidth: 2,
                  borderColor: "#BDBDBD",
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  setShowKategoriDropdown(!showKategoriDropdown);
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 1,
                  }}
                >
                  {kategori === null ? "" : kategori.nama_kategori}
                </Text>

                <Image
                  source={require("../../../assets/images/dropdownKategori.png")}
                  style={{ width: 16, height: 16, resizeMode: "contain" }}
                />
              </TouchableOpacity>

              {/* Dropdown Kategori */}
              {showKategoriDropdown === true && (
                <ScrollView
                  style={{
                    width: 394,
                    height: 200,
                    backgroundColor: "#F4F4F4",
                    borderRadius: 10,
                    position: "absolute",
                    top: 47,
                    zIndex: 999,
                  }}
                >
                  {dataKategori.map((tmp) => (
                    <TouchableOpacity
                      style={{ paddingVertical: 12, alignItems: "center" }}
                      onPress={() => {
                        setKategori(tmp);
                        setShowKategoriDropdown(false);
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 16,
                          color: "#333333",
                          includeFontPadding: false,
                        }}
                      >
                        {tmp.nama_kategori}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              {/* Dropdown Kategori End */}
            </View>

            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                color: "#001B45",
                marginTop: 21,
              }}
            >
              Pabrik
            </Text>

            <View style={{ zIndex: 998 }}>
              <TouchableOpacity
                style={{
                  width: 394,
                  height: 42,
                  borderWidth: 2,
                  borderColor: "#BDBDBD",
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  setShowPabrikDropdown(!showPabrikDropdown);
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 1,
                  }}
                >
                  {pabrik === null ? "" : pabrik.nama_pabrik}
                </Text>

                <Image
                  source={require("../../../assets/images/dropdownKategori.png")}
                  style={{ width: 16, height: 16, resizeMode: "contain" }}
                />
              </TouchableOpacity>

              {/* Dropdown Pabrik */}
              {showPabrikDropdown === true && (
                <ScrollView
                  style={{
                    width: 394,
                    height: 200,
                    backgroundColor: "#F4F4F4",
                    borderRadius: 10,
                    position: "absolute",
                    top: 47,
                    zIndex: 998,
                  }}
                >
                  {dataPabrik.map((tmp) => (
                    <TouchableOpacity
                      style={{ paddingVertical: 12, alignItems: "center" }}
                      onPress={() => {
                        setPabrik(tmp);
                        setShowPabrikDropdown(false);
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 16,
                          color: "#333333",
                          includeFontPadding: false,
                        }}
                      >
                        {tmp.nama_pabrik}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              {/* Dropdown Pabrik End */}
            </View>

            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                color: "#001B45",
                marginTop: 21,
              }}
            >
              Harga Beli Pabrikan
            </Text>

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
              <TextInputMask
                ref={hargaBeliRef}
                value={hargaBeli}
                type={"money"}
                options={{
                  precision: 0,
                  separator: ",",
                  delimiter: ".",
                  unit: "Rp. ",
                  suffixUnit: "",
                }}
                onChangeText={(text) => setHargaBeli(text)}
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

            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                color: "#001B45",
                marginTop: 21,
              }}
            >
              Harga Jual
            </Text>

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
              <TextInputMask
                ref={hargaJualRef}
                value={hargaJual}
                type={"money"}
                options={{
                  precision: 0,
                  separator: ",",
                  delimiter: ".",
                  unit: "Rp. ",
                  suffixUnit: "",
                }}
                onChangeText={(text) => setHargaJual(text)}
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
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginBottom: 30,
              marginRight: 34,
            }}
          >
            <TouchableOpacity
              style={{
                width: 142,
                height: 45,
                borderRadius: 10,
                backgroundColor: "#D76363",
                justifyContent: "center",
                alignItems: "center",
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

            {obatId ? (
              <TouchableOpacity
                style={{
                  width: 131,
                  height: 45,
                  borderRadius: 10,
                  backgroundColor: "#062659",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 20,
                }}
                onPress={() => {
                  updateObat(
                    namaObat,
                    namaGenerik,
                    takaran,
                    kategori === null ? null : kategori.id,
                    pabrik === null ? null : pabrik.id,
                    hargaBeli,
                    hargaJual,
                    obatId
                  );
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
                  Ubah
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    width: 131,
                    height: 45,
                    borderRadius: 10,
                    backgroundColor: "#062659",
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 20,
                  }}
                  onPress={() => {
                    addObat(
                      namaObat,
                      namaGenerik,
                      takaran,
                      kategori === null ? null : kategori.id,
                      pabrik === null ? null : pabrik.id,
                      hargaBeliRef.current.getRawValue(),
                      hargaJualRef.current.getRawValue(),
                      false
                    );
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
                    borderRadius: 10,
                    backgroundColor: "#2FA33B",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    addObat(
                      namaObat,
                      namaGenerik,
                      takaran,
                      kategori === null ? null : kategori.id,
                      pabrik === null ? null : pabrik.id,
                      hargaBeliRef.current.getRawValue(),
                      hargaJualRef.current.getRawValue(),
                      true
                    );
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
            )}
          </View>
        </View>

        {/* Modal */}
        <LoadingModal visible={isLoading} />
      </ScrollView>
    );
  }

  return (
    <View>
      <Text>Obat Mobile</Text>
    </View>
  );
};

export default ObatAdd;
