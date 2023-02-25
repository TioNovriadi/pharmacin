import { View, Text, ScrollView, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import useResponsive from "../../../utils/hook/useResponsive";
import Header from "../../../component/Header";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import LoadingScreen from "../../../component/LoadingScreen";
import useFormatter from "../../../utils/hook/useFormatter";

const PembelianRincian = ({ navigation, route }) => {
  const { pembelianId } = route.params;

  const { userToken } = useContext(AuthContext);

  const { isDesktopOrLaptop } = useResponsive();
  const { formatter } = useFormatter();

  const [dataPembelian, setDataPembelian] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(API_ACCESS.pembelian + `/${pembelianId}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setDataPembelian(json.data[0]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, []);

  if (dataPembelian === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <Header
          title="Pembelian"
          subtitle="/ Rincian Invoice"
          navigation={navigation}
        />

        <View
          style={{
            height: 908,
            marginHorizontal: 14,
            marginTop: 17,
            marginBottom: 14,
            borderRadius: 10,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 28,
              marginTop: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 24,
                  color: "#2FA33B",
                  includeFontPadding: false,
                }}
              >
                {dataPembelian.pabrik.nama_pabrik}
              </Text>

              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: "#333333",
                  includeFontPadding: false,
                  marginTop: 10,
                }}
              >
                {dataPembelian.pabrik.email_pabrik === null
                  ? "-"
                  : dataPembelian.pabrik.email_pabrik}
              </Text>

              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: "#333333",
                  includeFontPadding: false,
                }}
              >
                {dataPembelian.pabrik.no_telp_pabrik === null
                  ? "-"
                  : dataPembelian.pabrik.no_telp_pabrik}
              </Text>
            </View>

            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: "#333333",
                  includeFontPadding: false,
                }}
              >
                No. Invoice: {dataPembelian.no_invoice}
              </Text>

              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: "#333333",
                  includeFontPadding: false,
                }}
              >
                Tanggal Pembelian: {dataPembelian.created_at.substring(0, 10)}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 10,
              marginTop: 14,
              backgroundColor: "#F6F6F6",
              borderTopWidth: 2,
              borderBottomWidth: 2,
              borderColor: "#D9D9D9",
              paddingVertical: 15,
              paddingLeft: 10,
              paddingRight: 109,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#333333",
                includeFontPadding: false,
                flex: 1,
                marginRight: 15,
              }}
            >
              Nama Produk
            </Text>

            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#333333",
                includeFontPadding: false,
                flex: 1,
                textAlign: "center",
                marginRight: 15,
              }}
            >
              Qty
            </Text>

            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#333333",
                includeFontPadding: false,
                flex: 1,
                textAlign: "right",
                marginRight: 15,
              }}
            >
              Harga
            </Text>

            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#333333",
                includeFontPadding: false,
                flex: 1,
                textAlign: "right",
              }}
            >
              HargaTotal
            </Text>
          </View>

          <FlatList
            data={dataPembelian.keranjangPembelians}
            keyExtractor={(item) => item.id}
            style={{ marginHorizontal: 10 }}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 10,
                  paddingRight: 109,
                  paddingVertical: 15,
                }}
              >
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
                  {item.obat.nama_obat}
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
                  {item.quantity}
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
                  {formatter.format(item.obat.harga_jual)}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    textAlign: "right",
                  }}
                >
                  {formatter.format(item.harga_total)}
                </Text>
              </View>
            )}
          />

          <View
            style={{
              alignItems: "flex-end",
              marginRight: 26,
              marginBottom: 55,
              marginTop: 20,
            }}
          >
            <View style={{ width: 433 }}>
              <View
                style={{
                  backgroundColor: "#F6F6F6",
                  alignItems: "center",
                  paddingVertical: 15,
                  borderTopWidth: 2,
                  borderBottomWidth: 2,
                  borderColor: "#D9D9D9",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-SemiBold",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                  }}
                >
                  Invoice Summary
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 15,
                  paddingHorizontal: 16,
                  justifyContent: "space-between",
                  borderBottomWidth: 2,
                  borderColor: "#D9D9D9",
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
                  Total
                </Text>

                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                  }}
                >
                  {formatter.format(dataPembelian.harga_total)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View>
      <Text>Pembelian Mobile</Text>
    </View>
  );
};

export default PembelianRincian;
