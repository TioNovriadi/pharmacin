import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DashboardHome from "../pages/app/dashboard/DashboardHome";
import CustomDrawer from "../component/CustomDrawer";
import ObatKategori from "../pages/app/obat/ObatKategori";
import ObatKelola from "../pages/app/obat/ObatKelola";
import StockObat from "../pages/app/stock/StockObat";
import StockPerBatch from "../pages/app/stock/StockPerBatch";
import PabrikanHome from "../pages/app/pabrikan/PabrikanHome";
import PabrikanAdd from "../pages/app/pabrikan/PabrikanAdd";
import ObatAdd from "../pages/app/obat/ObatAdd";
import PembelianAdd from "../pages/app/pembelian/PembelianAdd";
import PembelianKelola from "../pages/app/pembelian/PembelianKelola";
import PembelianRincian from "../pages/app/pembelian/PembelianRincian";
import PabrikanRincian from "../pages/app/pabrikan/PabrikanRincian";
import PenjualanAdd from "../pages/app/penjualan/PenjualanAdd";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AppStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="ObatKategori"
        component={ObatKategori}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="ObatKelola"
        component={ObatKelolaStack}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="StockObat"
        component={StockObat}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="StockPerBatch"
        component={StockPerBatch}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="Pabrikan"
        component={PabrikanStack}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="PembelianAdd"
        component={PembelianAdd}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="PembelianKelola"
        component={PembelianKelolaStack}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="PenjualanAdd"
        component={PenjualanAdd}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
    </Drawer.Navigator>
  );
};

const DashboardStack = () => {
  return (
    <Stack.Navigator initialRouteName="DashboardHome">
      <Stack.Screen
        name="DashboardHome"
        component={DashboardHome}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const PabrikanStack = () => {
  return (
    <Stack.Navigator initialRouteName="PabrikanHome">
      <Stack.Screen
        name="PabrikanHome"
        component={PabrikanHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PabrikanAdd"
        component={PabrikanAdd}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PabrikanRincian"
        component={PabrikanRincian}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ObatKelolaStack = () => {
  return (
    <Stack.Navigator initialRouteName="ObatKelolaHome">
      <Stack.Screen
        name="ObatKelolaHome"
        component={ObatKelola}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ObatAdd"
        component={ObatAdd}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const PembelianKelolaStack = () => {
  return (
    <Stack.Navigator initialRouteName="PembelianKelolaHome">
      <Stack.Screen
        name="PembelianKelolaHome"
        component={PembelianKelola}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PembelianRincian"
        component={PembelianRincian}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
