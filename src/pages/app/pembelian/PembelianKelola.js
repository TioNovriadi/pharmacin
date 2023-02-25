import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Header from "../../../component/Header";
import { DatePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useResponsive from "../../../utils/hook/useResponsive";
import FilterButton from "../../../component/FilterButton";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import LoadingScreen from "../../../component/LoadingScreen";
import DeleteModal from "../../../component/DeleteModal";
import LoadingModal from "../../../component/LoadingModal";
import useFormatter from "../../../utils/hook/useFormatter";

const PembelianKelola = ({ navigation }) => {
  const { isDesktopOrLaptop } = useResponsive();
  const { formatter } = useFormatter();

  const { userToken } = useContext(AuthContext);

  const [range, setRange] = useState({
    startDate: undefined,
    endDate: undefined,
  });
  const [open, setOpen] = useState(false);
  const [dataPembelian, setDataPembelian] = useState(null);
  const [dataPembelianView, setDataPembelianView] = useState(null);
  const [filter, setFilter] = useState("No Invoice");
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pembelianId, setPembelianId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange]
  );

  const searchFilter = (text, filter) => {
    if (text) {
      const newData = dataPembelian.filter((tmp) => {
        let itemData = null;

        if (filter === "No Invoice") {
          itemData = tmp.no_invoice
            ? tmp.no_invoice.toUpperCase()
            : "".toUpperCase();
        } else if (filter === "Nama Pabrikan") {
          itemData = tmp.pabrik.nama_pabrik
            ? tmp.pabrik.nama_pabrik.toUpperCase()
            : "".toUpperCase();
        }

        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });

      setDataPembelianView(newData);
      setSearch(text);
    } else {
      setDataPembelianView(dataPembelian);
      setSearch(text);
    }
  };

  const dateFilter = (startDate, endDate) => {
    if (startDate !== undefined && endDate !== undefined) {
      const newData = dataPembelian.filter((tmp) => {
        const splitDate = tmp.tanggal_pembelian.split("/");
        const newDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];

        return (
          new Date(newDate) >= new Date(startDate) &&
          new Date(newDate) <= new Date(endDate)
        );
      });

      setDataPembelianView(newData);
    } else {
      setDataPembelianView(dataPembelian);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(API_ACCESS.pembelian, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setDataPembelian(json.data);
            setDataPembelianView(json.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, [refresh]);

  useEffect(() => {
    if (range.startDate !== undefined && range.endDate !== undefined) {
      dateFilter(range.startDate, range.endDate);
    }
  }, [range]);

  if (dataPembelian === null || dataPembelianView === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
          <Header
            title="Pembelian"
            subtitle="/ Kelola Pembelian"
            navigation={navigation}
          />

          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              marginHorizontal: 14,
              marginTop: 17,
              marginBottom: 14,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginLeft: 20,
                marginRight: 10,
                marginTop: 14,
                zIndex: 999,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    width: 185,
                    height: 42,
                    borderWidth: 2,
                    borderColor: "#5C6D88",
                    borderRadius: 10,
                    justifyContent: "center",
                    paddingHorizontal: 35.5,
                  }}
                  onPress={() => {
                    setOpen(true);
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 16,
                      color: "#001B45",
                      includeFontPadding: false,
                      textAlign: "center",
                    }}
                  >
                    {range.startDate === undefined
                      ? "DD/MM/YYYY"
                      : range.startDate.toLocaleDateString("id-ID")}
                  </Text>
                </TouchableOpacity>

                <Image
                  source={require("../../../assets/images/arrowRight.png")}
                  style={{ width: 24, height: 24, marginHorizontal: 20 }}
                />

                <TouchableOpacity
                  style={{
                    width: 185,
                    height: 42,
                    borderWidth: 2,
                    borderColor: "#5C6D88",
                    borderRadius: 10,
                    justifyContent: "center",
                    paddingHorizontal: 35.5,
                  }}
                  onPress={() => {
                    setOpen(true);
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 16,
                      color: "#001B45",
                      includeFontPadding: false,
                      textAlign: "center",
                    }}
                  >
                    {range.endDate === undefined
                      ? "DD/MM/YYYY"
                      : range.endDate.toLocaleDateString("id-ID")}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  zIndex: 999,
                }}
              >
                <FilterButton
                  data={dataPembelian}
                  filter={filter}
                  setFilter={setFilter}
                  setSearch={setSearch}
                  setData={dataPembelianView}
                  dataKey={["No Invoice", "Nama Pabrikan"]}
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
                    width: 220,
                    height: 42,
                    backgroundColor: "#2FA33B",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    navigation.navigate("PembelianAdd");
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
                    Tambah Pembelian
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 10,
                paddingTop: 17,
                paddingBottom: 13,
                borderBottomWidth: 2,
                borderBottomColor: "#D9D9D9",
                marginTop: 7,
              }}
            >
              <Text
                style={{
                  width: 100,
                  textAlign: "center",
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 16,
                  color: "#001B45",
                  includeFontPadding: false,
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
                No Invoice
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
                Nama Pabrikan
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
                Tanggal
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
                Total Pembelian
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
                Tindakan
              </Text>
            </View>

            <FlatList
              data={dataPembelianView}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 7,
                    marginHorizontal: 10,
                    backgroundColor:
                      (index + 1) % 2 === 0 ? "#F4F4F4" : "white",
                  }}
                >
                  <Text
                    style={{
                      width: 100,
                      textAlign: "center",
                      fontFamily: "Poppins-Regular",
                      fontSize: 16,
                      color: "#001B45",
                      includeFontPadding: false,
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
                      color: "#001B45",
                      includeFontPadding: false,
                      marginRight: 15,
                    }}
                  >
                    {item.no_invoice}
                  </Text>

                  <Text
                    style={{
                      flex: 1,
                      fontFamily: "Poppins-Regular",
                      fontSize: 16,
                      color: "#001B45",
                      includeFontPadding: false,
                      marginRight: 15,
                    }}
                  >
                    {item.pabrik.nama_pabrik}
                  </Text>

                  <Text
                    style={{
                      flex: 1,
                      fontFamily: "Poppins-Regular",
                      fontSize: 16,
                      color: "#001B45",
                      includeFontPadding: false,
                      marginRight: 15,
                      textAlign: "center",
                    }}
                  >
                    {item.tanggal_pembelian}
                  </Text>

                  <Text
                    style={{
                      flex: 1,
                      fontFamily: "Poppins-Regular",
                      fontSize: 16,
                      color: "#001B45",
                      includeFontPadding: false,
                      marginRight: 15,
                      textAlign: "right",
                    }}
                  >
                    {formatter.format(item.harga_total)}
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#5891B1",
                        borderRadius: 8,
                        marginRight: 12,
                      }}
                      onPress={() => {
                        navigation.navigate("PembelianRincian", {
                          pembelianId: item.id,
                        });
                      }}
                    >
                      <Image
                        source={require("../../../assets/images/book.png")}
                        style={{ width: 24, height: 24 }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#CD4A4F",
                        borderRadius: 8,
                        marginRight: 12,
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
          <DatePickerModal
            locale="id-ID"
            mode="range"
            visible={open}
            onDismiss={onDismiss}
            startDate={range.startDate}
            endDate={range.endDate}
            onConfirm={onConfirm}
          />

          <DeleteModal
            visible={showDeleteModal}
            setVisible={setShowDeleteModal}
            id={pembelianId}
            setId={setPembelianId}
            mainData="pembelian"
            subData="keranjang pembelian"
            setIsLoading={setIsLoading}
            url={API_ACCESS.pembelian}
            deleteMessage="Data pembelian berhasil dihapus!"
            setRefresh={setRefresh}
          />

          <LoadingModal visible={isLoading} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <View>
      <Text>Pembelian Mobile</Text>
    </View>
  );
};

export default PembelianKelola;
