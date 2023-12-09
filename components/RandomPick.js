import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import open_api_key from './open_api_key';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Icon from 'react-native-vector-icons/FontAwesome';



const RandomPick = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const prompts = [
        "A sunset over a mountain range",
        "A futuristic city skyline",
        "A serene beach at dawn",
        "An abstract painting",
    ];

// Define an asynchronous function named saveImage
const saveImage = async () => {
    // Create a file path in the device's document directory for the image
    let fileUri = FileSystem.documentDirectory + "image.jpg";

    // Request permissions to access the media library and wait for the response
    const { status } = await MediaLibrary.requestPermissionsAsync();

    // Check if the permission was not granted
    if (status !== "granted") {
        // Show an alert if permissions are not granted
        Alert.alert("Sorry, we need camera roll permissions to make this work!");
        // Exit the function early
        return;
    }

    // Try to execute the following block which might throw an error
    try {
        // Download the image from the URL to the local file system
        await FileSystem.downloadAsync(imageUrl, fileUri)
        // Create an asset in the media library for the downloaded image
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        // Create a new album named 'Download', or use existing one, and add the asset to it
        await MediaLibrary.createAlbumAsync("Download", asset, false);
        // Show an alert confirming that the image has been saved
        Alert.alert("Saved!");
    } catch (error) { // Catch any errors that occurred in the try block
        // Log the error to the console
        console.error("Error saving image", error);
        // Show an alert indicating that there was an error saving the image
        Alert.alert("Error saving image");
    }
};

    const getRandomPrompt = () => {
        return prompts[Math.floor(Math.random() * prompts.length)];
    };

    const generateRandomImage = async () => {
        try {
            setLoading(true);
            const randomPrompt = getRandomPrompt();
            const url = 'https://api.openai.com/v1/images/generations'; // Your DALL-E endpoint
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${open_api_key}`,
                },
            };
            const msg_data = {
                model: "dall-e-3",
                prompt: randomPrompt,
                n: 1,
                size: "1024x1024",
            };
            const response = await axios.post(url, msg_data, config);
            const result = response.data;
            console.log("Request URL: ", url);
            console.log("Request Headers: ", config.headers);
            console.log("Request Body: ", msg_data);
            setImageUrl(result.data[0].url); // Update with actual response field
        } catch (error) {
            console.error(error);
            console.error("Error response data: ", error.response.data);

        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        generateRandomImage(); // Generate an image on component mount
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(245, 245, 245)', alignItems: 'center' }}>
            <Text style={{
                marginTop: 30,
                fontSize: 18, fontWeight: 'bold',
                color: 'rgb(250, 15, 89)',
                marginBottom:40
            }}>
                Get a Random AI image
            </Text>
            {loading && <ActivityIndicator size="large" color="rgb(252, 126, 149)" />}
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 320, 
                height: 400, 
                backgroundColor: 'white',
                marginTop: 20,
                borderRadius: 3, 
                borderColor: 'rgb(252, 215, 222)',
                borderStyle: 'dotted',

            }}>
            <View style={styles.imageContainer}>

                {imageUrl && (
                <View style={{ justifyContent: 'center',}} >

                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: 300, height: 300 }}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                    style={styles.saveImageButton}
                    onPress={saveImage}>
                    <Icon 
                        name="download"
                        color="white"
                        size={20}
                    />
                </TouchableOpacity>
                    </View>
                )}
          
            </View>
            <TouchableOpacity
                    style={{
                        backgroundColor: 'rgb(250, 15, 89)',
                        marginTop: 20, 
                        padding: 10,
                        borderRadius: 10
                    }}
                onPress={generateRandomImage}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                    Refresh Image
                </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default RandomPick;

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin:100,
        padding: 10,
        width: '100%', 
        height: 400, 
        backgroundColor: 'white', 
        borderRadius: 10, 
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    saveImageButton: {
        borderColor: 'white',
        width: 35,
        height: 35,
        padding:3,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 100,
        marginLeft: '45%',
        marginTop: 20,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,  
    }
})