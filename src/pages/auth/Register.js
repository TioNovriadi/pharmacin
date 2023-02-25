import {
  View,
  Text,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { API_ACCESS } from "../../utils/config/Endpoint";
import toast from "../../utils/helper/Toast";
import LoadingModal from "../../component/LoadingModal";
import useResponsive from "../../utils/hook/useResponsive";

const HEIGHT = Dimensions.get("window").height;

const Register = ({ navigation }) => {
  const { isDesktopOrLaptop } = useResponsive();

  const flatlistAnim = useRef(null);

  const [dataPage, setDataPage] = useState([
    {
      id: 1,
      title: "Masukan alamat email dan kata sandi untuk membuat akun.",
    },
    {
      id: 2,
      title: "Masukan data diri pengguna.",
    },
    {
      id: 3,
      title: "Masukan data klinik atau rumah sakit.",
    },
  ]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seePas, setSeePas] = useState(false);
  const [confPass, setConfPass] = useState("");
  const [seeConfPass, setSeeConfPass] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [namaKlinik, setNamaKlinik] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState(null);
  const [dataJenisKelamin, setDataJenisKelamin] = useState([
    {
      id: 1,
      label: "Pria",
      value: "male",
    },
    {
      id: 2,
      label: "Wanita",
      value: "female",
    },
  ]);
  const [showJenisKelaminDropdown, setShowJenisKelaminDropdown] =
    useState(false);
  const [noHp, setNoHp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const register = async (
    email,
    password,
    password_confirmation,
    namaLengkap,
    jenisKelamin,
    noHp,
    namaKlinik,
    noTelp
  ) => {
    setIsLoading(true);

    await fetch(API_ACCESS.register, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        password_confirmation,
        namaLengkap,
        jenisKelamin,
        noHp,
        namaKlinik,
        noTelp,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Registrasi berhasil!") {
          console.log(json);
          toast.success({ message: json.message });
          navigation.goBack();
        } else {
          console.log(json);
          toast.danger({ message: json.messages.errors[0].message });
          if (
            json.messages.errors[0].field === "email" ||
            json.messages.errors[0].field === "password" ||
            json.messages.errors[0].field === "password_confirmation"
          ) {
            flatlistAnim.current.scrollToIndex({ animation: true, index: 0 });
          } else if (
            json.messages.errors[0].field === "namaLengkap" ||
            json.messages.errors[0].field === "jenisKelamin" ||
            json.messages.errors[0].field === "noHp"
          ) {
            flatlistAnim.current.scrollToIndex({ animation: true, index: 1 });
          }
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isDesktopOrLaptop) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#062659",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: 480,
            height: HEIGHT,
            backgroundColor: "white",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            position: "absolute",
            left: 0,
            zIndex: 999,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 43,
              marginTop: 46,
            }}
            onPress={() => {
              if (activePage === 0) {
                navigation.goBack();
              } else if (activePage === 1) {
                flatlistAnim.current.scrollToIndex({
                  animation: true,
                  index: 0,
                });
                setActivePage(0);
              } else if (activePage === 2) {
                flatlistAnim.current.scrollToIndex({
                  animation: true,
                  index: 1,
                });
                setActivePage(1);
              }
            }}
          >
            <Image
              source={require("../../assets/images/back.png")}
              style={{ width: 24, height: 24, marginRight: 28 }}
            />

            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 20,
                color: "#747474",
                includeFontPadding: false,
              }}
            >
              Kembali
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              fontSize: 48,
              color: "#333333",
              includeFontPadding: false,
              marginLeft: 44,
              marginTop: 24,
            }}
          >
            Daftar
          </Text>

          <FlatList
            ref={flatlistAnim}
            data={dataPage}
            style={{ marginTop: 8 }}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <ScrollView style={{ width: 480 }}>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 18,
                    color: "#747474",
                    includeFontPadding: false,
                    marginHorizontal: 44,
                  }}
                >
                  {item.title}
                </Text>

                {index === 0 ? (
                  <View
                    style={{
                      marginHorizontal: 43,
                      marginTop: 147,
                    }}
                  >
                    <View
                      style={{
                        height: 54,
                        borderWidth: 2,
                        borderColor: "#D0D0D0",
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 14,
                      }}
                    >
                      <Image
                        source={require("../../assets/images/email.png")}
                        style={{ width: 24, height: 24, marginRight: 24 }}
                      />

                      <TextInput
                        value={email}
                        placeholder="Alamat Email"
                        placeholderTextColor="#ACACAC"
                        onChangeText={(text) => setEmail(text)}
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 18,
                          color: "#333333",
                          includeFontPadding: false,
                          flex: 1,
                          outline: "none",
                        }}
                      />
                    </View>

                    <View
                      style={{
                        height: 54,
                        borderWidth: 2,
                        borderColor: "#D0D0D0",
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 14,
                        marginTop: 60,
                      }}
                    >
                      <Image
                        source={require("../../assets/images/password.png")}
                        style={{ width: 24, height: 24, marginRight: 24 }}
                      />

                      <TextInput
                        value={password}
                        placeholder="Kata Sandi"
                        placeholderTextColor="#ACACAC"
                        onChangeText={(text) => setPassword(text)}
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 18,
                          color: "#333333",
                          includeFontPadding: false,
                          flex: 1,
                          outline: "none",
                          marginRight: 24,
                        }}
                        secureTextEntry={seePas == true ? false : true}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          setSeePas(!seePas);
                        }}
                      >
                        <Image
                          source={
                            seePas === true
                              ? require("../../assets/images/see.png")
                              : require("../../assets/images/unsee.png")
                          }
                          style={{
                            width: 24,
                            height: 24,
                            resizeMode: "contain",
                          }}
                        />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        height: 54,
                        borderWidth: 2,
                        borderColor: "#D0D0D0",
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 14,
                        marginTop: 60,
                      }}
                    >
                      <Image
                        source={require("../../assets/images/password.png")}
                        style={{ width: 24, height: 24, marginRight: 24 }}
                      />

                      <TextInput
                        value={confPass}
                        placeholder="Konfirmasi Kata Sandi"
                        placeholderTextColor="#ACACAC"
                        onChangeText={(text) => setConfPass(text)}
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 18,
                          color: "#333333",
                          includeFontPadding: false,
                          flex: 1,
                          outline: "none",
                          marginRight: 24,
                        }}
                        secureTextEntry={seeConfPass == true ? false : true}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          setSeeConfPass(!seeConfPass);
                        }}
                      >
                        <Image
                          source={
                            seeConfPass === true
                              ? require("../../assets/images/see.png")
                              : require("../../assets/images/unsee.png")
                          }
                          style={{
                            width: 24,
                            height: 24,
                            resizeMode: "contain",
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : index === 2 ? (
                  <View style={{ marginHorizontal: 43, marginTop: 147 }}>
                    <View
                      style={{
                        height: 54,
                        borderWidth: 2,
                        borderColor: "#D0D0D0",
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 14,
                      }}
                    >
                      <TextInput
                        value={namaKlinik}
                        placeholder="Nama Klinik / Rumah Sakit"
                        placeholderTextColor="#ACACAC"
                        onChangeText={(text) => setNamaKlinik(text)}
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 18,
                          color: "#333333",
                          includeFontPadding: false,
                          flex: 1,
                          outline: "none",
                        }}
                      />
                    </View>

                    <View
                      style={{
                        height: 54,
                        borderWidth: 2,
                        borderColor: "#D0D0D0",
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 14,
                        marginTop: 60,
                      }}
                    >
                      <TextInput
                        value={noTelp}
                        placeholder="Nomor Telepon (Optional)"
                        placeholderTextColor="#ACACAC"
                        onChangeText={(text) => setNoTelp(text)}
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 18,
                          color: "#333333",
                          includeFontPadding: false,
                          flex: 1,
                          outline: "none",
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={{ marginHorizontal: 43, marginTop: 147 }}>
                    <View
                      style={{
                        height: 54,
                        borderWidth: 2,
                        borderColor: "#D0D0D0",
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 14,
                      }}
                    >
                      <TextInput
                        value={namaLengkap}
                        placeholder="Nama Lengkap"
                        placeholderTextColor="#ACACAC"
                        onChangeText={(text) => setNamaLengkap(text)}
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 18,
                          color: "#333333",
                          includeFontPadding: false,
                          flex: 1,
                          outline: "none",
                        }}
                      />
                    </View>

                    <View style={{ marginTop: 60, zIndex: 999 }}>
                      <TouchableOpacity
                        style={{
                          height: 54,
                          borderWidth: 2,
                          borderColor: "#D0D0D0",
                          borderRadius: 10,
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 14,
                        }}
                        onPress={() => {
                          setShowJenisKelaminDropdown(
                            !showJenisKelaminDropdown
                          );
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Poppins-Regular",
                            fontSize: 18,
                            color:
                              jenisKelamin === null ? "#ACACAC" : "#333333",
                            includeFontPadding: false,
                            flex: 1,
                          }}
                        >
                          {jenisKelamin === null
                            ? "Jenis Kelamin"
                            : jenisKelamin.label}
                        </Text>

                        <Image
                          source={require("../../assets/images/dropdownJenisKelamin.png")}
                          style={{
                            width: 14,
                            height: 14,
                            resizeMode: "contain",
                          }}
                        />
                      </TouchableOpacity>

                      {/* Dropdpwn Jenis Kelamin */}
                      {showJenisKelaminDropdown === true && (
                        <View
                          style={{
                            backgroundColor: "#F4F4F4",
                            borderRadius: 10,
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: "-200%",
                          }}
                        >
                          {dataJenisKelamin.map((tmp) => (
                            <TouchableOpacity
                              style={{
                                alignItems: "center",
                                paddingVertical: 12,
                              }}
                              onPress={() => {
                                setJenisKelamin(tmp);
                                setShowJenisKelaminDropdown(false);
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "Poppins-Regular",
                                  fontSize: 18,
                                  color: "#333333",
                                  includeFontPadding: false,
                                }}
                              >
                                {tmp.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    <View
                      style={{
                        height: 54,
                        borderWidth: 2,
                        borderColor: "#D0D0D0",
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 14,
                        marginTop: 60,
                        zIndex: 0,
                      }}
                    >
                      <TextInput
                        value={noHp}
                        placeholder="Nomor Handphone"
                        placeholderTextColor="#ACACAC"
                        onChangeText={(text) => setNoHp(text)}
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontSize: 18,
                          color: "#333333",
                          includeFontPadding: false,
                          flex: 1,
                          outline: "none",
                        }}
                      />
                    </View>
                  </View>
                )}

                <View
                  style={{
                    position: "absolute",
                    top: 603,
                    alignSelf: "center",
                    paddingBottom: 167,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 283,
                      height: 47,
                      backgroundColor: "#062659",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 2,
                        height: 4,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 10,
                    }}
                    onPress={() => {
                      if (index === 0) {
                        flatlistAnim.current.scrollToIndex({
                          animation: true,
                          index: 1,
                        });
                        setActivePage(1);
                      } else if (index === 1) {
                        flatlistAnim.current.scrollToIndex({
                          animation: true,
                          index: 2,
                        });
                        setActivePage(2);
                      } else {
                        register(
                          email,
                          password,
                          confPass,
                          namaLengkap,
                          jenisKelamin === null ? null : jenisKelamin.value,
                          noHp,
                          namaKlinik,
                          noTelp
                        );
                      }
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
                      {index === 0
                        ? "Daftar"
                        : index === 1
                        ? "Selanjutnya"
                        : "Konfirmasi"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          />
        </View>

        <Image
          source={require("../../assets/images/logo.png")}
          style={{
            width: 131,
            height: 30,
            position: "absolute",
            right: 40,
            top: 40,
          }}
        />

        <View style={{ paddingLeft: 470 }}>
          <Image
            source={require("../../assets/images/regisTopDesign.png")}
            style={{ width: 536, height: 295 }}
          />
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Image
            source={require("../../assets/images/regisBottomDesign.png")}
            style={{ width: 550, height: 356 }}
          />
        </View>

        {/* Modal */}
        <LoadingModal visible={isLoading} />
      </View>
    );
  }

  return (
    <View>
      <Text>Register Mobile</Text>
    </View>
  );
};

export default Register;
