import React, { useState, useEffect } from "react";
import { View,Text,TextInput,StyleSheet,Image,ActivityIndicator,TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";

export default function CurrencyConvertor() {
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("JPY");

  const API_KEY = "c936649c69c25ffee46e1fe5";

  
  const currencyToCountry = {
    USD: "US",
    GBP: "GB",
    JPY: "JP",
    EUR: "EU", 
    MUR: "MU",
    INR: "IN",
    CAD: "CA",
  };

  
  const countryToCurrency = {
    US: "USD",
    GB: "GBP",
    JP: "JPY",
    EU: "EUR",
    CA: "CAD",
    IN: "INR",
    MU: "MUR",
  };


  const detectCurrency = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied for location");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const geocodeRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const geoData = await geocodeRes.json();
    const countryCode = geoData.countryCode;

    const detectedCurrency = countryToCurrency[countryCode] || "USD";
    setFromCurrency(detectedCurrency);
  };

  useEffect(() => {
    detectCurrency();
  }, []);

  // Currency conversion logic
  const convertCurrency = async () => {
    if (!amount || isNaN(amount)) {
      setConverted("Please enter a valid number");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`
      );

      const data = await response.json();

      if (data.result === "success") {
        const rate = data.conversion_rates[toCurrency];
        if (!rate) {
          setConverted("Currency not supported");
        } else {
          const result = (parseFloat(amount) * rate).toFixed(2);
          setConverted(`${result} ${toCurrency}`);
        }
      } else {
        setConverted("Error: " + data["error-type"]);
      }
    } catch (error) {
      setConverted("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get flag URL
  const getFlagUrl = (currency) => {
    const countryCode = currencyToCountry[currency] || "US";
    return `https://flagsapi.com/${countryCode}/flat/64.png`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        {/* Dynamic flag as logo */}
        <Image
          source={{ uri: getFlagUrl(fromCurrency) }}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Currency Converter</Text>
      <Text style={styles.subtitle}>
        Check live rates, set rate alerts, receive notifications and more.
      </Text>

      {/* Card */}
      <View style={styles.card}>
        {/* From Currency */}
        <Text style={styles.label}>Amount</Text>
        <View style={styles.row}>
          <View style={styles.flagRow}>
            <Image source={{ uri: getFlagUrl(fromCurrency) }} style={styles.flag} />
            <Picker
              selectedValue={fromCurrency}
              style={styles.picker}
              onValueChange={(itemValue) => setFromCurrency(itemValue)}
            >
              <Picker.Item label="USD" value="USD" />
              <Picker.Item label="GBP" value="GBP" />
              <Picker.Item label="JPY" value="JPY" />
              <Picker.Item label="EUR" value="EUR" />
              <Picker.Item label="MUR" value="MUR" />
              <Picker.Item label="INR" value="INR" />
              <Picker.Item label="CAD" value="CAD" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />
        </View>

        <View style={styles.separator} />

        {/* To Currency */}
        <Text style={styles.label}>Converted Amount</Text>
        <View style={styles.row}>
          <View style={styles.flagRow}>
            <Image source={{ uri: getFlagUrl(toCurrency) }} style={styles.flag} />
            <Picker
              selectedValue={toCurrency}
              style={styles.picker}
              onValueChange={(itemValue) => setToCurrency(itemValue)}
            >
              <Picker.Item label="USD" value="USD" />
              <Picker.Item label="GBP" value="GBP" />
              <Picker.Item label="JPY" value="JPY" />
              <Picker.Item label="EUR" value="EUR" />
              <Picker.Item label="MUR" value="MUR" />
              <Picker.Item label="INR" value="INR" />
              <Picker.Item label="CAD" value="CAD" />
            </Picker>
          </View>
          <TextInput style={styles.input} value={converted || "0.00"} editable={false} />
        </View>
      </View>

      {/* Convert Button */}
      <TouchableOpacity style={styles.convertBtn} onPress={convertCurrency}>
        <Text style={styles.convertText}>Convert</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDE8",
    alignItems: "center",
    paddingTop: 50,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
  },
  backBtn: {
    position: "absolute",
    left: 20,
  },
  backArrow: {
    fontSize: 24,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
    width: "80%",
  },
  card: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  flagRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
  },
  picker: {
    width: 80,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 8,
    borderRadius: 2,
  },
  input: {
    flex: 1,
    textAlign: "right",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  separator: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 8,
  },
  convertBtn: {
    marginTop: 30,
    backgroundColor: "#b61d1d",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  convertText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
                        