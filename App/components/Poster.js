import React from "react";
import {
    View, Text, StyleSheet, ImageBackground,
    TouchableOpacity,
} from "react-native";
import Video from 'react-native-video';
import { useActiveBanner } from "../api/bannerApi";
export default function Poster() {
    const { data: banner,  isError } = useActiveBanner();
    if (isError || !banner) return null;

    return (
        <View style={styles.container}>
            {banner.is_video ? (
                /* --- VIDEO BACKGROUND --- */
                <View style={styles.mediaContainer}>
                    <Video
                        source={{ uri: banner.banner_url }}
                        style={styles.backgroundVideo}
                        muted={true}
                        repeat={true}
                        resizeMode="contain"
                        rate={1.0}
                        ignoreSilentSwitch={"obey"}
                        playInBackground={false}
                        playWhenInactive={false}
                    />
                    {/* Glass Overlay on top of Video */}
                    <View style={styles.liquidGlassCard}>
                        <Text style={styles.festival}>{banner.festival_name}</Text>
                        <Text style={styles.discount}>{banner.discount_text}</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>{banner.button_text}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                /* --- IMAGE BACKGROUND --- */
                <ImageBackground
                    source={{ uri: banner.banner_url }}
                    style={styles.bgImage}
                    imageStyle={{ borderRadius: 20 }}
                >
                    <View style={styles.liquidGlassCard}>
                        <Text style={styles.festival}>{banner.festival_name}</Text>
                        <Text style={styles.discount}>{banner.discount_text}</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>{banner.button_text}</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        height: 200,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden', // Crucial for video borderRadius
        marginTop: 20
    },
    mediaContainer: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 20,
    },
    bgImage: {
        flex: 1,
        justifyContent: "center",
    },
    liquidGlassCard: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.2)", // Darkened slightly for text readability
        padding: 20,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    festival: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1.2,
        textTransform: 'uppercase'
    },
    discount: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: '900',
        marginVertical: 5
    },
    button: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 10,
        elevation: 5
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000'
    }
});