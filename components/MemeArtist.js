import React, { useState, useRef } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, Image, View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Keyboard } from 'react-native';
import ViewShot from 'react-native-view-shot'; // Import ViewShot
import open_api_key from './open_api_key';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { BackgroundImage } from 'react-native-elements/dist/config';

const Meme1 = require('../assets/meme1.jpg');
const Meme2 = require('../assets/meme2.jpg');
const Meme3 = require('../assets/meme3.jpg');

const MemeGenerator = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [promptText, setPromptText] = useState("Write your story to create a meme without text: ");
    const [captionTop, setCaptionTop] = useState("");
    const [captionBottom, setCaptionBottom] = useState("");
    const [loading, setLoading] = useState(false);
    const viewShotRef = useRef(); // Reference to the ViewShot component

    // for meme text
    const BoldOutlineText = ({ text, style }) => {
        // Shadow offset directions
        const shadowOffsets = [
            { width: -1, height: -1 },
            { width: 1, height: -1 },
            { width: -1, height: 1 },
            { width: 1, height: 1 },
            { width: 0, height: -1 },
            { width: -1, height: 0 },
            { width: 1, height: 0 },
            { width: 0, height: 1 },
        ];
    
        return (
            <View style={styles.container}>
                {shadowOffsets.map((offset, index) => (
                    <Text key={index} style={[styles.shadowText, { textShadowOffset: offset }, style]}>
                        {text}
                    </Text>
                ))}
                <Text style={[styles.text, style]}>{text}</Text>
            </View>
        );
    };

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
                prompt: promptText + "This is a meme.",
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

    const saveImage = async () => {
        let fileUri = FileSystem.documentDirectory + "image.jpg";
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        try {
            await FileSystem.downloadAsync(imageUrl, fileUri)
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync("Download", asset, false);
            Alert.alert("Saved!");
        } catch (error) {
            console.error("Error saving image", error);
            Alert.alert("Error saving image");
        }
    };

    const saveImageWithText = async () => {
        try {
            const uri = await viewShotRef.current.capture(); // Capture the view
            // Save the captured image
            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync("Download", asset, false);
            Alert.alert("Saved!");
        } catch (error) {
            console.error("Error saving image with text", error);
            Alert.alert("Error saving image with text");
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.memeBoard}>
                
                <Image
                    source={Meme1}
                    style={styles.meme}
                />
                <Image
                    source={Meme2}

                    style={styles.meme}
                />
                <Image
                    source={Meme3}
                    style={styles.meme}
                />
            </View>
            <TextInput
            style={styles.promptText}
                onChangeText={text => setPromptText(text)}
                value={promptText}
                multiline={true}
                numberOfLines={6}
                placeholder="Enter your story..."
                placeholderTextColor="gray"
            />

                        
            <View style={styles.captionsContainer}>
                
            <TextInput
                style={styles.catptionInput}
                onChangeText={setCaptionTop}
                    value={captionTop}
                placeholderTextColor='gray'
                placeholder="Enter top text..."
            />
            <TextInput
                style={styles.catptionInput}
                onChangeText={setCaptionBottom}
                value={captionBottom}
                placeholderTextColor='gray'
                placeholder="Enter bottom text..."
                />
            </View>

            {/* <Button
                onPress={getImageResponse}
                title={loading ? 'Generating Image...' : "Generate Image"}
                color="#841584"
            /> */}

            <TouchableOpacity
                style={styles.GenImageButton}
                onPress={getImageResponse} 
            >
                <Text style={styles.genImageButtonText}>
                    {loading ? 'Creating...' : "Get Meme"}     
                </Text>
            </TouchableOpacity>


            {loading && <ActivityIndicator size="large" color="rgb(252, 126, 149)" />}
            <View style={styles.imageContainer}>
                {!imageUrl && (
                    <Text style={styles.imageText}>
                        Your Meme will be here!
                    </Text>
                )}
                {imageUrl && (
                    <View style={{ justifyContent: 'center',}} >
                       
                    <ViewShot ref={viewShotRef} >
                    <TouchableOpacity style={styles.saveImageWithText}
                            onPress={saveImageWithText}>
                            <Icon 
                                name="download"
                                color="white"
                                size={20}
                            />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: imageUrl }}
                            style={{ width: 300, height: 300, margin: 10, marginBottom: 35 }}
                            resizeMode="contain"
                        />
                        <BoldOutlineText text={captionTop} style={styles.captionTopText} />
                        <BoldOutlineText text={captionBottom} style={styles.captionBottomText} />
                        </ViewShot>
                  

                    </View>
                   
                )}

{/* 
                <TouchableOpacity
                    onPress={saveImage}>
                    <Icon style={{margin: 10}}
                        name="download"
                        color="rgb(252, 126, 149)"
                        size={20}
                    />
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
}

export default MemeGenerator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(245, 245, 245)',
        alignItems: 'center',
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
        height: 80,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: -10,
        backgroundColor: 'white',
        color: 'black'
    },
    captionsContainer: {
        flexDirection: 'column',
        width: '80%',
        marginTop: 10,
        marginBottom:10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    catptionInput: {
        borderColor: 'rgb(252, 126, 149)',
        margin: 20,
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: -10,
        backgroundColor: 'white',
        color: 'black'
    },
 
    GenImageButton: { 
        backgroundColor: 'rgb(250, 15, 89)',
        margin: 20,
        padding: 10,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center'
    },

    saveImageWithText: {
        borderColor: 'white',
        width: 35,
        height: 35,
        padding:3,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 100,
        marginLeft: '90%',
        marginBottom: -5,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,     
    },

    genImageButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },

    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin:10,
        padding: 10,
        width: '80%', 
        height: 330, 
        backgroundColor: 'white', 
        borderRadius: 10, 
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        // borderColor: 'rgb(252, 215, 222)',
        // borderStyle: 'dotted',
        // borderWidth: 1.2,
    },
    imageText: {
        color: "rgb(252, 126, 149)"
    },
    memeBoard: {
        flexDirection: 'row',
        paddingBottom: 20,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(255, 250, 240)',
    },
    meme: {
        width: 130,
        height: 130,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    captionTopText: {
        fontSize: 20,
        position: "absolute",
        top: -300, 
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        zIndex: 2,
        textShadowRadius: 2,
        textShadowColor: "black", 
        textShadowOffset: { width: -1, height: 1 }, 
    },
    
    captionBottomText: {
        fontSize: 20,
        position: "absolute",
        bottom: 60, 
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        zIndex: 2,
        textShadowColor: 'black',
        textShadowRadius: 2,
        textShadowOffset: { width: -1, height: 1 }, 
    },

    shadowText: {
        position: 'absolute',
        color: 'transparent',
        textShadowColor: 'black',
        textShadowRadius: 2,
    },

    }

)
