import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { API_ACCESS } from "../utils/config/Endpoint";
import LoadingScreen from "./LoadingScreen";
import { AuthContext } from "../utils/context/AuthContext";
import toast from "../utils/helper/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = ({ title, navigation, subtitle = null }) => {
  const { userId, userToken, logout, kasirStatus, setKasirStatus } =
    useContext(AuthContext);

  const [dataUser, setDataUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showKasirModal, setShowKasirModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(API_ACCESS.user + `/${userId}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "Data fetched!") {
            setDataUser(json.data[0]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchData();
  }, []);

  if (dataUser === null) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 40,
        marginLeft: 20,
        marginRight: 24,
        zIndex: 999,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            backgroundColor: "#062659",
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 20,
          }}
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <Image
            source={require("../assets/images/leftArrow.png")}
            style={{ width: 34, height: 34, resizeMode: "contain" }}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "Poppins-Bold",
            fontSize: 32,
            color: "#062659",
            includeFontPadding: false,
          }}
        >
          {title}{" "}
          {subtitle !== null && (
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 16,
                color: "#868686",
                includeFontPadding: false,
              }}
            >
              {subtitle}
            </Text>
          )}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            width: 149,
            height: 42,
            backgroundColor: kasirStatus === true ? "#D76363" : "#2FA33B",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            marginRight: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          }}
          onPress={() => {
            setShowKasirModal(true);
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
            {kasirStatus === true ? "Tutup Kasir" : "Buka Kasir"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 42,
            height: 42,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            marginRight: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          }}
        >
          <Image
            source={require("../assets/images/setting.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            style={{
              width: 42,
              height: 42,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              marginRight: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 2,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            }}
            onPress={() => {
              setShowNotif(!showNotif);
              setShowDropdown(false);
            }}
          >
            <Image
              source={require("../assets/images/notif.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>

          {/* Dropdown Modal */}
          {showNotif === true && (
            <View
              style={{
                width: 202,
                backgroundColor: "white",
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 3,
                position: "absolute",
                right: 10,
                top: 52,
                zIndex: 999,
                shadowColor: "#000",
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 7,
                  borderBottomWidth: 1,
                  borderBottomColor: "#EFEFEF",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 3,
                  }}
                >
                  Kadaluarsa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 7,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 3,
                  }}
                >
                  Stock Habis
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View>
          <TouchableOpacity
            style={{
              width: 202,
              height: 42,
              backgroundColor: "white",
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              shadowColor: "#000",
              shadowOffset: {
                width: 2,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            }}
            onPress={() => {
              setShowDropdown(!showDropdown);
              setShowNotif(false);
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 16,
                color: "#333333",
                includeFontPadding: false,
                flex: 1,
                marginRight: 5,
              }}
            >
              {dataUser.profile.nama_lengkap}
            </Text>

            <Image
              source={require("../assets/images/dropdownUser.png")}
              style={{ width: 14, height: 14, resizeMode: "contain" }}
            />
          </TouchableOpacity>

          {/* Dropdown Modal */}
          {showDropdown === true && (
            <View
              style={{
                width: 202,
                backgroundColor: "white",
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 3,
                position: "absolute",
                top: 52,
                zIndex: 999,
                shadowColor: "#000",
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 7,
                  borderBottomWidth: 1,
                  borderBottomColor: "#EFEFEF",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Image
                    source={require("../assets/images/user.png")}
                    style={{ width: 24, height: 24 }}
                  />
                </View>

                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 3,
                  }}
                >
                  Pengguna
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 7,
                  borderBottomWidth: 1,
                  borderBottomColor: "#EFEFEF",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Image
                    source={require("../assets/images/langganan.png")}
                    style={{ width: 24, height: 24 }}
                  />
                </View>

                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 3,
                  }}
                >
                  Langganan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 7,
                }}
                onPress={() => {
                  logout();
                }}
              >
                <View style={{ flex: 1 }}>
                  <Image
                    source={require("../assets/images/logout.png")}
                    style={{ width: 24, height: 24 }}
                  />
                </View>

                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: "#333333",
                    includeFontPadding: false,
                    flex: 3,
                  }}
                >
                  Keluar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Modal */}
      <Modal visible={showKasirModal} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 405,
              height: 242,
              borderRadius: 20,
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 24,
                color: "#373737",
                includeFontPadding: false,
                textAlign: "center",
                marginTop: 46,
              }}
            >
              {kasirStatus === true ? "Tutup Kasir" : "Buka Kasir"}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginTop: 66,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 150,
                  height: 60,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#D8D8D8",
                }}
                onPress={() => {
                  setShowKasirModal(false);
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    fontSize: 20,
                    color: "#505050",
                    includeFontPadding: false,
                  }}
                >
                  Batalkan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: 150,
                  height: 60,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: kasirStatus === true ? "#D76363" : "#2FA33B",
                }}
                onPress={async () => {
                  if (kasirStatus === true) {
                    toast.success({ message: "Kasir ditutup!" });
                  } else {
                    toast.success({ message: "Kasir dibuka!" });
                  }

                  await AsyncStorage.setItem("kasirStatus", !kasirStatus);
                  setKasirStatus(!kasirStatus);
                  setShowKasirModal(false);
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    fontSize: 20,
                    color: "white",
                    includeFontPadding: false,
                  }}
                >
                  {kasirStatus === true ? "Tutup" : "Buka"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Header;
