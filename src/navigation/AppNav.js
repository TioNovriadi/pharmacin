import { View, Text } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../utils/context/AuthContext";
import LoadingScreen from "../component/LoadingScreen";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "../router/AuthStack";
import PaketStack from "../router/PaketStack";
import AppStack from "../router/AppStack";

const AppNav = () => {
  const { isLoading, userToken, paketLanggananId } = useContext(AuthContext);

  const config = {
    screens: {
      Login: "login",
      Register: "register",
      Dashboard: {
        screens: {
          DashboardHome: "dashboard",
        },
      },
      ObatKategori: "obat/kategori",
      ObatKelola: {
        screens: {
          ObatKelolaHome: "obat",
          ObatAdd: "obat/add",
        },
      },
      StockObat: "stock",
      StockPerBatch: "stock/batch",
      Pabrikan: "pabrik",
      PembelianAdd: "pembelian/add",
      PembelianKelola: {
        screens: {
          PembelianKelolaHome: "pembelian",
          PembelianRincian: "pembelian/invoice",
        },
      },
      PaketLangganan: "paket-langganan",
    },
  };

  const linking = {
    config,
  };

  if (isLoading === true) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      {userToken === null ? (
        <AuthStack />
      ) : paketLanggananId === null ? (
        <PaketStack />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

export default AppNav;
