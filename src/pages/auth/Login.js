import {
  View,
  Text,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import { useFonts } from "expo-font";
import LoadingScreen from "../../component/LoadingScreen";
import { AuthContext } from "../../utils/context/AuthContext";
import useResponsive from "../../utils/hook/useResponsive";

const HEIGHT = Dimensions.get("window").height;

const Login = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const { isDesktopOrLaptop } = useResponsive();

  const [fontsLoaded] = useFonts({
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat-SemiBold.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seePass, setSeePass] = useState(false);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  if (isDesktopOrLaptop) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#2FA33B",
          justifyContent: "space-between",
        }}
      >
        <ScrollView
          style={{
            width: 480,
            backgroundColor: "white",
            height: HEIGHT,
            position: "absolute",
            left: 0,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            zIndex: 999,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 14,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginHorizontal: 44, marginTop: 100 }}>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 48,
                color: "#333333",
                includeFontPadding: false,
              }}
            >
              Masuk
            </Text>

            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 18,
                color: "#747474",
                includeFontPadding: false,
                marginTop: 8,
              }}
            >
              Selamat datang, silahkan masuk dengan akun yang telah terdaftar.
            </Text>
          </View>

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
                secureTextEntry={seePass === true ? false : true}
              />

              <TouchableOpacity
                onPress={() => {
                  setSeePass(!seePass);
                }}
              >
                <Image
                  source={
                    seePass === true
                      ? require("../../assets/images/see.png")
                      : require("../../assets/images/unsee.png")
                  }
                  style={{ width: 24, height: 24, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{ alignItems: "center", marginTop: 182, marginBottom: 86 }}
          >
            <TouchableOpacity
              style={{
                width: 283,
                height: 47,
                backgroundColor: "#2FA33B",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 2,
                  height: 4,
                },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                login(email, password);
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
                Masuk
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: 114,
                height: 1,
                backgroundColor: "#ACACAC",
                marginTop: 48,
              }}
            />

            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 18,
                color: "#333333",
                includeFontPadding: false,
                textAlign: "center",
                marginTop: 54,
              }}
            >
              Tidak punya akun?
            </Text>

            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 18,
                  color: "#2FA33B",
                  includeFontPadding: false,
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                Daftar disini
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
            source={require("../../assets/images/loginTopDesign.png")}
            style={{ width: 536, height: 295 }}
          />
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Image
            source={require("../../assets/images/loginBottomDesign.png")}
            style={{ width: 550, height: 356 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text>Login Mobile</Text>
    </View>
  );
};

export default Login;
