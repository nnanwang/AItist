import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Keyboard } from 'react-native';

import open_api_key from './open_api_key';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const AIPortrait = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [promptText, setPromptText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleStyleSelection = (style) => {
        const updatedPrompt = `${promptText} in a ${style} style.`;
        setPromptText(updatedPrompt);
    }

    // const saveImage = async () => {
    //     let fileUri = FileSystem.documentDirectory + "image.jpg";
    //     const { status } = await MediaLibrary.requestPermissionsAsync();

    //     if (status !== "granted") {
    //         Alert.alert("Sorry, we need camera roll permissions to make this work!");
    //         return;
    //     }

    //     try {
    //         await FileSystem.downloadAsync(imageUrl, fileUri)
    //         const asset = await MediaLibrary.createAssetAsync(fileUri);
    //         await MediaLibrary.createAlbumAsync("Download", asset, false);
    //         Alert.alert("Saved!");
    //     } catch (error) {
    //         console.error("Error saving image", error);
    //         Alert.alert("Error saving image");
    //     }
    // };

    const getImageResponse = async () => {
        Keyboard.dismiss();

        try {
            setLoading(true);
            const url = 'https://api.openai.com/v1/images/generations'; // Update with the DALL-E endpoint
            const config = {
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${open_api_key}`,
                },
            };
            const msg_data = {
                model: "dall-e-3",
                prompt: promptText + "This is a portrait.",
                n: 1,
                size: "1024x1024",
            };
            const response = await axios.post(url, msg_data, config);
            const result = response.data;
            // Assuming the API returns the image URL in the response
            setImageUrl(result.data[0].url); 
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
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
    return (
        <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
                Make Your Prompt
            </Text>
            <TextInput
            style={styles.promptText}
                onChangeText={text => setPromptText(text)}
                value={promptText}
                multiline={true}
                numberOfLines={6}
                placeholder="Enter your prompt..."
                placeholderTextColor="gray"
            />

            {/* <Button
                onPress={getImageResponse}
                title={loading ? 'Generating Image...' : "Generate Image"}
                color="#841584"
            /> */}

            <View style={styles.stylesContainer}>
                <TouchableOpacity
                style={styles.naturalStyle}
                onPress={() => handleStyleSelection("natural")}
            >
                    <Text style={styles.naturalStyleText}>
                    Natural
                </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.monoStyle}
                onPress={() => handleStyleSelection("monochrome")}
            >
                    <Text style={styles.monoStyleText}>
                    Monochromatic
                </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.fineArtStyle}
                onPress={() => handleStyleSelection("fine art")}
            >
                    <Text style={styles.fineArtStyleText}>
                    Fine Art
                </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.abstractStyle}
                onPress={() => handleStyleSelection("abstract")}
            >
                    <Text style={styles.abstractStyleText}>
                    Abstract
                </Text>
            </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.GenImageButton}
                onPress={getImageResponse}
            >
                <Text style={styles.genImageButtonText}>
                    {loading ? 'Creating...' : "Get AI Portrait"}     
                </Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="rgb(252, 126, 149)" />}
            <View style={styles.imageContainer}>
                {!imageUrl && (
                    <Text style={styles.imageText}>
                        Your AI Portrait Will Be Here!
                    </Text>
                )}
                {imageUrl && (
                    <View style={{ justifyContent: 'center',}} >
                        <TouchableOpacity
                            style={styles.saveImageButton}
                            onPress={saveImage}>
                            <Icon 
                                name="download"
                                color="white"
                                size={20}
                            />
                        </TouchableOpacity>
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: 300, height: 300, margin: 20}}
                        resizeMode="contain"
                        />
                        </View>
                   
                )}

            </View>
        </SafeAreaView>
    );
}

export default AIPortrait;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(245, 245, 245)',
        alignItems: 'center'
    },
    title: {
        marginTop: 30,
        marginLeft: 20,
        marginBottom: -5,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgb(250, 15, 89)'
    },
    promptText: {
        borderColor: 'rgb(252, 126, 149)',
        margin: 20,
        width: '80%',
        height:150,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: -10,
        backgroundColor: 'white',
        color: 'black'
    },

    stylesContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    naturalStyle: {
        backgroundColor: 'white',
        borderColor: 'rgb(255, 204, 102)',
        borderWidth: 2,
        borderStyle: 'solid',
        marginTop: 10,
        borderRadius: 10,
        margin:6,
        padding: 5,
        alignItems: 'center',
        shadowColor: "rgb(255, 204, 102)",
        shadowOpacity: 0.8,
        shadowRadius: 1,
        shadowOffset: {
            height: 3,
            width: 3
        }   
    },
    naturalStyleText: {
        color: 'rgb(255, 204, 102)',
        fontWeight: 'bold',
        fontSize: 12   
    },
    monoStyle: {
        backgroundColor: 'white',
        borderColor: 'rgb(2, 84, 247)',
        borderWidth: 2,
        borderStyle: 'solid',
        marginTop: 10,
        borderRadius: 10,
        margin:6,
        padding: 5,
        alignItems: 'center',
        shadowColor: "rgb(2, 84, 247)",
        shadowOpacity: 0.8,
        shadowRadius: 1,
        shadowOffset: {
            height: 3,
            width: 3
        }   
    },
    monoStyleText: {
        color: 'rgb(2, 84, 247)',
        fontWeight: 'bold',
        fontSize: 12
    },
    fineArtStyle: {
        backgroundColor: 'white',
        borderColor: 'rgb(10, 252, 232)',
        borderWidth: 2,
        borderStyle: 'solid',
            marginTop: 10,
            margin:6,
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        shadowColor: "rgb(10, 252, 232)",
        shadowOpacity: 0.8,
        shadowRadius: 1,
        shadowOffset: {
            height: 3,
            width: 3
        }   
    },
    fineArtStyleText: {
        color: 'rgb(10, 252, 232)',
        fontWeight: 'bold',
        fontSize: 12
    },
    abstractStyle: {
        backgroundColor: 'white',
        borderColor: 'rgb(247, 2, 239)',
        borderWidth: 2,
        borderStyle: 'solid',
        marginTop: 10,
        margin:6,
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        shadowColor: "rgb(247, 2, 239)",
        shadowOpacity: 0.8,
        shadowRadius: 1,
        shadowOffset: {
            height: 3,
            width: 3
        }   
    }, 
    abstractStyleText: {
        color: 'rgb(247, 2, 239)',
        fontWeight: 'bold',
        fontSize: 12
    },
    GenImageButton: { 
        backgroundColor: 'rgb(250, 15, 89)',
        margin: 20,
        padding: 10,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center'
    },
    genImageButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin:20,
        padding: 10,
        width: '80%', 
        height: 400, 
        backgroundColor: 'white', 
        borderRadius: 10, 
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    imageText: {
        color: "rgb(252, 126, 149)"
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
        marginLeft: '90%',
        marginTop: -50,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,  
    }

})
