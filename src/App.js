import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { mockedData } from "./data";
import Carousel from "./components/carousel";

export default function App() {
  const formatData = mockedData.map((item) => {
    return {
      title: item.title,
      image: item.images[Math.floor(Math.random() * item.images.length)],
    };
  });
  return (
    <View>
      <Carousel data={formatData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
