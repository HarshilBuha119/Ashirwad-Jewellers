/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
  StatusBar,
  Text,
  Image // Using standard Image for Modal stability
} from "react-native";
import AppImage from "./AppImage";
import Colors from "../theme/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageViewer from 'react-native-image-zoom-viewer';

const { width, height: screenHeight } = Dimensions.get("window");

const ITEM_WIDTH = width * 0.72;
const ITEM_SPACING = 10;
const ITEM_SIZE = ITEM_WIDTH + ITEM_SPACING;

// Define the exact height we want for the modal image
const MODAL_IMG_HEIGHT = screenHeight * 0.7;

export default function Slider({ data = [] }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Toast Animation Value
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const zoomImages = data.map(item => ({
    url: typeof item.image === 'string' ? item.image : '',
    props: { source: item.image } 
  }));

  const openGallery = (index) => {
    setSelectedIndex(index);
    setIsGalleryVisible(true);
    
    // Trigger Toast Animation
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        bounces={true}
        contentContainerStyle={{
          paddingHorizontal: (width - ITEM_WIDTH) / 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const scale = scrollX.interpolate({
            inputRange: [(index - 1) * ITEM_SIZE, index * ITEM_SIZE, (index + 1) * ITEM_SIZE],
            outputRange: [0.9, 1, 0.9],
            extrapolate: "clamp",
          });

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => openGallery(index)}
              style={{ width: ITEM_SIZE, alignItems: 'center' }}
            >
              <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <AppImage source={item.image} style={styles.image} />
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.dots}>
        {data.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * ITEM_SIZE, i * ITEM_SIZE, (i + 1) * ITEM_SIZE],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
        })}
      </View>

      <Modal 
        visible={isGalleryVisible} 
        transparent={true} 
        animationType="fade"
        onRequestClose={() => setIsGalleryVisible(false)}
      >
        <View style={styles.glassBackdrop}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

          {/* Liquid Glass Toast */}
          <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
            <Ionicons name="chevron-down-outline" size={20} color="#FFF" />
            <Text style={styles.toastText}>Swipe down to close</Text>
          </Animated.View>

          <ImageViewer
            imageUrls={zoomImages}
            index={selectedIndex}
            onCancel={() => setIsGalleryVisible(false)}
            enableSwipeDown={true}
            backgroundColor="transparent"
            saveToLocalByLongPress={false}
            
            // FIX: Explicit numeric height (70% of screen)
            imageWidth={width}
            imageHeight={MODAL_IMG_HEIGHT}

            renderImage={(props) => (
              <Image
                source={props.source}
                style={{ width: width, height: MODAL_IMG_HEIGHT }}
                resizeMode="contain"
              />
            )}

            renderHeader={() => (
              <View style={styles.glassHeader}>
                <TouchableOpacity
                  style={styles.glassCloseButton}
                  onPress={() => setIsGalleryVisible(false)}
                >
                  <Ionicons name="close" size={28} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            renderIndicator={(currentIndex, allSize) => (
              <View style={styles.glassIndicatorContainer}>
                <Text style={styles.indicatorText}>{currentIndex} / {allSize}</Text>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
    borderRadius: 24,
    backgroundColor: "#fff",
    overflow: 'hidden',
  },
  image: { width: "100%", height: "100%" },
  dots: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.text,
    marginHorizontal: 4,
  },
  glassBackdrop: { 
    flex: 1, 
    backgroundColor: "rgba(0, 0, 0, 0.94)" 
  },
  glassHeader: {
    width: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    zIndex: 9999,
  },
  glassCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  glassIndicatorContainer: {
    position: 'absolute',
    top: 55,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 9998
  },
  indicatorText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1
  },
  // Toast UI
  toastContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 10000,
  },
  toastText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8
  }
})