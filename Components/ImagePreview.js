import React from "react";
import { Image, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const ImagePreview = ({ uri }) => {
  return (
    <Card style={styles.card}>
      <Image source={{ uri }} style={styles.image} />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
});

export default ImagePreview;