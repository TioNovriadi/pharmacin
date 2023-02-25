import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import useResponsive from "../../../utils/hook/useResponsive";
import Header from "../../../component/Header";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import LoadingScreen from "../../../component/LoadingScreen";
import FilterButton from "../../../component/FilterButton";
import useFormatter from "../../../utils/hook/useFormatter";

const PabrikanRincian = ({ navigation, route }) => {
  const { pabrikId } = route.params;

  const { userToken } = useContext(AuthContext);

  const { isDesktopOrLaptop } = useResponsive();
  const { formatter } = useFormatter();

  const [dataPabrik, setDataPabrik] = useState(null);
  const [dataObat, setDataObat] = useState(null);
  const [dataObatView, setDataObatView] = useState(null);
  const [filterKategori, setFilterKategori] = useState(null);
  const [filter, setFilter] = useState("Nama Obat");
  const [search, setSearch] = useState("");
  const [dataKategori, setDataKategori] = useState(null);
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);

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

  const kategoriFilter = (filter) => {
    if (filter) {
      const newData = dataObat.filter((tmp) => {
        return tmp.kategoriObat.nama_kategori === filter.nama_kategori;
      });

      setDataObatView(newData);
      setFilterKategori(filter);
    } else {
      setDataObatView(dataObat);
      setFilterKategori(null);
    }

    setShowKategoriDropdown(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(API_ACCESS.pabrik + `/${pabrikId}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setDataPabrik(json.data[0]);

            let newData = json.data[0].obats;
            for (let i = 0; i < newData.length; i++) {
              let total = 0;
              for (let j = 0; j < newData[i].batches.length; j++) {
                total = total + newData[i].batches[j].stock.total_stock;
              }

              Object.assign(newData[i], {
                stockTotal: total,
              });
            }

            setDataObat(newData);
            setDataObatView(newData);
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

  if (
    dataPabrik === null ||
    dataObat === null ||
    dataObatView === null ||
    dataKategori === null
  ) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <Header
          title="Pabrikan"
          subtitle="/ Kelola Pabrik / Rincian Pabrik"
          navigation={navigation}
        />

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            marginHorizontal: 14,
            marginTop: 17,
            paddingLeft: 37,
            paddingTop: 20,
            paddingBottom: 17.12,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              fontSize: 24,
              color: "#062659",
              includeFontPadding: false,
            }}
          >
            {dataPabrik.nama_pabrik}
          </Text>

          <Text
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: 16,
              color: "#333333",
              includeFontPadding: false,
              marginVertical: 10,
            }}
          >
            {dataPabrik.email_pabrik === null ? "-" : dataPabrik.email_pabrik}
          </Text>

          <Text
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: 16,
              color: "#333333",
              includeFontPadding: false,
            }}
          >
            {dataPabrik.no_telp_pabrik === null
              ? "-"
              : dataPabrik.no_telp_pabrik}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 10,
            marginHorizontal: 14,
            marginBottom: 14,
            marginTop: 12.88,
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
            <View style={{ marginRight: 10, zIndex: 999 }}>
              <TouchableOpacity
                style={{
                  width: 208,
                  height: 42,
                  backgroundColor: "#2FA33B",
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 14,
                  paddingRight: 11,
                }}
                onPress={() => {
                  setShowKategoriDropdown(!showKategoriDropdown);
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Medium",
                    fontSize: 16,
                    color: "white",
                    includeFontPadding: false,
                    flex: 1,
                    marginRight: 10,
                  }}
                >
                  {filterKategori === null
                    ? "Jenis Obat"
                    : filterKategori.nama_kategori}
                </Text>

                <Image
                  source={require("../../../assets/images/dropdownWhite.png")}
                  style={{ width: 16, height: 16, resizeMode: "contain" }}
                />
              </TouchableOpacity>

              {/* Dropdown Kategori */}
              {showKategoriDropdown === true && (
                <ScrollView
                  style={{
                    height: 150,
                    borderRadius: 10,
                    backgroundColor: "#F4F4F4",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 47,
                    zIndex: 999,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 2,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 10,
                  }}
                >
                  {dataKategori.map((tmp) => (
                    <TouchableOpacity
                      style={{ alignItems: "center", paddingVertical: 12 }}
                      onPress={() => {
                        kategoriFilter(tmp);
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
            </View>

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
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
              paddingTop: 17,
              paddingBottom: 13,
              borderBottomWidth: 2,
              borderColor: "#D9D9D9",
            }}
          >
            <Text
              style={{
                width: 100,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#062659",
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
                color: "#062659",
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
                color: "#062659",
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
                color: "#062659",
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
                color: "#062659",
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
                color: "#062659",
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
                color: "#062659",
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
                color: "#062659",
                includeFontPadding: false,
                textAlign: "center",
              }}
            >
              Stock
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
                  paddingVertical: 15,
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
                  {item.takaran === null ? "-" : item.takaran}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    textAlign: "center",
                  }}
                >
                  {item.stockTotal}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text>Pabrik Mobile</Text>
    </View>
  );
};

export default PabrikanRincian;
