import PHButton from "@/src/components/PHButtons";
import PHTextBox from "@/src/components/PHTextBox";
import { PHColors } from "@/src/constants/PHColors";
import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>Login</Text>
      <PHTextBox
        value={email}
        placeholder="Email"
        placeholderColor=""
        onChangeText={setEmail}
        limitTextQuantity={320}
        extraStyle={{ marginVertical: 5 }}
      />
      <PHTextBox
        value={password}
        placeholder="Senha"
        placeholderColor=""
        onChangeText={setPassword}
        secret={true}
        limitTextQuantity={20}
        extraStyle={{ marginVertical: 5 }}
      />
      <PHButton
        text="Entrar"
        size={{ width: 100, height: 50 }}
        onPressed={() => {
          console.log("Tentando entrar...");
        }}
      />
      <PHButton
        text="Cadastrar"
        size={{ width: 100, height: 50 }}
        onPressed={() => {
          console.log("Tentando entrar...");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PHColors.background,
  },
  title: {
    color: PHColors.text,
    fontSize: 50,
    marginBottom: 10,
  },
});
