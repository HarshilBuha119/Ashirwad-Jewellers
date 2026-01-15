import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet, Image } from "react-native";
import FastImage from "@d11/react-native-fast-image";

function normalizeSource(src) {

  if (!src) return null;

  // local require -> number

  if (typeof src === "number") {

    const resolved = Image.resolveAssetSource(src);

    return { uri: resolved?.uri };

  }

  // already { uri: '...' } or string

  if (typeof src === "string") return { uri: src };

  return src;

}

export default function AppImage({
  source,
  style,
  resizeMode = FastImage.resizeMode.cover,
}) {
  const [loading, setLoading] = useState(false); // Start with false
  const fastSource = normalizeSource(source);

  // If source is null, don't show a loader at all
  if (!fastSource?.uri) return <View style={[style, { backgroundColor: '#EEE' }]} />;

  return (
    <View style={[styles.container, style]}>
      {/* 1. Use style on container to ensure loader is centered correctly */}

      {loading && (
        <ActivityIndicator style={styles.loader} size="small" color="#999" />
      )}

      <FastImage
        source={fastSource}
        style={style}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)} // 2. Specifically use onLoad
        onLoadEnd={() => setLoading(false)} // 3. Backup trigger
        onError={() => setLoading(false)} // 4. CRITICAL: Hide if it fails
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  loader: {
    position: "absolute",
    zIndex: 1,
  },
});