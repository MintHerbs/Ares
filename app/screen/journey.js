import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { addSpot } from "../storage/savedSpots";

const GEOAPIFY_API_KEY = "0aac63c6c95743b387bed05ed1f9a538";
const OPENAI_API_KEY = "sk-...CukA";

const categoryToType = (cat) => {
  if (!cat) return "pin";
  if (cat.includes("restaurant") || cat.includes("catering")) return "restaurant";
  if (cat.includes("fast_food")) return "restaurant";
  if (cat.includes("accommodation")) return "home";
  if (cat.includes("tourism") || cat.includes("entertainment")) return "entertainment";
  if (cat.includes("commercial.supermarket")) return "shopping";
  return "pin";
};

export default function NearbyPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("tourism");
  const [locationName, setLocationName] = useState(null);
  const [openHoursExpandedId, setOpenHoursExpandedId] = useState(null);

  const radius = 5000;

  useEffect(() => {
    fetchLocationAndPlaces();
  }, [category]);

  const getPlaceDescription = async (placeName) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a travel guide giving concise tourist descriptions." },
            { role: "user", content: `Write a short, 2-sentence tourist description of "${placeName}".` },
          ],
          max_tokens: 60,
        }),
      });

      const data = await response.json();
      if (data.error) {
        console.error("OpenAI API error:", data.error.message);
        return "Description unavailable.";
      }

      return data.choices?.[0]?.message?.content?.trim() || "Description unavailable.";
    } catch (error) {
      console.error("Fetch error:", error);
      return "Description unavailable.";
    }
  };

  const fetchLocationAndPlaces = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to fetch nearby places.");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const geoUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      if (geoData.features && geoData.features.length > 0) {
        const placeName =
          geoData.features[0].properties.city ||
          geoData.features[0].properties.county ||
          geoData.features[0].properties.state ||
          geoData.features[0].properties.country ||
          "your location";
        setLocationName(placeName);
      } else {
        setLocationName("your location");
      }

      const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${longitude},${latitude},${radius}&bias=proximity:${longitude},${latitude}&limit=2&apiKey=${GEOAPIFY_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        let filteredPlaces = data.features.filter(
          (place) => place.properties.name && place.properties.name.trim() !== ""
        );

        if (["tourism", "entertainment"].includes(category)) {
          filteredPlaces = await Promise.all(
            filteredPlaces.map(async (place) => {
              const desc = await getPlaceDescription(place.properties.name);
              return {
                ...place,
                properties: { ...place.properties, gptDescription: desc },
              };
            })
          );
        }

        setPlaces(filteredPlaces);
      } else {
        setPlaces([]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch nearby places.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (meters) => {
    if (!meters) return "Unknown distance";
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km away` : `${meters} m away`;
  };

  const openMaps = (lat, lon) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Unable to open maps."));
  };

  const isOpenNow = (opening_hours) => {
    if (!opening_hours) return null;
    try {
      const now = new Date();
      const day = now.toLocaleString("en-US", { weekday: "short" });
      const timeMinutes = now.getHours() * 60 + now.getMinutes();
      const segments = opening_hours.split(";").map((seg) => seg.trim());

      for (const segment of segments) {
        const [daysPart, hoursPart] = segment.split(" ");
        if (!daysPart || !hoursPart) continue;

        const dayMap = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        let matchDay = false;

        if (daysPart.includes("-")) {
          const [startDay, endDay] = daysPart.split("-");
          const startIndex = dayMap.indexOf(startDay);
          const endIndex = dayMap.indexOf(endDay);
          const todayIndex = dayMap.indexOf(day);
          if (todayIndex >= startIndex && todayIndex <= endIndex) matchDay = true;
        } else {
          const days = daysPart.split(",");
          if (days.includes(day)) matchDay = true;
        }

        if (matchDay) {
          const [startTime, endTime] = hoursPart.split("-");
          if (!startTime || !endTime) continue;

          const [sh, sm] = startTime.split(":").map(Number);
          const [eh, em] = endTime.split(":").map(Number);

          const startMinutes = sh * 60 + sm;
          const endMinutes = eh * 60 + em;

          if (timeMinutes >= startMinutes && timeMinutes <= endMinutes) {
            return true;
          } else {
            return false;
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const renderPlace = ({ item }) => {
    const props = item.properties;
    const coords = item.geometry?.coordinates || [];
    const [lon, lat] = coords;

    const isOpen = isOpenNow(props.opening_hours);
    const isExpanded = openHoursExpandedId === item.id;

    return (
      <View style={styles.itemWrapper}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>
            {props.name} is located at{" "}
            {props.address_line2 && props.address_line2.trim() !== "" ? props.address_line2 : "Address not available"}.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            {props.thumbnail && (
              <Image source={{ uri: props.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
            )}

            <Text style={styles.cardTitle}>{props.name}</Text>

            {props.gptDescription && (
              <Text style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>{props.gptDescription}</Text>
            )}

            <Text style={styles.distance}>{formatDistance(props.distance)}</Text>

            {props.opening_hours && (
              <>
                <TouchableOpacity
                  onPress={() => setOpenHoursExpandedId(isExpanded ? null : item.id)}
                  style={styles.openNowRow}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          isOpen === true ? "#4CAF50" : isOpen === false ? "#B71C1C" : "#999",
                      },
                    ]}
                  />
                  <Text style={styles.openNowText}>
                    {isOpen === true ? "Open Now" : isOpen === false ? "Closed Now" : "Hours Available"}
                  </Text>
                  <Text style={styles.expandToggle}>{isExpanded ? "▲" : "▼"}</Text>
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.openingHoursBox}>
                    <Text style={styles.openingHoursText}>{props.opening_hours}</Text>
                  </View>
                )}
              </>
            )}

            {props.website && (
              <TouchableOpacity onPress={() => Linking.openURL(props.website)} style={styles.linkButton} activeOpacity={0.7}>
                <Text style={styles.linkText}>Website</Text>
              </TouchableOpacity>
            )}

            {props.wikipedia && (
              <TouchableOpacity
                onPress={() => Linking.openURL(props.wikipedia)}
                style={styles.linkButton}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText}>Wikipedia</Text>
              </TouchableOpacity>
            )}

            {lat && lon && (
              <TouchableOpacity style={styles.button} onPress={() => openMaps(lat, lon)} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Show on map</Text>
              </TouchableOpacity>
            )}

            {/* New Add to Itinerary button */}
            <TouchableOpacity
              style={styles.itineraryButton}
              onPress={async () => {
                try {
                  // Geoapify coordinates are [lon, lat]
                  const coords = item.geometry?.coordinates || [];
                  const [lon, lat] = coords;

                  // pick a stable id (prefer Geoapify's place_id if present)
                  const id =
                    (item.properties && item.properties.place_id) ||
                    item.id ||
                    `${lat},${lon}`;

                  await addSpot({
                    id: String(id),
                    name: item.properties?.name || 'Unnamed',
                    lat,                 // latitude
                    lng: lon,            // longitude (note: "lng" not "lon")
                    type: categoryToType(category),
                  });

                  Alert.alert('Added!', `${item.properties?.name} saved to itinerary.`);
                } catch (e) {
                  console.error(e);
                  Alert.alert('Error', 'Could not save this spot.');
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.itineraryButtonText}>Add to Itinerary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore</Text>
      <Text style={styles.locationText}>You are currently at {locationName || "your location"}</Text>
      <Text style={styles.subHeader}>Nearby places near you are:</Text>

      <Picker selectedValue={category} style={styles.picker} onValueChange={(itemValue) => setCategory(itemValue)}>
        <Picker.Item label="Supermarket" value="commercial.supermarket" />
        <Picker.Item label="Restaurant" value="catering.restaurant" />
        <Picker.Item label="Fast Foods" value="catering.fast_food" />
        <Picker.Item label="Accommodation" value="accommodation" />
        <Picker.Item label="Childcare" value="childcare" />
        <Picker.Item label="Entertainment" value="entertainment" />
        <Picker.Item label="Pet" value="pet" />
        <Picker.Item label="Rental" value="rental" />
        <Picker.Item label="Attractions" value="tourism" />
        <Picker.Item label="Beach" value="beach" />
        <Picker.Item label="Cultural Sites" value="religion" />
        <Picker.Item label="Sport" value="sport" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#b61d1d" style={styles.loadingIndicator} />
      ) : places.length > 0 ? (
        <FlatList
          data={places}
          keyExtractor={(item, index) => item.id || `${item.properties.lat}-${item.properties.lon}-${index}`}
          renderItem={renderPlace}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      ) : (
        <Text style={styles.noPlacesText}>No nearby places found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#f5f0f0",
  },
  header: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
    color: "#7b1f1f",
    letterSpacing: 1,
    fontFamily: "sans-serif-condensed",
  },
  locationText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#4a2c2c",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 18,
    color: "#6b3a3a",
    letterSpacing: 0.3,
  },
  picker: {
    height: 55,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#7b1f1f",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemWrapper: {
    marginBottom: 28,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: "#b61d1d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  bubble: {
    backgroundColor: "#b66464",
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
    maxWidth: "100%",
    alignSelf: "flex-start",
    shadowColor: "#8c3b3b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  bubbleText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    fontFamily: "sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
  },
  cardContent: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    color: "#7b1f1f",
  },
  distance: {
    fontSize: 15,
    color: "#4d4d4d",
    marginBottom: 14,
    fontWeight: "600",
  },
  openNowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  openNowText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4a4a4a",
    flex: 1,
  },
  expandToggle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7b1f1f",
  },
  openingHoursBox: {
    backgroundColor: "#f7eaea",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  openingHoursText: {
    fontSize: 14,
    color: "#7b1f1f",
    fontWeight: "500",
  },
  linkButton: {
    backgroundColor: "#7b1f1f",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  linkText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#7b1f1f",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#4a0000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  itineraryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#4a7c59", // greenish
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#003300",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  itineraryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  loadingIndicator: {
    marginTop: 40,
  },
  noPlacesText: {
    fontSize: 16,
    color: "#a36b6b",
    textAlign: "center",
    marginTop: 40,
    fontStyle: "italic",
  },
});
