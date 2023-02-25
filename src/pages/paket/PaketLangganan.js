import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { API_ACCESS } from "../../utils/config/Endpoint";
import { AuthContext } from "../../utils/context/AuthContext";
import LoadingScreen from "../../component/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import toast from "../../utils/helper/Toast";
import LoadingModal from "../../component/LoadingModal";
import { useMediaQuery } from "react-responsive";

const PaketLangganan = () => {
  const isDesktopOrLaptop = useMediaQuery({
    minDeviceWidth: 1224,
  });

  const { userToken, setPaketLanggananId, logout } = useContext(AuthContext);

  const [dataPaket, setDataPaket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const kFormatter = (num) => {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  };

  const beliPaket = async (paket) => {
    setIsLoading(true);

    await fetch(API_ACCESS.paket, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        paket,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Paket berhasil dibeli!") {
          toast.success({ message: json.message });
          setPaketLanggananId(paket.id);
          AsyncStorage.setItem("paketLanggananId", paket.id);
        } else {
          console.log(json);
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
      await fetch(API_ACCESS.paket, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setDataPaket(json.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, []);

  if (dataPaket === null) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginLeft: 52,
            marginRight: 77,
            marginTop: 30,
          }}
        >
          <Image
            source={require("../../assets/images/logoWarna.png")}
            style={{ width: 131, height: 30 }}
          />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity>
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 16,
                  color: "#949494",
                  includeFontPadding: false,
                }}
              >
                Terms of Service
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginHorizontal: 57 }}>
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 16,
                  color: "#949494",
                  includeFontPadding: false,
                }}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                logout();
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 16,
                  color: "#949494",
                  includeFontPadding: false,
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row", flex: 1 }}>
          <View
            style={{
              flex: 1,
              paddingTop: 122,
              paddingLeft: 130,
              paddingRight: 94,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 24,
                  color: "#2FA33B",
                  includeFontPadding: false,
                }}
              >
                Selamat Datang!
              </Text>

              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 36,
                  color: "#001B45",
                  includeFontPadding: false,
                }}
              >
                Pilih Durasi Berlangganan
              </Text>
            </View>

            <View style={{ marginTop: 33 }}>
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 20,
                  color: "#363636",
                  includeFontPadding: false,
                }}
              >
                Bagaimana versi Uji Coba bekerja?
              </Text>

              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 14,
                  color: "#767676",
                  includeFontPadding: false,
                  marginTop: 12,
                }}
              >
                Pengguna dapat menggunakan aplikasi{" "}
                <Text style={{ fontFamily: "Poppins-Bold" }}>Pharmac.in</Text>{" "}
                dengan semua fiturnya secara gratis dalam jangka waktu 7 hari.
                {"\n\n"}
                Setelah jangka waktu tersebut, pengguna tidak dapat mengakses
                semua fitur apabila tidak mengajukan berlangganan.
              </Text>
            </View>

            <View style={{ marginTop: 52 }}>
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 20,
                  color: "#363636",
                  includeFontPadding: false,
                }}
              >
                Cara Berlangganan?
              </Text>

              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 14,
                  color: "#767676",
                  includeFontPadding: false,
                  marginTop: 12,
                }}
              >
                Segera hubungi admin untuk melakukan aktivasi akun berlangganan.
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingTop: 212,
              paddingLeft: 94,
              paddingRight: 130,
            }}
          >
            {dataPaket.map((tmp, index) => {
              if (index !== 0) {
                return (
                  <TouchableOpacity
                    style={{
                      height: 85,
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: "#F3F2F5",
                      borderRadius: 20,
                      paddingHorizontal: 34,
                      marginTop: index !== 0 ? 20 : 0,
                      justifyContent: "space-between",
                    }}
                    key={tmp.id}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-SemiBold",
                        fontSize: 18,
                        color: "#777777",
                        includeFontPadding: false,
                      }}
                    >
                      {tmp.jenis_paket}
                    </Text>

                    <Text
                      style={{
                        fontFamily: "Poppins-SemiBold",
                        fontSize: 18,
                        color: "#363636",
                        includeFontPadding: false,
                      }}
                    >
                      Rp. {kFormatter(tmp.harga_paket)}
                    </Text>
                  </TouchableOpacity>
                );
              }
            })}

            <View style={{ alignItems: "center", marginTop: 54 }}>
              <TouchableOpacity
                style={{
                  width: 283,
                  height: 47,
                  backgroundColor: "#2FA33B",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 2,
                    height: 4,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-SemiBold",
                    fontSize: 18,
                    color: "white",
                    includeFontPadding: false,
                  }}
                >
                  Hubungi Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "center", marginTop: 182 }}>
          <TouchableOpacity
            style={{
              width: 379,
              height: 63,
              backgroundColor: "#001B45",
              borderRadius: 40,
              shadowColor: "#000",
              shadowOffset: {
                width: 2,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              beliPaket(dataPaket[0]);
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 22,
                color: "white",
                includeFontPadding: false,
              }}
            >
              Mulai 7 Hari Uji Coba
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: "Poppins-Medium",
              fontSize: 14,
              color: "#949494",
              includeFontPadding: false,
              marginTop: 76,
              marginBottom: 14,
            }}
          >
            Copyright {"\u00A9"} 2023 Pharmac.in
          </Text>
        </View>

        {/* Modal */}
        <LoadingModal visible={isLoading} />
      </ScrollView>
    );
  }

  return (
    <View>
      <Text>PaketLangganan Mobile</Text>
    </View>
  );
};

export default PaketLangganan;
