import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import useResponsive from "../../../utils/hook/useResponsive";
import { API_ACCESS } from "../../../utils/config/Endpoint";
import { AuthContext } from "../../../utils/context/AuthContext";
import LoadingScreen from "../../../component/LoadingScreen";
import LoadingModal from "../../../component/LoadingModal";
import useFormatter from "../../../utils/hook/useFormatter";
import toast from "../../../utils/helper/Toast";
import { DatePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import moment from "moment/moment";

const PembelianAdd = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const { isDesktopOrLaptop } = useResponsive();
  const { formatter } = useFormatter();

  const [dataPabrik, setDataPabrik] = useState(null);
  const [dataObat, setDataObat] = useState(null);
  const [pabrik, setPabrik] = useState(null);
  const [showPabrikDropdown, setShowPabrikDropdown] = useState(false);
  const [noInvoice, setNoInvoice] = useState(null);
  const [hargaTotal, setHargaTotal] = useState(0);
  const [keranjangPembelian, setKeranjangPembelian] = useState([]);
  const [date, setDate] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [itemIndex, setItemIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshFlatlist, setRefreshFlatlist] = useState(false);
  const [refreshInvoice, setRefreshInvoice] = useState(false);

  const getObat = async (data) => {
    setIsLoading(true);

    await fetch(API_ACCESS.pabrik + `/${data.id}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Data fetched!") {
          setDataObat(json.data[0].obats);
          setPabrik(data);
          setShowPabrikDropdown(false);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDismissSingle = useCallback(() => {
    setOpen(false);
    setItemIndex(null);
  }, [setOpen, setItemIndex]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  const addPembelian = async (
    dataKeranjang,
    pabrikId,
    noInvoice,
    hargaTotal
  ) => {
    setIsLoading(true);

    const newData = [];
    for (let i = 0; i < dataKeranjang.length; i++) {
      newData.push({
        obatId: dataKeranjang[i].obat.id,
        noBatch:
          dataKeranjang[i].obat.nama_obat.trim().toUpperCase() +
          dataKeranjang[i].noBatch,
        kadaluarsa: dataKeranjang[i].kadaluarsa,
        quantity: dataKeranjang[i].quantity,
        hargaTotal: dataKeranjang[i].hargaTotal,
      });
    }

    await fetch(API_ACCESS.pembelian, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        pabrikId,
        noInvoice,
        hargaTotal,
        keranjangPembelian: newData,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Pembelian berhasil!") {
          toast.success({ message: json.message });
          setPabrik(null);
          setRefreshInvoice(!refreshInvoice);
          setHargaTotal(0);
          setKeranjangPembelian([]);
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
    const getNoInvoice = async () => {
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
            var str = "" + (json.data.length + 1);
            var pad = "0000";
            var ans = pad.substring(0, pad.length - str.length) + str;

            setNoInvoice("INV/" + new Date().getFullYear("id-ID") + "/" + ans);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    getNoInvoice();
  }, [refreshInvoice]);

  useEffect(() => {
    if (date !== undefined) {
      let data = keranjangPembelian;

      Object.assign(data[itemIndex], {
        kadaluarsa: moment(date).format("yyyy-MM-DD"),
      });

      setKeranjangPembelian(data);
      setItemIndex(null);
      setDate(undefined);
      setRefreshFlatlist(!refreshFlatlist);
    }
  }, [date]);

  useEffect(() => {
    if (keranjangPembelian.length > 0) {
      let total = 0;

      for (let i = 0; i < keranjangPembelian.length; i++) {
        total = total + keranjangPembelian[i].hargaTotal;
      }

      setHargaTotal(total);
    } else {
      setHargaTotal(0);
    }
  }, [refreshFlatlist]);

  if (dataPabrik === null || noInvoice === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <SafeAreaProvider>
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
              Pembelian{" "}
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 16,
                  color: "#868686",
                  includeFontPadding: false,
                }}
              >
                / Pembelian Baru
              </Text>
            </Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  width: 136,
                  height: 45,
                  backgroundColor: "#D76363",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
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
                  width: 240,
                  height: 45,
                  backgroundColor: "#2FA33B",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  addPembelian(
                    keranjangPembelian,
                    pabrik === null ? null : pabrik.id,
                    noInvoice,
                    hargaTotal
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
                  Tambah Pembelian
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 14,
              marginTop: 24,
            }}
          >
            <View
              style={{
                width: 442,
                height: 310,
                borderRadius: 10,
                backgroundColor: "white",
                paddingHorizontal: 24,
                paddingTop: 18,
                paddingBottom: 25,
                marginRight: 14,
              }}
            >
              <View style={{ zIndex: 999 }}>
                <Text
                  style={{
                    fontFamily: "Poppins-Medium",
                    fontSize: 18,
                    color: "#001B45",
                    includeFontPadding: false,
                  }}
                >
                  Nama Pabrik
                </Text>

                <View style={{ marginTop: 6, zIndex: 999 }}>
                  <TouchableOpacity
                    style={{
                      height: 42,
                      borderWidth: 2,
                      borderColor: "#BDBDBD",
                      borderRadius: 10,
                      justifyContent: "center",
                      paddingHorizontal: 15,
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
                      }}
                    >
                      {pabrik === null ? null : pabrik.nama_pabrik}
                    </Text>
                  </TouchableOpacity>

                  {/* Dropdown Pabrik */}
                  {showPabrikDropdown === true && (
                    <ScrollView
                      style={{
                        height: 155,
                        backgroundColor: "#F4F4F4",
                        borderRadius: 10,
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 47,
                        zIndex: 999,
                      }}
                    >
                      {dataPabrik.map((item) => (
                        <TouchableOpacity
                          style={{ alignItems: "center", paddingVertical: 12 }}
                          key={item.id}
                          onPress={() => {
                            getObat(item);
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
                            {item.nama_pabrik}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                  {/* Dropdown Pabrik End */}
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
                  Nomor Invoice
                </Text>

                <View
                  style={{
                    height: 42,
                    borderWidth: 2,
                    borderColor: "#BDBDBD",
                    borderRadius: 10,
                    justifyContent: "center",
                    paddingHorizontal: 15,
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
                    {noInvoice}
                  </Text>
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
                    borderWidth: 2,
                    borderColor: "#BDBDBD",
                    borderRadius: 10,
                    justifyContent: "center",
                    paddingHorizontal: 15,
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

            <View
              style={{ flex: 1, backgroundColor: "white", borderRadius: 10 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 22,
                  marginLeft: 24,
                  marginRight: 14,
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
                    justifyContent: "center",
                    paddingHorizontal: 15,
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
            </View>
          </View>

          <View
            style={{
              height: 584,
              backgroundColor: "white",
              borderRadius: 10,
              margin: 14,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 14,
                marginHorizontal: 10,
                paddingLeft: 8,
                paddingTop: 17,
                paddingBottom: 13,
                borderBottomWidth: 2,
                borderColor: "#D9D9D9",
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
                  marginRight: 28,
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
                  marginRight: 28,
                }}
              >
                Batch
              </Text>

              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 16,
                  color: "#001B45",
                  includeFontPadding: false,
                  marginRight: 28,
                }}
              >
                Kadaluarsa
              </Text>

              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 16,
                  color: "#001B45",
                  includeFontPadding: false,
                  marginRight: 28,
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
                  marginRight: 28,
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
                  marginRight: 28,
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

            {pabrik !== null && (
              <ScrollView style={{ marginHorizontal: 10 }}>
                <FlatList
                  data={keranjangPembelian}
                  keyExtractor={(item, index) => index}
                  extraData={refreshFlatlist}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        paddingLeft: 8,
                        paddingVertical: 9,
                      }}
                    >
                      <View style={{ marginRight: 26 }}>
                        <TouchableOpacity
                          style={{
                            width: 394,
                            height: 42,
                            borderWidth: 2,
                            borderColor: "#BDBDBD",
                            borderRadius: 10,
                            paddingHorizontal: 15,
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            let data = keranjangPembelian;

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

                            setKeranjangPembelian(data);
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
                            {item.obat === null ? null : item.obat.nama_obat}
                          </Text>
                        </TouchableOpacity>

                        {/* Dropdown Obat */}
                        {item.showDropdown === true && (
                          <ScrollView
                            style={{
                              height: 155,
                              backgroundColor: "#F4F4F4",
                              borderRadius: 10,
                              marginTop: 5,
                            }}
                          >
                            {dataObat.map((tmp) => (
                              <TouchableOpacity
                                style={{
                                  alignItems: "center",
                                  paddingVertical: 12,
                                }}
                                onPress={() => {
                                  let data = keranjangPembelian;
                                  let obat = dataObat;
                                  var str = "" + (tmp.batches.length + 1);
                                  var pad = "0000";
                                  var ans =
                                    pad.substring(0, pad.length - str.length) +
                                    str;

                                  Object.assign(data[index], {
                                    obat: tmp,
                                    showDropdown: false,
                                    noBatch: ans,
                                  });

                                  obat.splice(obat.indexOf(tmp), 1);

                                  setKeranjangPembelian(data);
                                  setDataObat(obat);
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
                          paddingHorizontal: 15,
                          justifyContent: "center",
                          marginRight: 26,
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
                          {item.noBatch}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={{
                          flex: 1,
                          height: 42,
                          borderWidth: 2,
                          borderColor: "#BDBDBD",
                          borderRadius: 10,
                          paddingHorizontal: 15,
                          justifyContent: "center",
                          marginRight: 26,
                        }}
                        onPress={() => {
                          if (item.obat !== null) {
                            setOpen(true);
                            setItemIndex(index);
                          } else {
                            toast.info({ message: "Pilih item dahulu!" });
                          }
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
                          {item.kadaluarsa}
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={{
                          flex: 1,
                          height: 42,
                          borderWidth: 2,
                          borderColor: "#BDBDBD",
                          borderRadius: 10,
                          paddingHorizontal: 15,
                          justifyContent: "center",
                          marginRight: 26,
                        }}
                      >
                        <TextInput
                          value={item.quantity}
                          onChangeText={(text) => {
                            let data = keranjangPembelian;
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

                            setKeranjangPembelian(data);
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
                          editable={item.obat === null ? false : true}
                        />
                      </View>

                      <View
                        style={{
                          flex: 1,
                          height: 42,
                          borderWidth: 2,
                          borderColor: "#BDBDBD",
                          borderRadius: 10,
                          paddingHorizontal: 15,
                          justifyContent: "center",
                          marginRight: 26,
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
                          {item.obat === null
                            ? null
                            : formatter.format(item.obat.harga_jual)}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          height: 42,
                          borderWidth: 2,
                          borderColor: "#BDBDBD",
                          borderRadius: 10,
                          paddingHorizontal: 15,
                          justifyContent: "center",
                          marginRight: 26,
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
                          {item.obat === null
                            ? null
                            : formatter.format(item.hargaTotal)}
                        </Text>
                      </View>

                      <View style={{ flex: 1, alignItems: "center" }}>
                        <TouchableOpacity
                          style={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#CD4A4F",
                            borderRadius: 8,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() => {
                            let data = keranjangPembelian;
                            let obat = dataObat;

                            obat.push(item.obat);
                            data.splice(index, 1);

                            setKeranjangPembelian(data);
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
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      if (dataObat.length === 0) {
                        toast.info({
                          message: "Tidak ada lagi obat yang tersedia!",
                        });
                      } else {
                        let data = keranjangPembelian;
                        const tmp = {
                          obat: null,
                          noBatch: null,
                          kadaluarsa: null,
                          quantity: null,
                          hargaTotal: null,
                          showDropdown: false,
                        };

                        data.push(tmp);

                        setKeranjangPembelian(data);
                        setRefreshFlatlist(!refreshFlatlist);
                      }
                    }}
                  >
                    <Image
                      source={require("../../../assets/images/plusPembelian.png")}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>

          {/* Modal */}
          <LoadingModal visible={isLoading} />

          <DatePickerModal
            locale="id"
            mode="single"
            visible={open}
            onDismiss={onDismissSingle}
            date={date}
            onConfirm={onConfirmSingle}
          />
        </ScrollView>
      </SafeAreaProvider>
    );
  }

  return (
    <View>
      <Text>Pembelian Mobile</Text>
    </View>
  );
};

export default PembelianAdd;
