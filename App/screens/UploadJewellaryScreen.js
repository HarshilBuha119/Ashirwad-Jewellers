import React, { useState } from "react";
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
    Modal,
    FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";
import Loader from "../components/Loader";
import { supabase } from "../lib/supabase";
import { decode } from 'base64-arraybuffer';
import RNFS from 'react-native-fs';
import { categories } from "../data/homeData"
import LinearGradient from "react-native-linear-gradient";

export default function UploadJewellaryScreen() {
    const [loading, setLoading] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    // Form States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [itemNumber, setItemNumber] = useState("");
    // Image States
    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                setCategory(item.title);
                setCategoryModalVisible(false);
            }}
        >
            <Text style={[
                styles.modalItemText,
                category === item.title && { color: Colors.primary, fontWeight: 'bold' }
            ]}>
                {item.title}
            </Text>
        </TouchableOpacity>
    );

    /* -------------------- Image Pickers -------------------- */

    const pickMainImage = async () => {
        const res = await launchImageLibrary({ mediaType: "photo", quality: 0.7 });
        if (!res.didCancel && res.assets?.length) {
            setMainImage(res.assets[0]);
        }
    };

    const pickGalleryImages = async () => {
        const res = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 5,
            quality: 0.7
        });
        if (!res.didCancel && res.assets?.length) {
            setGalleryImages(res.assets);
        }
    };

    /* -------------------- Upload Logic -------------------- */

    const processAndUpload = async (asset, folder) => {
        try {
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            const filePath = `${folder}/${fileName}`;

            // Convert URI to Base64 then to ArrayBuffer (Fixes body.has error)
            const base64 = await RNFS.readFile(asset.uri, 'base64');

            const { error: uploadError } = await supabase.storage
                .from("jewellary-images")
                .upload(filePath, decode(base64), {
                    contentType: asset.type || 'image/jpeg',
                });

            if (uploadError) throw uploadError;

            // Get the Public URL to store in the Database
            const { data } = supabase.storage
                .from("jewellary-images")
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (err) {
            console.error("Upload process error:", err);
            throw err;
        }
    };

    const handleSubmit = async () => {
        if (!name || !price || !category || !mainImage) {
            Alert.alert("Error", "Please fill name, price, category and select a main image");
            return;
        }

        try {
            setLoading(true);
            const folderName = category.toLowerCase().trim();

            // 1. Upload Main Image
            const mainImageUrl = await processAndUpload(mainImage, folderName);

            // 2. Upload Gallery Images (Loop)
            const galleryUrls = [];
            for (let i = 0; i < galleryImages.length; i++) {
                const url = await processAndUpload(galleryImages[i], folderName);
                galleryUrls.push({ id: String(i + 1), image: url });
            }

            // 3. Insert into public.jewellary
            const { error: dbError } = await supabase
                .from("jewellary")
                .insert([
                    {
                        item_number: itemNumber,
                        name: name,
                        description: description,
                        price: parseFloat(price),
                        brand: brand,
                        category: category,
                        main_image: mainImageUrl,
                        images: galleryUrls, // JSONB column
                    },
                ]);

            if (dbError) throw dbError;

            Alert.alert("Success", "Jewellary item uploaded!");
            resetForm();
        } catch (err) {
            Alert.alert("Upload Failed", err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName(""); setDescription(""); setPrice("");
        setBrand(""); setCategory(""); setItemNumber("");
        setMainImage(null); setGalleryImages([]);
    };

    /* -------------------- UI -------------------- */

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <Loader visible={loading} />

            {/* 1. ADD THIS MODAL BLOCK - It must be inside the return */}
            <Modal
                visible={categoryModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCategoryModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Category</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setCategory(item.title);
                                        setCategoryModalVisible(false);
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={item.image} style={{ width: 30, height: 30, borderRadius: 5, marginRight: 15 }} />
                                        <Text style={[
                                            styles.modalItemText,
                                            category === item.title && { color: Colors.primary, fontWeight: 'bold' }
                                        ]}>
                                            {item.title}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setCategoryModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Upload Jewellary</Text>

                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        placeholder="Product Name"
                        placeholderTextColor={Colors.primary}
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description"
                        placeholderTextColor={Colors.primary}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Item Number (e.g. RNG-1001)"
                        placeholderTextColor={Colors.primary}
                        value={itemNumber}
                        onChangeText={setItemNumber}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        placeholderTextColor={Colors.primary}
                        value={price}
                        keyboardType="numeric"
                        onChangeText={setPrice}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Brand"
                        value={brand}
                        placeholderTextColor={Colors.primary}
                        onChangeText={setBrand}
                    />

                    {/* Category Selector Trigger */}
                    <TouchableOpacity
                        style={styles.dropdownInput}
                        onPress={() => setCategoryModalVisible(true)}
                    >
                        <Text style={{ color: category ? "#000" : Colors.primary }}>
                            {category || "Select Category"}
                        </Text>
                        <Text style={{ color: Colors.primary }}>▼</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Images</Text>
                    <TouchableOpacity style={styles.imageButton} onPress={pickMainImage}>
                        <Text style={styles.imageButtonText}>Select Main Image</Text>
                    </TouchableOpacity>
                    {mainImage && (
                        <Image source={{ uri: mainImage.uri }} style={styles.mainImage} resizeMode="cover" />
                    )}

                    <TouchableOpacity style={styles.imageButton} onPress={pickGalleryImages}>
                        <Text style={styles.imageButtonText}>Select Gallery Images</Text>
                    </TouchableOpacity>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {galleryImages.map((img, index) => (
                            <Image key={index} source={{ uri: img.uri }} style={styles.galleryImage} />
                        ))}
                    </ScrollView>
                </View>

                <TouchableOpacity style={styles.cartBar} onPress={handleSubmit}>
                    <LinearGradient
                        colors={["#004e92", "#000428"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.cartButton}
                    >
                        <Text style={styles.cartText}>
                            Upload Jewellary
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: Colors.primary,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        padding: Spacing.lg,
        borderRadius: 18,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        fontSize: 14,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    section: {
        marginTop: Spacing.xl,
        paddingHorizontal: Spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.primary,
        marginBottom: 14,
    },
    imageButton: {
        backgroundColor: "#F3F4F6",
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
        marginBottom: 12,
    },
    imageButtonText: {
        fontSize: 14,
        fontWeight: "500",
    },
    mainImage: {
        width: "100%",
        height: 220,
        borderRadius: 18,
        marginBottom: 14,
    },
    galleryImage: {
        width: 90,
        height: 90,
        borderRadius: 14,
        marginRight: 10,
    },
    cartBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },

    cartButton: {
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: "center",
    },

    cartText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    dropdownInput: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '50%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalItemText: {
        fontSize: 16,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 10,
        padding: 15,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'red',
        fontWeight: '600',
    }
});