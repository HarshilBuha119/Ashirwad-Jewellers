import React, { useContext, useEffect, useRef } from "react";
import { View, Text, Image, Animated, StyleSheet, StatusBar } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Images } from "../../assets/images";
import Colors from "../theme/Colors";

const TEXT = "Ashirwad Jewellers";

const SplashScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  // Logo animation (from sky)
  const logoTranslateY = useRef(new Animated.Value(-200)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Text animations (one per letter)
  const letterAnimations = useRef(
    TEXT.split("").map(() => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(-20),
    }))
  ).current;

  useEffect(() => {
    // Logo drop animation
    Animated.parallel([
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start letter-by-letter animation
      const animations = letterAnimations.map((anim, index) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 300,
            delay: index * 80,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateX, {
            toValue: 0,
            duration: 300,
            delay: index * 80,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.stagger(50, animations).start();
    });

    // Navigate after splash
    const timer = setTimeout(() => {
      user ? navigation.replace("Tabs") : navigation.replace("Login");
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigation, user]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={Colors.white}/>
      <Animated.Image
        source={Images.Logo}
        resizeMode="contain"
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslateY }],
          },
        ]}
      />

      {/* Animated text letter-by-letter */}
      <View style={styles.textRow}>
        {TEXT.split("").map((char, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.text,
              {
                opacity: letterAnimations[index].opacity,
                transform: [{ translateX: letterAnimations[index].translateX }],
              },
            ]}
          >
            {char}
          </Animated.Text>
        ))}
      </View>
    </View>
  );
};

export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
    borderRadius: 25,
  },
  textRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#954535",
    letterSpacing: 1,
  },
});
