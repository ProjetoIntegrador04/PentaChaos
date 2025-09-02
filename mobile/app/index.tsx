import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = () => {
    Keyboard.dismiss();
    router.push("/home");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag" 
      >
        
        <LinearGradient colors={["#1d64b5", "#2a77d4"]} style={styles.header}>
          <Text style={styles.ola}>Olá,</Text>
          <Text style={styles.bemVindo}>Bem vindo a</Text>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.desc}>
            2RP net | Monitoramento, onde o gerenciamento, acompanhamento e
            organização são possíveis.
          </Text>
        </LinearGradient>

      
        <Text style={styles.title}>Entre na sua conta agora!</Text>

       
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#9aa3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputSenha}>
          <TextInput
            style={{ flex: 1, color: '#000' }} 
            placeholder="Digite sua senha"
            placeholderTextColor="#9aa3af"
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Ionicons
              name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9aa3af"
            />
          </TouchableOpacity>
        </View>

        
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.checkbox, lembrar ? styles.checkboxChecked : null]}
            onPress={() => setLembrar(!lembrar)}
          >
            {lembrar && <Ionicons name="checkmark" size={16} color="#fff" />}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>Lembrar-me</Text>

          <TouchableOpacity style={{ marginLeft: "auto" }}>
            <Text style={styles.link}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>

       
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

      
        <TouchableOpacity>
          <Text style={styles.linkSaber}>Saber mais</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: "#fff", 
    paddingHorizontal: 20,
    paddingBottom: 40, 
  },
  header: {
    alignItems: "center",
    paddingTop: 60, 
    paddingBottom: 20,
    marginHorizontal: -20, 
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  ola: { color: "#fff", fontSize: 18, fontWeight: "400" },
  bemVindo: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 1 },
  logo: { width: 250, height: 50, marginVertical: 8 },
  desc: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 250,
    lineHeight: 16,
  },
  title: {
    fontSize: 20,
    color: "#2a77d4",
    fontWeight: "bold",
    marginTop: 30, 
    marginBottom: 15,
    textAlign: "center",
  },
  label: { color: "#2a77d4", marginBottom: 5, marginTop: 10 },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12, 
    fontSize: 14,
    color: '#000', 
  },
  inputSenha: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,  
  },
  row: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2a77d4",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2a77d4",
  },
  checkboxText: { marginLeft: 8, color: "#333" },
  link: { color: "#2a77d4", fontSize: 12, textDecorationLine: "underline" },
  button: {
    backgroundColor: "#2a77d4",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  linkSaber: { color: "#2a77d4", fontSize: 14, textAlign: "center", marginTop: 30 },
});