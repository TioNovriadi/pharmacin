import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../../component/Header";
import useResponsive from "../../../utils/hook/useResponsive";
import { AuthContext } from "../../../utils/context/AuthContext";
import toast from "../../../utils/helper/Toast";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import LoadingScreen from "../../../component/LoadingScreen";
import useFormatter from "../../../utils/hook/useFormatter";

const DashboardHome = ({ navigation }) => {
  const { isDesktopOrLaptop } = useResponsive();
  const { formatter } = useFormatter();

  const { kasirStatus, userToken } = useContext(AuthContext);

  const [dataLaporan, setDataLaporan] = useState(null);
  const [invoiceHarian, setInvoiceHarian] = useState(null);

  const formatAngka = (angka) => {
    var str = "" + angka;
    var pad = "0000";
    var ans = pad.substring(0, pad.length - str.length) + str;

    return ans;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(API_ACCESS.laporan, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setDataLaporan(json.data);
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
      await fetch(API_ACCESS.invoice_harian, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setInvoiceHarian(json.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, []);

  if (dataLaporan === null || invoiceHarian === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <Header title="Dashboard" navigation={navigation} />

        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              marginLeft: 14,
              marginRight: 24,
              marginTop: 17,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 24,
                  color: "#2FA33B",
                  includeFontPadding: false,
                  marginLeft: 24,
                  marginTop: 20,
                }}
              >
                Laporan Hari Ini
              </Text>

              <View style={{ marginTop: 34 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 43,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 18,
                      color: "#333333",
                      includeFontPadding: false,
                    }}
                  >
                    Jumlah Transaksi Jual
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 18,
                      color: "#333333",
                      includeFontPadding: false,
                    }}
                  >
                    {formatAngka(dataLaporan.transaksiPenjualan)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 43,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 18,
                      color: "#333333",
                      includeFontPadding: false,
                    }}
                  >
                    Total Penjualan
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 18,
                      color: "#333333",
                      includeFontPadding: false,
                    }}
                  >
                    {formatter.format(dataLaporan.totalPenjualan)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 43,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 18,
                      color: "#333333",
                      includeFontPadding: false,
                    }}
                  >
                    Jumlah Transaksi Beli
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 18,
                      color: "#333333",
                      includeFontPadding: false,
                    }}
                  >
                    {formatAngka(dataLaporan.transaksiPembelian)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 43,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 18,
                      color: "#333333",
                      includeFontPadding: false,
                    }}
                  >
                    Jumlah Batch Kadarluarsa/Habis
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 18,
                      color: "#333333",
                      includeFontPadding: false,
                    }}
                  >
                    {formatAngka(dataLaporan.stockHabis)}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                width: 313,
                height: 440,
                paddingLeft: 20,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{ width: 293, height: 210, borderRadius: 10 }}
                onPress={() => {
                  if (kasirStatus === false) {
                    toast.info({ message: "Kasir belum dibuka!" });
                  } else {
                    navigation.navigate("PenjualanAdd");
                  }
                }}
              >
                <ImageBackground
                  source={require("../../../assets/images/tambahPenjualanBackground.png")}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    overflow: "hidden",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/tambahPenjualanIcon.png")}
                    style={{ width: 82, height: 82, marginTop: 31 }}
                  />

                  <Text
                    style={{
                      fontFamily: "Poppins-SemiBold",
                      fontSize: 24,
                      color: "white",
                      includeFontPadding: false,
                      textAlign: "center",
                      marginHorizontal: 85,
                      marginTop: 15,
                    }}
                  >
                    Tambah Penjualan
                  </Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ width: 293, height: 210, borderRadius: 10 }}
                onPress={() => {
                  navigation.navigate("PembelianAdd");
                }}
              >
                <ImageBackground
                  source={require("../../../assets/images/pembelianBaruBackground.png")}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    overflow: "hidden",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/pembelianBaruIcon.png")}
                    style={{ width: 82, height: 82, marginTop: 31 }}
                  />

                  <Text
                    style={{
                      fontFamily: "Poppins-SemiBold",
                      fontSize: 24,
                      color: "white",
                      includeFontPadding: false,
                      textAlign: "center",
                      marginHorizontal: 85,
                      marginTop: 15,
                    }}
                  >
                    Pembelian Baru
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              height: 442,
              marginLeft: 14,
              marginRight: 24,
              marginVertical: 20,
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 24,
                color: "#2FA33B",
                includeFontPadding: false,
                marginLeft: 23,
                marginTop: 20,
              }}
            >
              Penjualan Hari Ini
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 10,
                paddingTop: 18,
                paddingBottom: 14,
                paddingHorizontal: 29,
                borderBottomWidth: 2,
                borderBottomColor: "#D9D9D9",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 16,
                  color: "#001B45",
                  includeFontPadding: false,
                  width: 100,
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
                  textAlign: "center",
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
                  textAlign: "center",
                  marginRight: 15,
                }}
              >
                Nama Pelanggan
              </Text>

              <Text
                style={{
                  flex: 1,
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 16,
                  color: "#001B45",
                  includeFontPadding: false,
                  textAlign: "right",
                  marginRight: 15,
                }}
              >
                Total Pembelian
              </Text>
            </View>

            <FlatList
              data={invoiceHarian}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 10,
                    paddingHorizontal: 29,
                    paddingVertical: 15,
                    backgroundColor:
                      (index + 1) % 2 === 0 ? "#F4F4F4" : "white",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 16,
                      color: "#333333",
                      includeFontPadding: false,
                      width: 100,
                      textAlign: "center",
                      marginRight: 15,
                    }}
                  >
                    {index + 1}
                  </Text>

                  <Text
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontFamily: "Poppins-Regular",
                      fontSize: 16,
                      color: "#333333",
                      includeFontPadding: false,
                      marginRight: 15,
                    }}
                  >
                    0001
                  </Text>

                  <Text
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontFamily: "Poppins-Regular",
                      fontSize: 16,
                      color: "#333333",
                      includeFontPadding: false,
                      marginRight: 15,
                    }}
                  >
                    {item.dataPelanggan.nama_pelanggan}
                  </Text>

                  <Text
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontFamily: "Poppins-Regular",
                      fontSize: 16,
                      color: "#333333",
                      includeFontPadding: false,
                      marginRight: 15,
                    }}
                  >
                    {formatter.format(item.harga_total)}
                  </Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View>
      <Text>DashboardHome Mobile</Text>
    </View>
  );
};

export default DashboardHome;
