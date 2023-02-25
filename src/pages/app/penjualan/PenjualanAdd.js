import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import useResponsive from "../../../utils/hook/useResponsive";
import { AuthContext } from "../../../utils/context/AuthContext";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import LoadingScreen from "../../../component/LoadingScreen";
import useFormatter from "../../../utils/hook/useFormatter";
import { TextInputMask } from "react-native-masked-text";
import toast from "../../../utils/helper/Toast";
import LoadingModal from "../../../component/LoadingModal";

const PenjualanAdd = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const { isDesktopOrLaptop } = useResponsive();
  const { formatter } = useFormatter();

  const tunaiRef = useRef(null);

  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [dataJenisPembayaran, setDataJenisPembayaran] = useState(null);
  const [jenisPembayaran, setJenisPembayaran] = useState(null);
  const [showPembayaranDropdown, setShowPembayaranDropdown] = useState(false);
  const [hargaTotal, setHargaTotal] = useState(0);
  const [tunai, setTunai] = useState(0);
  const [kembalian, setKembalian] = useState(0);
  const [keranjangPenjualan, setKeranjangPenjualan] = useState([]);
  const [dataObat, setDataObat] = useState(null);
  const [refreshFlatlist, setRefreshFlatlist] = useState(false);
  const [refreshObat, setRefreshObat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addPenjualan = async (
    namaPelanggan,
    jenisPembayaranId,
    hargaTotal,
    tunai,
    kembalian,
    keranjangPenjualans
  ) => {
    setIsLoading(true);

    await fetch(API_ACCESS.penjualan, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        namaPelanggan,
        jenisPembayaranId,
        hargaTotal,
        tunai,
        kembalian,
        keranjangPenjualans,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Penjualan berhasil terdata!") {
          toast.success({ message: json.message });
          setNamaPelanggan("");
          setJenisPembayaran(null);
          setHargaTotal(0);
          setTunai(0);
          setKembalian(0);
          setKeranjangPenjualan([]);
          setRefreshObat(!refreshObat);
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
      await fetch(API_ACCESS.jenis_pembayaran, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setDataJenisPembayaran(json.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fecthData = async () => {
      await fetch(API_ACCESS.obat_penjualan, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            let newData = json.data;

            for (let i = 0; i < newData.length; i++) {
              let total = 0;
              for (let j = 0; j < newData[i].batches.length; j++) {
                total = newData[i].batches[j].stock.total_stock_active + total;
              }

              Object.assign(newData[i], {
                totalStock: total,
              });
            }

            setDataObat(newData);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fecthData();
  }, []);

  useEffect(() => {
    if (keranjangPenjualan.length > 0) {
      let total = 0;

      for (let i = 0; i < keranjangPenjualan.length; i++) {
        total = total + keranjangPenjualan[i].hargaTotal;
      }

      setHargaTotal(total);
    } else {
      setHargaTotal(0);
    }
  }, [refreshFlatlist]);

  useEffect(() => {
    const hitung =
      (tunai === 0 ? 0 : tunaiRef.current.getRawValue()) - hargaTotal;

    if (hitung < 0) {
      setKembalian(0);
    } else {
      setKembalian(hitung);
    }
  }, [tunai]);

  if (dataJenisPembayaran === null || dataObat === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 38,
            marginRight: 14,
            marginTop: 33,
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 32,
              color: "#062659",
              includeFontPadding: false,
            }}
          >
            Penjualan{" "}
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#868686",
                includeFontPadding: false,
              }}
            >
              / Penjualan Baru
            </Text>
          </Text>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                width: 136,
                height: 45,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                backgroundColor: "#D76363",
                marginRight: 20,
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
                Kembali
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 259,
                height: 45,
                backgroundColor: "#2FA33B",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                addPenjualan(
                  namaPelanggan,
                  jenisPembayaran === null ? null : jenisPembayaran.id,
                  hargaTotal,
                  tunai === 0 ? 0 : tunaiRef.current.getRawValue(),
                  kembalian,
                  keranjangPenjualan
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
                Lakukan Pembayaran
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{ flexDirection: "row", marginHorizontal: 14, marginTop: 24 }}
        >
          <View
            style={{
              width: 442,
              height: 310,
              backgroundColor: "white",
              paddingHorizontal: 24,
              paddingTop: 18,
              paddingBottom: 25,
              borderRadius: 10,
              marginRight: 14,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 18,
                  color: "#001B45",
                  includeFontPadding: false,
                }}
              >
                Nama Pelanggan
              </Text>

              <View
                style={{
                  height: 42,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "#BDBDBD",
                  justifyContent: "center",
                  paddingHorizontal: 15,
                  marginTop: 6,
                }}
              >
                <TextInput
                  value={namaPelanggan}
                  onChangeText={(text) => setNamaPelanggan(text)}
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    outline: "none",
                  }}
                />
              </View>
            </View>

            <View style={{ marginTop: 21, zIndex: 999 }}>
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 18,
                  color: "#001B45",
                  includeFontPadding: false,
                }}
              >
                Jenis Pembayaran
              </Text>

              <View style={{ marginTop: 6, zIndex: 999 }}>
                <TouchableOpacity
                  style={{
                    height: 42,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "#BDBDBD",
                    justifyContent: "center",
                    paddingHorizontal: 15,
                  }}
                  onPress={() => {
                    setShowPembayaranDropdown(!showPembayaranDropdown);
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
                    {jenisPembayaran !== null &&
                      jenisPembayaran.jenis_pembayaran}
                  </Text>
                </TouchableOpacity>

                {/* Dropdown Jenis Pembayran */}
                {showPembayaranDropdown === true && (
                  <ScrollView
                    style={{
                      height: 150,
                      backgroundColor: "#F4F4F4",
                      borderRadius: 10,
                      position: "absolute",
                      top: 47,
                      left: 0,
                      right: 0,
                      zIndex: 999,
                    }}
                  >
                    {dataJenisPembayaran.map((tmp) => (
                      <TouchableOpacity
                        style={{ alignItems: "center", paddingVertical: 12 }}
                        onPress={() => {
                          setJenisPembayaran(tmp);
                          setShowPembayaranDropdown(false);
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
                          {tmp.jenis_pembayaran}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
                {/* Dropdown Jenis Pembayaran End */}
              </View>
            </View>

            <View style={{ marginTop: 21 }}>
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 18,
                  color: "#001B45",
                  includeFontPadding: false,
                }}
              >
                Tanggal
              </Text>

              <View
                style={{
                  height: 42,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "#BDBDBD",
                  justifyContent: "center",
                  paddingHorizontal: 15,
                  marginTop: 6,
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
                  {new Date().toLocaleDateString("id-ID")}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1, backgroundColor: "white", borderRadius: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 24,
                marginRight: 14,
                marginTop: 22,
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 18,
                  color: "#001B45",
                  includeFontPadding: false,
                }}
              >
                Total
              </Text>

              <View
                style={{
                  width: 394,
                  height: 42,
                  borderWidth: 2,
                  borderColor: "#BDBDBD",
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  justifyContent: "center",
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
                  {formatter.format(hargaTotal)}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 24,
                marginRight: 14,
                marginTop: 14,
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 18,
                  color: "#001B45",
                  includeFontPadding: false,
                }}
              >
                Tunai
              </Text>

              <View
                style={{
                  width: 394,
                  height: 42,
                  borderWidth: 2,
                  borderColor: "#BDBDBD",
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  justifyContent: "center",
                }}
              >
                <TextInputMask
                  ref={tunaiRef}
                  value={tunai}
                  type={"money"}
                  options={{
                    precision: 0,
                    separator: ",",
                    delimiter: ".",
                    unit: "Rp. ",
                    suffixUnit: "",
                  }}
                  onChangeText={(text) => setTunai(text)}
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
                marginLeft: 24,
                marginRight: 14,
                marginTop: 14,
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 18,
                  color: "#001B45",
                  includeFontPadding: false,
                }}
              >
                Kembalian
              </Text>

              <View
                style={{
                  width: 394,
                  height: 42,
                  borderWidth: 2,
                  borderColor: "#BDBDBD",
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  justifyContent: "center",
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
                  {formatter.format(kembalian)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 14,
            margin: 14,
            backgroundColor: "white",
            borderRadius: 10,
            height: 584,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 10,
              marginTop: 14,
              paddingTop: 17,
              paddingBottom: 13,
              borderBottomWidth: 2,
              borderBottomColor: "#D9D9D9",
              paddingLeft: 8,
            }}
          >
            <Text
              style={{
                width: 394,
                textAlign: "center",
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
              }}
            >
              Item
            </Text>

            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
              }}
            >
              Stock
            </Text>

            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
              }}
            >
              Quantity
            </Text>

            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
              }}
            >
              Harga
            </Text>

            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
                marginRight: 15,
              }}
            >
              Total
            </Text>

            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#001B45",
                includeFontPadding: false,
              }}
            >
              Tindakan
            </Text>
          </View>

          <ScrollView style={{ marginHorizontal: 10 }}>
            <FlatList
              data={keranjangPenjualan}
              extraData={refreshFlatlist}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flexDirection: "row",
                    paddingLeft: 8,
                    paddingVertical: 9,
                  }}
                >
                  <View
                    style={{
                      marginRight: 15,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 394,
                        height: 42,
                        borderWidth: 2,
                        borderColor: "#BDBDBD",
                        borderRadius: 10,
                        justifyContent: "center",
                        paddingHorizontal: 15,
                      }}
                      onPress={() => {
                        let data = keranjangPenjualan;

                        if (data[index].showDropdown === true) {
                          Object.assign(data[index], {
                            showDropdown: false,
                          });
                        } else {
                          for (let i = 0; i < data.length; i++) {
                            Object.assign(data[i], {
                              showDropdown: false,
                            });
                          }

                          Object.assign(data[index], {
                            showDropdown: true,
                          });
                        }

                        setKeranjangPenjualan(data);
                        setRefreshFlatlist(!refreshFlatlist);
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
                        {item.obat !== null && item.obat.nama_obat}
                      </Text>
                    </TouchableOpacity>

                    {/* Dropdown Obat */}
                    {item.showDropdown === true && (
                      <ScrollView
                        style={{
                          height: 150,
                          backgroundColor: "#F4F4F4",
                          borderRadius: 10,
                          marginTop: 5,
                        }}
                      >
                        {dataObat.map((tmp) => (
                          <TouchableOpacity
                            style={{ paddingVertical: 12 }}
                            onPress={() => {
                              let data = keranjangPenjualan;
                              let obat = dataObat;

                              Object.assign(data[index], {
                                obat: tmp,
                                showDropdown: false,
                              });

                              obat.splice(obat.indexOf(tmp), 1);
                              setKeranjangPenjualan(data);
                              setDataObat(obat);
                              setRefreshFlatlist(!refreshFlatlist);
                            }}
                            key={tmp.id}
                          >
                            <Text
                              style={{
                                fontFamily: "Poppins-Regular",
                                fontSize: 16,
                                color: "#333333",
                                includeFontPadding: false,
                                textAlign: "center",
                              }}
                            >
                              {tmp.nama_obat}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                    {/* Dropdown Obat End */}
                  </View>

                  <View
                    style={{
                      flex: 1,
                      height: 42,
                      borderWidth: 2,
                      borderColor: "#BDBDBD",
                      borderRadius: 10,
                      marginRight: 15,
                      paddingHorizontal: 15,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 16,
                        color: "#333333",
                        includeFontPadding: false,
                        textAlign: "center",
                      }}
                    >
                      {item.obat !== null && item.obat.totalStock}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      height: 42,
                      borderWidth: 2,
                      borderColor: "#BDBDBD",
                      borderRadius: 10,
                      marginRight: 15,
                      justifyContent: "center",
                      paddingHorizontal: 15,
                    }}
                  >
                    <TextInput
                      value={item.quantity}
                      onChangeText={(text) => {
                        let data = keranjangPenjualan;
                        let num = text.replace(/[^0-9]/g, "");

                        if (text) {
                          Object.assign(data[index], {
                            quantity: num,
                            hargaTotal: data[index].obat.harga_jual * num,
                          });
                        } else {
                          Object.assign(data[index], {
                            quantity: num,
                            hargaTotal: null,
                          });
                        }

                        setKeranjangPenjualan(data);
                        setRefreshFlatlist(!refreshFlatlist);
                      }}
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 16,
                        color: "#333333",
                        includeFontPadding: false,
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      height: 42,
                      borderWidth: 2,
                      borderColor: "#BDBDBD",
                      borderRadius: 10,
                      marginRight: 15,
                      paddingHorizontal: 15,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 16,
                        color: "#333333",
                        includeFontPadding: false,
                        textAlign: "center",
                      }}
                    >
                      {item.obat !== null &&
                        formatter.format(item.obat.harga_jual)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      height: 42,
                      borderWidth: 2,
                      borderColor: "#BDBDBD",
                      borderRadius: 10,
                      marginRight: 15,
                      paddingHorizontal: 15,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 16,
                        color: "#333333",
                        includeFontPadding: false,
                        textAlign: "center",
                      }}
                    >
                      {item.obat !== null && formatter.format(item.hargaTotal)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      height: 42,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8,
                        backgroundColor: "#CD4A4F",
                      }}
                      onPress={() => {
                        let data = keranjangPenjualan;
                        let obat = dataObat;

                        if (data[index].obat !== null) {
                          obat.push(data[index].obat);
                        }
                        data.splice(index, 1);

                        setKeranjangPenjualan(data);
                        setDataObat(obat);
                        setRefreshFlatlist(!refreshFlatlist);
                      }}
                    >
                      <Image
                        source={require("../../../assets/images/desc.png")}
                        style={{ width: 24, height: 24 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            <View style={{ alignItems: "center", marginVertical: 12 }}>
              <TouchableOpacity
                style={{
                  width: 200,
                  height: 40,
                  backgroundColor: "#2FA33B",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                }}
                onPress={() => {
                  let data = keranjangPenjualan;
                  const inputData = {
                    obat: null,
                    quantity: null,
                    hargaTotal: null,
                    showDropdown: false,
                  };

                  data.push(inputData);

                  setKeranjangPenjualan(data);
                  setRefreshFlatlist(!refreshFlatlist);
                }}
              >
                <Image
                  source={require("../../../assets/images/plusPembelian.png")}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Modal */}
        <LoadingModal visible={isLoading} />
      </ScrollView>
    );
  }

  return (
    <View>
      <Text>Penjualan Mobile</Text>
    </View>
  );
};

export default PenjualanAdd;
