import { View, Text } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import { API_ACCESS } from "../config/Endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import toast from "../helper/Toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [paketLanggananId, setPaketLanggananId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [kasirStatus, setKasirStatus] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);

    await fetch(API_ACCESS.login, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === "Login berhasil!") {
          setUserToken(json.token);
          setUserId(json.userId);
          setPaketLanggananId(json.paketLanggananId);
          setKasirStatus(false);
          AsyncStorage.setItem("userToken", json.token);
          AsyncStorage.setItem("userId", JSON.stringify(json.userId));
          AsyncStorage.setItem("kasirStatus", JSON.stringify(false));
          if (json.paketLanggananId) {
            AsyncStorage.setItem(
              "paketLanggananId",
              JSON.stringify(json.paketLanggananId)
            );
          }
          toast.success({ message: json.message });
        } else {
          if (json.responseText) {
            toast.danger({ message: "Email atau Password salah!" });
          } else {
            toast.danger({ message: json.messages.errors[0].message });
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

  const logout = () => {
    setIsLoading(true);

    setUserToken(null);
    setUserId(null);
    setKasirStatus(null);
    AsyncStorage.removeItem("userToken");
    AsyncStorage.removeItem("userId");
    AsyncStorage.removeItem("kasirStatus");
    if (paketLanggananId !== null) {
      setPaketLanggananId(null);
      AsyncStorage.removeItem("paketLanggananId");
    }
    toast.success({ message: "Logout berhasil!" });

    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);

      let userToken = await AsyncStorage.getItem("userToken");
      let userId = await AsyncStorage.getItem("userId");
      let paketLanggananId = await AsyncStorage.getItem("paketLanggananId");
      let kasirStatus = await AsyncStorage.getItem("kasirStatus");

      if (userId) {
        setUserToken(userToken);
        setUserId(JSON.parse(userId));
        setKasirStatus(JSON.parse(kasirStatus));
        if (paketLanggananId) {
          setPaketLanggananId(JSON.parse(paketLanggananId));
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        userToken,
        userId,
        paketLanggananId,
        setPaketLanggananId,
        isLoading,
        kasirStatus,
        setKasirStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
