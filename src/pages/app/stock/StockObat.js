import { View, Text, Image, TextInput, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import useResponsive from "../../../utils/hook/useResponsive";
import Header from "../../../component/Header";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import useFormatter from "../../../utils/hook/useFormatter";
import LoadingScreen from "../../../component/LoadingScreen";

const StockObat = ({ navigation }) => {
  const { isDesktopOrLaptop } = useResponsive();
  const { formatter } = useFormatter();

  const { userToken } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [dataObat, setDataObat] = useState(null);
  const [dataObatView, setDataObatView] = useState(null);

  const searchFilter = (text) => {
    if (text) {
      const newData = dataObat.filter((tmp) => {
        const itemData = tmp.nama_obat
          ? tmp.nama_obat.toUpperCase()
          : "".toUpperCase();
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
      await fetch(API_ACCESS.stock, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            let data = json.data;

            for (let i = 0; i < data.length; i++) {
              let total = 0;

              for (let j = 0; j < data[i].batches.length; j++) {
                total = total + data[i].batches[j].stock.total_stock_active;
              }

              Object.assign(data[i], {
                totalStock: total,
              });
            }

            setDataObat(data);
            setDataObatView(data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, []);

  if (dataObat === null || dataObatView === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <Header title="Stock" subtitle="/ Obat" navigation={navigation} />

        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 10,
            marginHorizontal: 14,
            marginBottom: 14,
            marginTop: 17,
          }}
        >
          <View
            style={{
              alignItems: "flex-end",
              marginTop: 14,
              marginRight: 28.02,
            }}
          >
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
                onChangeText={(text) => searchFilter(text)}
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
              marginHorizontal: 14,
              marginTop: 7,
              paddingTop: 17,
              paddingBottom: 13,
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
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                flex: 1,
                marginRight: 15,
              }}
            >
              Nama Obat
            </Text>

            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                flex: 1,
                marginRight: 15,
              }}
            >
              Nama Generik
            </Text>

            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                flex: 1,
                marginRight: 15,
              }}
            >
              Kategori
            </Text>

            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                flex: 1,
                marginRight: 15,
                textAlign: "right",
              }}
            >
              Harga Beli
            </Text>

            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                flex: 1,
                marginRight: 15,
                textAlign: "right",
              }}
            >
              Harga Jual
            </Text>

            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                flex: 1,
                textAlign: "center",
              }}
            >
              Stock
            </Text>
          </View>

          <FlatList
            data={dataObatView}
            keyExtractor={(item) => item.id}
            style={{ marginHorizontal: 14 }}
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
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 1,
                    marginRight: 15,
                  }}
                >
                  {item.nama_obat}
                </Text>

                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 1,
                    marginRight: 15,
                  }}
                >
                  {item.nama_generik === null ? "-" : item.nama_generik}
                </Text>

                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 1,
                    marginRight: 15,
                  }}
                >
                  {item.kategoriObat.nama_kategori}
                </Text>

                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 1,
                    marginRight: 15,
                    textAlign: "right",
                  }}
                >
                  {formatter.format(item.harga_beli)}
                </Text>

                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 1,
                    marginRight: 15,
                    textAlign: "right",
                  }}
                >
                  {formatter.format(item.harga_jual)}
                </Text>

                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  {item.totalStock}
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
      <Text>Stock Mobile</Text>
    </View>
  );
};

export default StockObat;
