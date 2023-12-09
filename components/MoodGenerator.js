import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Keyboard } from 'react-native';

import open_api_key from './open_api_key';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const MoodGenerator = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [promptText, setPromptText] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedMood, setSelectedMood] = useState("");

    const handleMoodSelection = (mood) => {
        setSelectedMood(mood);
        setPromptText(`${promptText} Feeling: ${mood}.`);

    }

    const saveImage = async () => {
        let fileUri = FileSystem.documentDirectory + "image.jpg";
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        try {
            // Replace 'imageDownloadUri' with the actual URI of your image
            await FileSystem.downloadAsync(imageUrl, fileUri)
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync("Download", asset, false);
            Alert.alert("Saved!");
        } catch (error) {
            console.error("Error saving image", error);
            Alert.alert("Error saving image");
        }
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
                prompt: promptText + "According the feeling, generate an image.",
                n: 1,
                size: "1024x1792",
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

    return (
        <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
                How do you feel today?
            </Text>

            <View style={styles.moodContainer}>
                <TouchableOpacity
                style={styles.happy}
                onPress={() => handleMoodSelection("happy")}
            >
                    <Text style={styles.happyText}>
                    Happy
                    </Text>
                    <Icon
                        style={{ margin: 10 }}
                        name="smile-o"
                        color="rgb(255, 204, 102)"
                        size={30}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.sad}
                onPress={() => handleMoodSelection("sad")}
            >
                    <Text style={styles.sadText}>
                    Sad
                    </Text>
                    <Icon
                        style={{ margin: 10 }}
                        name="frown-o"
                        color="rgb(2, 84, 247)"
                        size={30}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.confused}
                onPress={() => handleMoodSelection("confused")}
            >
                    <Text style={styles.confusedText}>
                    Confused
                    </Text>
                    <Icon
                        style={{ margin: 10 }}
                        name="eye-slash"
                        color="rgb(10, 252, 232)"
                        size={30}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.angry}
                onPress={() => handleMoodSelection("angry")}
            >
                    <Text style={styles.angryText}>
                    Angry
                    </Text>
                    <Icon
                        style={{ margin: 10 }}
                        name="thumbs-o-down"
                        color="rgb(247, 2, 239)"
                        size={30}
                    />
            </TouchableOpacity>
            </View>
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



            <TouchableOpacity
                style={styles.GenImageButton}
                onPress={getImageResponse}
            >
                <Text style={styles.genImageButtonText}>
                    {loading ? 'Creating...' : "Get Image"}     
                </Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="rgb(252, 126, 149)" />}
            <View style={styles.imageContainer}>
                {!imageUrl && (
                    <Text style={styles.imageText}>
                        Your AI Mood Image Will Be Here!
                    </Text>
                )}
                {imageUrl && (
                    <View style={{ justifyContent: 'center',}} >
                        <TouchableOpacity style={styles.saveImageButton}
                            onPress={saveImage}>
                            <Icon 
                                name="download"
                                color="white"
                                size={20}
                            />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: imageUrl }}
                            style={{ width: 400, height: 370, marginTop: 5 }}
                            resizeMode="contain"
                            />
                    </View>
                   
                )}
              
            </View>
        </SafeAreaView>
    );
}

export default MoodGenerator;

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
        height: 100,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: -10,
        backgroundColor: 'white',
        color: 'black'
    },
    moodContainer: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom:10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    happy: {
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
        width: 75,
        shadowOffset: {
            height: 3,
            width: 3
        }   
    },
    happyText: {
        color: 'rgb(255, 204, 102)',
        fontWeight: 'bold',
        fontSize: 15   
    },
    sad: {
        backgroundColor: 'white',
        borderColor: 'rgb(2, 84, 247)',
        borderWidth: 2,
        borderStyle: 'solid',
        marginTop: 10,
        borderRadius: 10,
        margin: 6,
        width: 75,
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
    sadText: {
        color: 'rgb(2, 84, 247)',
        fontWeight: 'bold',
        fontSize: 15
    },
    confused: {
        backgroundColor: 'white',
        borderColor: 'rgb(10, 252, 232)',
        borderWidth: 2,
        borderStyle: 'solid',
        marginTop: 10,
        margin:6,
        borderRadius: 10,
        width: 85,
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
    confusedText: {
        color: 'rgb(10, 252, 232)',
        fontWeight: 'bold',
        fontSize: 15
    },
    angry: {
        backgroundColor: 'white',
        borderColor: 'rgb(247, 2, 239)',
        borderWidth: 2,
        borderStyle: 'solid',
        marginTop: 10,
        margin:6,
        borderRadius: 10,
        width: 75,
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
    angryText: {
        color: 'rgb(247, 2, 239)',
        fontWeight: 'bold',
        fontSize: 15
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
        padding: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 100,
        marginLeft: '95%',
        marginTop: -25,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
    }

})
