import React, { useRef, useEffect, useMemo } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import AppImage from "./AppImage";

const { width } = Dimensions.get("window");

// ===== CONFIG =====
const ITEM_WIDTH = width * 0.55;
const ITEM_SPACING = 8;
const PERSPECTIVE = 1200;
// ==================

export default function Slider({ data = [] }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);

  const ITEM_SIZE = ITEM_WIDTH + ITEM_SPACING;

  // 🔁 duplicate data for infinite loop
  const loopData = useMemo(
    () => [...data, ...data, ...data],
    [data]
  );

  const middleIndex = data.length;
  const initialOffset = middleIndex * ITEM_SIZE;

  // 🔁 normalized scroll for dots
  const normalizedScrollX = Animated.subtract(
    scrollX,
    initialOffset
  );

  // jump to middle copy on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: initialOffset,
        animated: false,
      });
    });
  }, [initialOffset]);

  // keep scroll inside middle copy
  const handleMomentumEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_SIZE);

    if (index <= data.length - 1) {
      const newOffset = (index + data.length) * ITEM_SIZE;
      listRef.current?.scrollToOffset({
        offset: newOffset,
        animated: false,
      });
      scrollX.setValue(newOffset);
    }

    if (index >= data.length * 2) {
      const newOffset = (index - data.length) * ITEM_SIZE;
      listRef.current?.scrollToOffset({
        offset: newOffset,
        animated: false,
      });
      scrollX.setValue(newOffset);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef}
        data={loopData}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        bounces={false}
        onMomentumScrollEnd={handleMomentumEnd}
        contentContainerStyle={{
          paddingHorizontal: (width - ITEM_WIDTH) / 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
            (index + 2) * ITEM_SIZE,
          ];

          const rotateY = scrollX.interpolate({
            inputRange,
            outputRange: ["60deg", "30deg", "0deg", "-30deg", "-60deg"],
            extrapolate: "clamp",
          });

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-40, -20, 0, 20, 40],
            extrapolate: "clamp",
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 0.85, 1, 0.85, 0.7],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 0.6, 1, 0.6, 0.3],
            extrapolate: "clamp",
          });

          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    opacity,
                    transform: [
                      { perspective: PERSPECTIVE },
                      { translateX },
                      { rotateY },
                      { scale },
                    ],
                  },
                ]}
              >
                <AppImage source={item.image} style={styles.image} />
              </Animated.View>
            </View>
          );
        }}
      />

      {/* ===== DOTS ===== */}
      <View style={styles.dots}>
        {data.map((_, i) => {
          const inputRange = [
            (i - 1) * ITEM_SIZE,
            i * ITEM_SIZE,
            (i + 1) * ITEM_SIZE,
          ];

          const scale = normalizedScrollX.interpolate({
            inputRange,
            outputRange: [1, 1.6, 1],
            extrapolate: "clamp",
          });

          const opacity = normalizedScrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },

  card: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.25,
    borderRadius: 22,
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#004e92",
    marginHorizontal: 4,
  },
});
