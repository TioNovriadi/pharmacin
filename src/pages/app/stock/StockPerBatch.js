import { View, Text, TextInput, Image, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import useResponsive from "../../../utils/hook/useResponsive";
import Header from "../../../component/Header";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import LoadingScreen from "../../../component/LoadingScreen";

const StockPerBatch = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const { isDesktopOrLaptop } = useResponsive();

  const [search, setSearch] = useState("");
  const [dataObat, setDataObat] = useState(null);
  const [dataObatView, setDataObatView] = useState(null);

  const searchFilter = (text) => {
    if (text) {
      const newData = dataObat.filter((tmp) => {
        const itemData = tmp.obat.nama_obat
          ? tmp.obat.nama_obat.toUpperCase()
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
      await fetch(API_ACCESS.stock_batch, {
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
              if (data[i].batchTerjuals.length > 0) {
                let terjual = 0;

                for (let j = 0; j < data[i].batchTerjuals.length; j++) {
                  terjual = terjual + data[i].batchTerjuals[j].quantity;
                }

                Object.assign(data[i], {
                  terjual,
                });
              } else {
                Object.assign(data[i], {
                  terjual: 0,
                });
              }
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
        <Header
          title="Stock"
          subtitle="/ Obat / Per Batch"
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
              paddingRight: 35,
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
                textAlign: "center",
              }}
            >
              Batch ID
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
              Kadaluarsa
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
              Stock Beli
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
              Terjual
            </Text>

            <Text
              style={{
                flex: 1,
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                textAlign: "right",
              }}
            >
              Stock Sisa
            </Text>
          </View>

          <FlatList
            data={dataObatView}
            keyExtractor={(item) => item.id}
            style={{
              marginHorizontal: 14,
            }}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 15,
                  paddingRight: 35,
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
                  }}
                >
                  {item.obat.nama_generik === null
                    ? "-"
                    : item.obat.nama_generik}
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
                  {item.no_batch}
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
                  {item.stock.kadaluarsa}
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
                  {item.stock.total_stock}
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
                  {item.terjual}
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
                  {item.stock.total_stock_active}
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

export default StockPerBatch;
