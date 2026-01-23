/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    StatusBar,
    Animated, // Added for smooth bar animation
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import Colors from "../theme/Colors";
import Loader from "../components/Loader";
import { supabase } from "../lib/supabase";
import { decode } from 'base64-arraybuffer';
import RNFS from 'react-native-fs';
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function AdminUploadScreen() {
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Banner/Offer States
    const [festivalName, setFestivalName] = useState("");
    const [discountText, setDiscountText] = useState("");
    const [buttonText, setButtonText] = useState("Shop Now");

    // Media States
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerVideo, setBannerVideo] = useState(null);

    // Animate the bar whenever progress changes
    React.useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: uploadProgress,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [uploadProgress]);

    /* -------------------- Media Pickers -------------------- */

    const pickImage = async () => {
        const res = await launchImageLibrary({ mediaType: "photo", quality: 0.8 });
        if (!res.didCancel && res.assets?.length) {
            setBannerImage(res.assets[0]);
            setBannerVideo(null);
        }
    };

    const pickVideo = async () => {
        const res = await launchImageLibrary({ mediaType: "video", videoQuality: 'medium' });
        if (!res.didCancel && res.assets?.length) {
            setBannerVideo(res.assets[0]);
            setBannerImage(null);
        }
    };

    /* -------------------- Upload Logic -------------------- */

    const uploadFile = async (asset, folder) => {
        try {
            const ext = asset.type.split('/')[1] || 'jpg';
            const fileName = `${Date.now()}.${ext}`;
            const filePath = `${folder}/${fileName}`;

            // Start Progress Simulation
            setUploadProgress(10);
            const interval = setInterval(() => {
                setUploadProgress((prev) => (prev < 90 ? prev + 5 : prev));
            }, 500);

            const base64 = await RNFS.readFile(asset.uri, 'base64');

            const { error: uploadError } = await supabase.storage
                .from("banner-images")
                .upload(filePath, decode(base64), {
                    contentType: asset.type,
                });

            clearInterval(interval);
            if (uploadError) throw uploadError;

            setUploadProgress(100);

            const { data } = supabase.storage
                .from("banner-images")
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (err) {
            setUploadProgress(0);
            throw err;
        }
    };

    const handleUploadBanner = async () => {
        if (!festivalName || !discountText || (!bannerImage && !bannerVideo)) {
            Alert.alert("Error", "Please fill all fields and select media");
            return;
        }

        try {
            setLoading(true);
            let mediaUrl = "";
            const isVideo = !!bannerVideo;

            if (isVideo) {
                mediaUrl = await uploadFile(bannerVideo, "videos");
            } else {
                mediaUrl = await uploadFile(bannerImage, "images");
            }

            const { error: dbError } = await supabase
                .from("banners")
                .insert([
                    {
                        festival_name: festivalName,
                        discount_text: discountText,
                        button_text: buttonText,
                        banner_url: mediaUrl,
                        is_video: isVideo,
                        is_active: true,
                        priority: 1
                    },
                ]);

            if (dbError) throw dbError;

            Alert.alert("Success", "Banner Offer Published!");
            resetForm();
        } catch (err) {
            Alert.alert("Upload Failed", err.message);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const resetForm = () => {
        setFestivalName("");
        setDiscountText("");
        setButtonText("Shop Now");
        setBannerImage(null);
        setBannerVideo(null);
        setUploadProgress(0);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Loader visible={loading && uploadProgress === 0} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <Text style={styles.title}>Admin: Add New Offer</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Festival / Occasion Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Diwali Dhamaka"
                        placeholderTextColor="#9CA3AF"
                        value={festivalName}
                        onChangeText={setFestivalName}
                    />

                    <Text style={styles.label}>Offer Details</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Flat 50% Off"
                        placeholderTextColor="#9CA3AF"
                        value={discountText}
                        onChangeText={setDiscountText}
                    />

                    <Text style={styles.label}>Button Text</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Shop Now"
                        placeholderTextColor="#9CA3AF"
                        value={buttonText}
                        onChangeText={setButtonText}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Banner Media (Select One)</Text>
                    
                    <View style={styles.mediaRow}>
                        <TouchableOpacity style={[styles.mediaButton, bannerImage && styles.activeMedia]} onPress={pickImage}>
                            <Ionicons name="image-outline" size={24} color={bannerImage ? "#FFF" : "#374151"} />
                            <Text style={[styles.mediaText, bannerImage && { color: '#FFF' }]}>Pick Image</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.mediaButton, bannerVideo && styles.activeMedia]} onPress={pickVideo}>
                            <Ionicons name="videocam-outline" size={24} color={bannerVideo ? "#FFF" : "#374151"} />
                            <Text style={[styles.mediaText, bannerVideo && { color: '#FFF' }]}>Pick Video</Text>
                        </TouchableOpacity>
                    </View>

                    {bannerImage && (
                        <Image source={{ uri: bannerImage.uri }} style={styles.previewMedia} />
                    )}
                    
                    {bannerVideo && (
                        <View style={styles.videoPlaceholder}>
                            <Ionicons name="play-circle" size={40} color="#1e3c72" />
                            <Text style={{marginTop: 8, color: '#4B5563'}}>{bannerVideo.fileName || "Video Selected"}</Text>
                        </View>
                    )}
                </View>

                {/* Progress Bar UI */}
                {loading && (
                    <View style={styles.progressBox}>
                        <View style={styles.progressLabelRow}>
                            <Text style={styles.progressLabel}>Uploading to Storage...</Text>
                            <Text style={styles.progressLabel}>{Math.round(uploadProgress)}%</Text>
                        </View>
                        <View style={styles.progressBarTrack}>
                            <Animated.View 
                                style={[
                                    styles.progressBarFill, 
                                    { width: progressAnim.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: ['0%', '100%']
                                    })} 
                                ]} 
                            />
                        </View>
                    </View>
                )}

                <TouchableOpacity 
                    style={[styles.uploadBtnContainer, loading && { opacity: 0.7 }]} 
                    onPress={handleUploadBanner}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={["#1e3c72", "#2a5298"]}
                        style={styles.uploadBtn}
                    >
                        <Text style={styles.uploadBtnText}>
                            {loading ? "Processing..." : "Publish Offer Banner"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    title: { fontSize: 24, fontWeight: "bold", margin: 20, color: "#111827" },
    card: { backgroundColor: "#FFF", marginHorizontal: 20, padding: 20, borderRadius: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    label: { fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 6, textTransform: 'uppercase' },
    input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, padding: 12, marginBottom: 15, color: "#000", backgroundColor: '#FBFBFB' },
    section: { marginTop: 25, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: '#111827' },
    mediaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    mediaButton: { 
        flex: 0.48, 
        backgroundColor: "#F3F4F6", 
        padding: 15, 
        borderRadius: 12, 
        alignItems: 'center', 
        flexDirection: 'row', 
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    activeMedia: { backgroundColor: "#1e3c72", borderColor: '#1e3c72' },
    mediaText: { marginLeft: 10, fontWeight: '700', color: '#374151' },
    previewMedia: { width: '100%', height: 200, borderRadius: 15 },
    videoPlaceholder: { 
        width: '100%', 
        height: 120, 
        backgroundColor: '#F3F4F6', 
        borderRadius: 15, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#D1D5DB'
    },
    progressBox: {
        marginHorizontal: 20,
        marginTop: 25,
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressLabel: { fontSize: 12, fontWeight: '700', color: '#1e3c72' },
    progressBarTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: '#1e3c72' },
    uploadBtnContainer: { marginTop: 30, paddingHorizontal: 20 },
    uploadBtn: { paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
    uploadBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 }
})