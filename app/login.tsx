import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { ParamListBase, NavigationProp, useIsFocused } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";

import CustomTextInput from "@components/Shared/CustomTextInput";
import CustomPasswordInput from "@components/Shared/CustomPasswordInput";
import { useSession } from "@context/UserContext";
import { loginUser } from "@db/users";
import ButtonNavigate from "@components/LoginRegister/ButtonNavigate";
import ButtonLogin from "@components/LoginRegister/ButtonLogin";
import { User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HelpModal from "@components/Modals/HelpModal";
import { useTheme } from "@context/ThemeContext";
import { useHabits } from "@context/HabitsContext";
import { useTranslation } from "react-i18next";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { useNavigation } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@db/index";

// Import pour Apple Sign In
import * as AppleAuthentication from "expo-apple-authentication";

export default function Login() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const passwordInputRef = useRef(null);
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { user, isLoading } = useSession();
  const { refreshHabits } = useHabits();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [loadingLogin, setLoadingLogin] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
  }, []);

  // Fonction Sign in with Google (votre implémentation existante)
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signIn();

      const { idToken } = await GoogleSignin.getTokens();
      const googleCredential = GoogleAuthProvider.credential(idToken);

      const auth = getAuth();
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      const membersCollectionRef = collection(db, "members");

      try {
        await addDoc(membersCollectionRef, {
          uid: user.uid,
          habits: [],
          nom: user.displayName,
        });
      } catch (error) {
        if (error instanceof Error)
          throw new Error("Failed to add user data to Firestore: " + error.message);
      }

      try {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("isAuthenticated", "true");
        await AsyncStorage.setItem("lastFetchDate", "0");
      } catch (error) {
        if (error instanceof Error)
          throw new Error(
            "Failed to save user data to AsyncStorage: " + String(error.message)
          );
      }

      navigation.navigate("(navbar)");
    } catch (error) {
      console.log("Erreur Google Signin:", error);
    }
  };

  // Implémentation du Sign in with Apple
  const signInWithApple = async () => {
    try {
      // Vérifier que la plateforme est iOS
      if (Platform.OS !== "ios") {
        console.log("Apple Sign-In n'est disponible que sur iOS.");
        return;
      }

      // Lancer la connexion avec Apple
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Vérifier la présence du token d'identité
      if (!appleCredential.identityToken) {
        throw new Error("Apple Sign-In a échoué : aucun token d'identité retourné.");
      }

      // Créer le credential Firebase à partir du token retourné par Apple
      const provider = new OAuthProvider("apple.com");
      const firebaseCredential = provider.credential({
        idToken: appleCredential.identityToken,
      });

      const auth = getAuth();
      const userCredential = await signInWithCredential(auth, firebaseCredential);
      const user = userCredential.user;

      // Ajout de l'utilisateur à Firestore (similaire à Google)
      const membersCollectionRef = collection(db, "members");

      try {
        await addDoc(membersCollectionRef, {
          uid: user.uid,
          habits: [],
          // Lors de la première connexion, Apple fournit le nom complet et l'email
          nom:
            user.displayName ||
            (appleCredential.fullName?.givenName ? appleCredential.fullName.givenName : "Utilisateur Apple"),
        });
      } catch (error) {
        if (error instanceof Error)
          throw new Error("Erreur lors de l'ajout de l'utilisateur à Firestore: " + error.message);
      }

      // Sauvegarder les informations utilisateur en AsyncStorage
      try {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("isAuthenticated", "true");
        await AsyncStorage.setItem("lastFetchDate", "0");
      } catch (error) {
        if (error instanceof Error)
          throw new Error(
            "Erreur lors de la sauvegarde des données utilisateur en AsyncStorage: " + error.message
          );
      }

      navigation.navigate("(navbar)");
    } catch (error) {
      console.log("Erreur Apple Sign-In:", error);
      setError("Erreur lors de la connexion avec Apple.");
    }
  };

  useEffect(() => {
    return navigation.addListener("beforeRemove", (e: any) => {
      if (!user) {
        e.preventDefault();
      }
    });
  }, [navigation, user]);

  useEffect(() => {
    if (!isLoading && user) {
      navigation.navigate("(navbar)");
    }
  }, [isLoading, user, navigation]);

  useEffect(() => {
    if (!isFocused) {
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [isFocused]);

  const login = async () => {
    try {
      setLoadingLogin(true);
      const snapshot: User | { error: string } = await loginUser(email, password);

      if ("error" in snapshot) {
        setError(snapshot.error);
        return;
      } else {
        refreshHabits(true);
      }
    } catch (error) {
      setError("Erreur lors de la connexion.");
    } finally {
      setLoadingLogin(false);
    }
  };

  const isDisabled = email === "" || password === "";

  useEffect(() => {
    const checkFirstTime = async () => {
      const firstTime = await AsyncStorage.getItem("firstTime");
      if (!firstTime || firstTime === "true") {
        setShowModal(true);
        await AsyncStorage.setItem("firstTime", "false");
      }
    };

    checkFirstTime();
  }, []);

  if (showModal) {
    return (
      <HelpModal
        visible={showModal}
        setVisible={setShowModal}
        onClose={() => setShowModal(false)}
      />
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ backgroundColor: theme.colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("@assets/images/onboarding/login.png")}
        style={{
          width: Dimensions.get("window").width,
          height: 300,
        }}
        className="flex flex-col justify-center items-start p-5"
      >
        <Text
          style={{
            color: "white",
            fontSize: 32,
            fontWeight: "bold",
          }}
          className="mb-2"
        >
          {t("sign_in_to_your_account")}
        </Text>
        <Text
          style={{
            color: "#f1f1f1",
          }}
          className=" w-10/12"
        >
          {t("sign_in_to_your_account_description")}
        </Text>
      </ImageBackground>

      <View className="flex flex-col items-center w-full py-3 rounded-xl lg:w-2/3 mx-auto">
        <View className="flex flex-col justify-center items-start w-11/12  mt-3">
          <CustomTextInput
            label={t("email")}
            placeholder="melios@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={() =>
              passwordInputRef.current && (passwordInputRef.current as any).focus()
            }
            returnKeyType="next"
          />
          <CustomPasswordInput
            ref={passwordInputRef}
            onChangeText={setPassword}
            label={t("password")}
            placeholder="********"
            value={password}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            secureTextEntry={!showPassword}
            onSubmitEditing={login}
            returnKeyType="done"
          />
          <TouchableOpacity className="flex flex-row items-end justify-end w-full">
            <Text
              style={{
                color: theme.colors.primary,
              }}
              className="mt-4 mx-2 font-bold text-end"
              onPress={() => navigation.navigate("resetPassword")}
            >
              {t("forget_password_question")}
            </Text>
          </TouchableOpacity>
        </View>

        <Pressable
          disabled={isDisabled}
          onPress={login}
          style={{
            backgroundColor: isDisabled
              ? theme.colors.grayPrimary
              : theme.colors.primary,
          }}
          className="w-11/12 mx-auto py-4 rounded-xl focus:bg-blue-800 mt-6 flex items-center"
        >
          {loadingLogin ? (
            <ActivityIndicator size="small" color={"#F8F9FF"} />
          ) : (
            <Text
              style={{ color: "#F8F9FF" }}
              className="text-[18px] text-center font-semibold"
            >
              {t("login_bis")}
            </Text>
          )}
        </Pressable>

        <View className="flex flex-row items-center justify-center w-full py-8">
          <View
            className="h-0.5 w-1/3"
            style={{ backgroundColor: theme.colors.border }}
          />
          <Text className="mx-2" style={{ color: theme.colors.textTertiary }}>
            {t("or")}
          </Text>
          <View
            className="h-0.5 w-1/3"
            style={{ backgroundColor: theme.colors.border }}
          />
        </View>

        <View
          className="mx-auto rounded-2xl my-3 p-3 flex flex-row items-center w-11/12"
          style={{
            backgroundColor: theme.colors.redSecondary,
            display: error === "" ? "none" : "flex",
          }}
        >
          <Iconify
            icon="material-symbols:error"
            color={theme.colors.redPrimary}
            size={20}
          />
          <Text
            style={{
              color: theme.colors.redPrimary,
            }}
            className="ml-2"
          >
            {error}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={signInWithGoogle}
        className="py-4 rounded-xl mt-3 items-center justify-center flex flex-row w-11/12 lg:w-2/3 mx-auto gap-4"
        style={{
          borderColor: theme.colors.border,
          borderWidth: 1,
        }}
      >
        <Iconify icon="devicon:google" color={theme.colors.text} size={20} />
        <Text
          style={{ color: theme.colors.text }}
          className=" text-center font-semibold"
        >
          {t("sign_in_with_google")}
        </Text>
      </Pressable>

      {/* Bouton Sign in with Apple uniquement sur iOS */}
      {Platform.OS === "ios" && (
        <Pressable
          onPress={signInWithApple}
          className="py-4 rounded-xl mt-3 items-center justify-center flex flex-row w-11/12 lg:w-2/3 mx-auto gap-4"
          style={{
            borderColor: theme.colors.border,
            borderWidth: 1,
          }}
        >
          <Iconify icon="ic:baseline-apple" color={theme.colors.text} size={20} />
          <Text
            style={{ color: theme.colors.text }}
            className=" text-center font-semibold"
          >
            {t("sign_in_with_apple")}
          </Text>
        </Pressable>
      )}

      <ButtonNavigate
        text={t("no_account")}
        text2={t("register")}
        onPress={() => navigation.navigate("register")}
      />
    </ScrollView>
  );
}
