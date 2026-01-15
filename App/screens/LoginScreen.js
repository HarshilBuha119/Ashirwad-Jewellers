import React, { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Alert
} from "react-native"
import Loader from '../components/Loader'
import { SafeAreaView } from "react-native-safe-area-context"
import { Images } from "../../assets/images"
import Ant from 'react-native-vector-icons/AntDesign'
import FA from 'react-native-vector-icons/FontAwesome'
import AppImage from "../components/AppImage"
import { useNavigation } from "@react-navigation/native"
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    GoogleAuthProvider,
    getAuth,
    signInWithCredential,
} from '@react-native-firebase/auth';

export default function LoginScreen() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation()
    const handleAppleSignIn = () => {
        navigation.navigate('Profile Setup');
    };

    async function onGoogleButtonPress() {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            setLoading(true);

            const signInResult = await GoogleSignin.signIn();

            // Correct way to access the ID token
            const idToken = signInResult.data?.idToken;

            if (!idToken) {
                throw new Error('No ID token found');
            }

            const googleCredential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(getAuth(), googleCredential);
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            Alert.alert('Sign-in failed: ', error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <Loader visible={loading} />
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* --- Decorative Background Elements to remove "emptiness" --- */}
            <View style={styles.blobTopRight} />
            <View style={styles.blobBottomLeft} />

            {/* Main Content Container */}
            <View style={styles.contentContainer}>

                {/* 1. Hero Section: Logo & Branding */}
                <View style={styles.heroSection}>
                    <View style={styles.logoContainer}>
                        {/* Increased size for impact */}
                        <AppImage
                            source={Images.Logo}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.appName}>Ashirwad Jewellers</Text>
                    <Text style={styles.tagline}>
                        Elegance in Every Carat{"\n"}
                        Crafted to Shine Forever.
                    </Text>
                </View>

                {/* 2. Action Section: Buttons */}
                <View style={styles.actionSection}>

                    {/* Google Login */}
                    <TouchableOpacity style={styles.googleButton} activeOpacity={0.7} onPress={onGoogleButtonPress}>
                        <View style={styles.iconWrapper}>
                            {/* You can replace this Text with an actual Google SVG icon later */}
                            <Ant name="google" size={24} color="black" />

                        </View>
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    {/* Apple Login */}
                    <TouchableOpacity style={styles.appleButton} activeOpacity={0.7}>
                        <View style={styles.iconWrapper}>
                            <FA name="apple" size={24} color="white" />
                        </View>
                        <Text style={styles.appleButtonText}>Continue with Apple</Text>
                    </TouchableOpacity>

                    {/* Terms Footer (Anchors the bottom) */}
                    <Text style={styles.termsText}>
                        By continuing, you agree to our{" "}
                        <Text style={styles.linkText}>Terms</Text> &{" "}
                        <Text style={styles.linkText}>Privacy Policy</Text>.
                    </Text>
                </View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    contentContainer: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    blobTopRight: {
        position: "absolute",
        top: 0,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#F0F4FF",
        opacity: 0.8,
        zIndex: -1,
    },
    blobBottomLeft: {
        position: "absolute",
        bottom: 100,
        left: -80,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: "#F5F7FA", // Very light gray
        opacity: 0.8,
        zIndex: -1,
    },

    // --- Hero Section ---
    heroSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    logoContainer: {
        marginBottom: 24,
    },
    logo: {
        width: 160, // Much bigger logo
        height: 160,
        borderRadius: 100,
    },
    appName: {
        fontSize: 36, // Larger, bolder font
        fontWeight: "800",
        color: "#0F172A",
        letterSpacing: -0.5,
        marginBottom: 12,
    },
    tagline: {
        fontSize: 16,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 24,
        paddingHorizontal: 20,
    },

    // --- Action Section ---
    actionSection: {
        width: "100%",
        paddingBottom: 30,
    },

    // Google Button
    googleButton: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        height: 56, // Taller buttons feel more modern
        borderRadius: 16, // Softer corners
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    googleIconText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#DB4437", // Google Red color hint
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B", // Dark slate for text (readable)
        marginLeft: 12,
    },

    // Apple Button
    appleButton: {
        flexDirection: "row",
        backgroundColor: "#0F172A", // Dark Navy/Black
        height: 56,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32, // Space before footer
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    appleIconText: {
        fontSize: 22,
        color: "#FFFFFF",
        marginTop: -2, // Visual optical alignment
    },
    appleButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        marginLeft: 12,
    },

    // --- Footer ---
    termsText: {
        fontSize: 12,
        color: "#94A3B8",
        textAlign: "center",
        lineHeight: 18,
    },
    linkText: {
        color: "#0F172A",
        fontWeight: "600",
    },
})