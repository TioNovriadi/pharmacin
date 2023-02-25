import { View, Text, Animated, Image } from "react-native";
import React, { useRef, useState } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

const CustomDrawer = (props) => {
  const obatAnim = useRef(new Animated.Value(0)).current;
  const stockAnim = useRef(new Animated.Value(0)).current;
  const pembelianAnim = useRef(new Animated.Value(0)).current;

  const obatAnimOp = useRef(new Animated.Value(0)).current;
  const stockAnimOp = useRef(new Animated.Value(0)).current;
  const pembelianAnimOp = useRef(new Animated.Value(0)).current;

  const [focusScreen, setFocusScreen] = useState(0);
  const [focusAnim, setFocusAnim] = useState(null);

  const slideOutAnim = (ref) => {
    Animated.timing(ref, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const slideInAnim = (ref) => {
    Animated.timing(ref, {
      toValue: 110,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const fadeInAnim = (ref) => {
    Animated.timing(ref, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const fadeOutAnim = (ref) => {
    Animated.timing(ref, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ alignItems: "center", marginTop: 41, marginBottom: 50 }}>
        <View
          style={{
            width: 205,
            height: 69,
            backgroundColor: "#2FA33B",
            borderRadius: 10,
          }}
        />
      </View>

      <DrawerContentScrollView {...props}>
        {/* Dashboard Drawer */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              width: 6,
              height: 40,
              backgroundColor: focusScreen === 0 ? "#2FA33B" : "white",
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
            }}
          />

          <DrawerItem
            label="Dashboard"
            icon={() => {
              if (focusScreen === 0) {
                return (
                  <Image
                    source={require("../assets/images/dashboardActive.png")}
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                  />
                );
              } else {
                return (
                  <Image
                    source={require("../assets/images/dashboardInactive.png")}
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                  />
                );
              }
            }}
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color: focusScreen === 0 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeBackgroundColor="white"
            style={{ flex: 1 }}
            onPress={() => {
              setFocusScreen(0);

              if (focusAnim !== null) {
                if (focusAnim === 0) {
                  slideOutAnim(obatAnim);
                  fadeOutAnim(obatAnimOp);
                } else if (focusAnim === 1) {
                  slideOutAnim(stockAnim);
                  fadeOutAnim(stockAnimOp);
                } else if (focusAnim === 2) {
                  slideOutAnim(pembelianAnim);
                  fadeOutAnim(pembelianAnimOp);
                }
              }

              setFocusAnim(null);
              props.navigation.navigate("Dashboard");
            }}
          />
        </View>
        {/* Dashboard Drawer End */}

        {/* Obat Drawer */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              width: 6,
              height: 40,
              backgroundColor:
                focusScreen === 1 || focusScreen == 2 ? "#2FA33B" : "white",
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
            }}
          />

          <DrawerItem
            label="Obat"
            icon={() => {
              if (focusScreen === 1 || focusScreen === 2) {
                return (
                  <Image
                    source={require("../assets/images/obatActive.png")}
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                  />
                );
              } else {
                return (
                  <Image
                    source={require("../assets/images/obatInactive.png")}
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                  />
                );
              }
            }}
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color:
                focusScreen === 1 || focusScreen === 2 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeBackgroundColor="white"
            inactiveBackgroundColor="white"
            style={{ flex: 1 }}
            onPress={() => {
              if (focusAnim === null) {
                slideInAnim(obatAnim);
                fadeInAnim(obatAnimOp);
                setFocusAnim(0);
              } else {
                if (focusAnim === 0) {
                  slideOutAnim(obatAnim);
                  fadeOutAnim(obatAnimOp);
                  setFocusAnim(null);
                } else if (focusAnim === 1) {
                  slideOutAnim(stockAnim);
                  fadeOutAnim(stockAnimOp);
                  slideInAnim(obatAnim);
                  fadeInAnim(obatAnimOp);
                  setFocusAnim(0);
                } else if (focusAnim === 2) {
                  slideOutAnim(pembelianAnim);
                  fadeOutAnim(pembelianAnimOp);
                  slideInAnim(obatAnim);
                  fadeInAnim(obatAnimOp);
                  setFocusAnim(0);
                }
              }
            }}
          />

          {focusScreen === 1 || focusScreen === 2 ? (
            <Image
              source={require("../assets/images/plusActive.png")}
              style={{
                marginRight: 34,
                width: 24,
                height: 24,
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={require("../assets/images/plusInactive.png")}
              style={{
                marginRight: 34,
                width: 24,
                height: 24,
                resizeMode: "contain",
              }}
            />
          )}
        </View>

        {/* Dropdown Obat */}
        <Animated.View style={{ height: obatAnim, opacity: obatAnimOp }}>
          <DrawerItem
            label="Kategori"
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color: focusScreen === 1 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeBackgroundColor="white"
            inactiveBackgroundColor="white"
            onPress={() => {
              setFocusScreen(1);
              props.navigation.navigate("ObatKategori");
            }}
            style={{ marginLeft: 105 }}
          />

          <DrawerItem
            label="Kelola Obat"
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color: focusScreen === 2 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeTintColor="white"
            inactiveTintColor="white"
            activeBackgroundColor="transparent"
            inactiveBackgroundColor="transparent"
            onPress={() => {
              setFocusScreen(2);
              props.navigation.navigate("ObatKelola");
            }}
            style={{
              marginLeft: 105,
            }}
          />
        </Animated.View>
        {/* Dropdown Obat End */}
        {/* Obat Drawer End */}

        {/* Stock Drawer */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              width: 6,
              height: 40,
              backgroundColor:
                focusScreen === 3 || focusScreen === 4 ? "#2FA33B" : "white",
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
            }}
          />

          <DrawerItem
            label="Stock"
            icon={() => {
              if (focusScreen === 3 || focusScreen === 4) {
                return (
                  <Image
                    source={require("../assets/images/stockActive.png")}
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                  />
                );
              } else {
                return (
                  <Image
                    source={require("../assets/images/stockInactive.png")}
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                  />
                );
              }
            }}
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color:
                focusScreen === 3 || focusScreen === 4 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeBackgroundColor="white"
            inactiveBackgroundColor="white"
            style={{ flex: 1 }}
            onPress={() => {
              if (focusAnim === null) {
                slideInAnim(stockAnim);
                fadeInAnim(stockAnimOp);
                setFocusAnim(1);
              } else {
                if (focusAnim === 0) {
                  slideOutAnim(obatAnim);
                  fadeOutAnim(obatAnimOp);
                  slideInAnim(stockAnim);
                  fadeInAnim(stockAnimOp);
                  setFocusAnim(1);
                } else if (focusAnim === 1) {
                  slideOutAnim(stockAnim);
                  fadeOutAnim(stockAnimOp);
                  setFocusAnim(null);
                } else if (focusAnim === 2) {
                  slideOutAnim(pembelianAnim);
                  fadeOutAnim(pembelianAnimOp);
                  slideInAnim(stockAnim);
                  fadeInAnim(stockAnimOp);
                  setFocusAnim(1);
                }
              }
            }}
          />

          {focusScreen === 3 || focusScreen === 4 ? (
            <Image
              source={require("../assets/images/plusActive.png")}
              style={{
                marginRight: 34,
                width: 24,
                height: 24,
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={require("../assets/images/plusInactive.png")}
              style={{
                marginRight: 34,
                width: 24,
                height: 24,
                resizeMode: "contain",
              }}
            />
          )}
        </View>

        {/* Dropdown Stock */}
        <Animated.View style={{ height: stockAnim, opacity: stockAnimOp }}>
          <DrawerItem
            label="Obat"
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color: focusScreen === 3 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeBackgroundColor="white"
            inactiveBackgroundColor="white"
            onPress={() => {
              setFocusScreen(3);
              props.navigation.navigate("StockObat");
            }}
            style={{ marginLeft: 105 }}
          />

          <DrawerItem
            label="Per Batch"
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color: focusScreen === 4 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeTintColor="white"
            inactiveTintColor="white"
            activeBackgroundColor="transparent"
            inactiveBackgroundColor="transparent"
            onPress={() => {
              setFocusScreen(4);
              props.navigation.navigate("StockPerBatch");
            }}
            style={{
              marginLeft: 105,
            }}
          />
        </Animated.View>
        {/* Dropdown Stock End */}
        {/* Stock Drawer End */}

        {/* Pabrikan Drawer */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              width: 6,
              height: 40,
              backgroundColor: focusScreen === 5 ? "#2FA33B" : "white",
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
            }}
          />

          <DrawerItem
            label="Pabrikan"
            icon={() => {
              if (focusScreen === 5) {
                return (
                  <Image
                    source={require("../assets/images/pabrikanActive.png")}
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                  />
                );
              } else {
                return (
                  <Image
                    source={require("../assets/images/pabrikanInactive.png")}
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                  />
                );
              }
            }}
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color: focusScreen === 5 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeBackgroundColor="white"
            style={{ flex: 1 }}
            onPress={() => {
              setFocusScreen(5);

              if (focusAnim !== null) {
                if (focusAnim === 0) {
                  slideOutAnim(obatAnim);
                  fadeOutAnim(obatAnimOp);
                } else if (focusAnim === 1) {
                  slideOutAnim(stockAnim);
                  fadeOutAnim(stockAnimOp);
                } else if (focusAnim === 2) {
                  slideOutAnim(pembelianAnim);
                  fadeOutAnim(pembelianAnimOp);
                }
              }

              setFocusAnim(null);
              props.navigation.navigate("Pabrikan");
            }}
          />
        </View>
        {/* Pabrikan Drawer End */}

        {/* Pembelian Drawer */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 6,
              height: 40,
              backgroundColor:
                focusScreen === 6 || focusScreen === 7 ? "#2FA33B" : "white",
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
            }}
          />

          <DrawerItem
            label="Pembelian"
            icon={() => {
              if (focusScreen === 6 || focusScreen === 7) {
                return (
                  <Image
                    source={require("../assets/images/pembelianActive.png")}
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                  />
                );
              } else {
                return (
                  <Image
                    source={require("../assets/images/pembelianInactive.png")}
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                  />
                );
              }
            }}
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color:
                focusScreen === 6 || focusScreen === 7 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeBackgroundColor="white"
            inactiveBackgroundColor="white"
            style={{ flex: 1 }}
            onPress={() => {
              if (focusAnim === null) {
                slideInAnim(pembelianAnim);
                fadeInAnim(pembelianAnimOp);
                setFocusAnim(2);
              } else {
                if (focusAnim === 0) {
                  slideOutAnim(obatAnim);
                  fadeOutAnim(obatAnimOp);
                  slideInAnim(pembelianAnim);
                  fadeInAnim(pembelianAnimOp);
                  setFocusAnim(2);
                } else if (focusAnim === 1) {
                  slideOutAnim(stockAnim);
                  fadeOutAnim(stockAnimOp);
                  slideInAnim(pembelianAnim);
                  fadeInAnim(pembelianAnimOp);
                  setFocusAnim(2);
                } else if (focusAnim === 2) {
                  slideOutAnim(pembelianAnim);
                  fadeOutAnim(pembelianAnimOp);
                  setFocusAnim(null);
                }
              }
            }}
          />

          {focusScreen === 6 || focusScreen === 7 ? (
            <Image
              source={require("../assets/images/plusActive.png")}
              style={{
                marginRight: 34,
                width: 24,
                height: 24,
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={require("../assets/images/plusInactive.png")}
              style={{
                marginRight: 34,
                width: 24,
                height: 24,
                resizeMode: "contain",
              }}
            />
          )}
        </View>

        {/* Dropdown Pembelian */}
        <Animated.View
          style={{ height: pembelianAnim, opacity: pembelianAnimOp }}
        >
          <DrawerItem
            label="Pembelian Baru"
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color: focusScreen === 6 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeBackgroundColor="white"
            inactiveBackgroundColor="white"
            onPress={() => {
              setFocusScreen(6);
              props.navigation.navigate("PembelianAdd");
            }}
            style={{ marginLeft: 105 }}
          />

          <DrawerItem
            label="Kelola Pembelian"
            labelStyle={{
              fontFamily: "Poppins-Medium",
              fontSize: 18,
              color: focusScreen === 7 ? "#2FA33B" : "#7E7E7E",
              includeFontPadding: false,
            }}
            activeTintColor="white"
            inactiveTintColor="white"
            activeBackgroundColor="transparent"
            inactiveBackgroundColor="transparent"
            onPress={() => {
              setFocusScreen(7);
              props.navigation.navigate("PembelianKelola");
            }}
            style={{
              marginLeft: 105,
            }}
          />
        </Animated.View>
        {/* Dropdown Pembelian End */}
        {/* Pembelian Drawer End */}
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;
