import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, Image, View, ActivityIndicator } from 'react-native';

const PlaceholderImage = require('../assets/aaaa.jpg');

const GenImage = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [promptText, setPromptText] = useState("");
    const [loading, setLoading] = useState(false);

    const getImageResponse = () => {
        // Simulate loading
        setLoading(true);
        setTimeout(() => {
            // Use the placeholder image as the 'generated' image
            setImageUrl(PlaceholderImage);
            setLoading(false);
        }, 1000); // Simulate a delay of 1 second
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'rgb(245, 245, 245)',
            alignItems: 'center'
        }}>
            
            <Text style={{
                marginTop: 30,
                marginLeft: 20,
                marginBottom: -5,
                textAlign: "center",
                fontSize: 18,
                fontWeight: 'bold',
                color: 'rgb(250, 15, 89)'
            }}>
                Make Your Prompt</Text>
            <TextInput
                style={{
                    borderColor: 'rgb(252, 126, 149)',
                    margin: 20,
                    width: '80%',
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: -10,
                    backgroundColor:'white'
                }}
                onChangeText={text => setPromptText(text)}
                value={promptText}
                multiline={true}
                numberOfLines={6}
                placeholder="Your prompt..."
                placeholderTextColor="gray"
                color="white"
            />

            <View style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            
            <TouchableOpacity
                style={{
                    backgroundColor: 'rgb(255, 250, 240)',
                    marginTop: 10,
                        borderRadius: 10,
                        margin:3,
                    padding: 5,
                    alignItems: 'center',
                    shadowColor: "rgb(255, 204, 102)",
                    shadowOpacity: 0.8,
                    shadowRadius: 1,
                    shadowOffset: {
                        height: 3,
                        width: 3
                    }   
                }}
                onPress={getImageResponse}
            >
                    <Text style={{
                        color: 'rgb(255, 204, 102)',
                        fontWeight: 'bold',
                        fontSize: 15
                    }}>
                    Natural
                </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={{
                    backgroundColor: 'rgb(240, 245, 255)',
                    marginTop: 10,
                        borderRadius: 10,
                        margin:3,
                    padding: 5,
                    alignItems: 'center',
                    shadowColor: "rgb(2, 84, 247)",
                    shadowOpacity: 0.8,
                    shadowRadius: 1,
                    shadowOffset: {
                        height: 3,
                        width: 3
                    }   
                }}
                onPress={getImageResponse}
            >
                    <Text style={{
                        color: 'rgb(2, 84, 247)',
                        fontWeight: 'bold',
                        fontSize: 15
                    }}>
                    Monochromatic
                </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={{
                    backgroundColor: 'rgb(240, 255, 251)',
                        marginTop: 10,
                        margin:3,
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
                }}
                onPress={getImageResponse}
            >
                    <Text style={{
                        color: 'rgb(10, 252, 232)',
                        fontWeight: 'bold',
                        fontSize: 15
                    }}>
                    Fine Art
                </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={{
                    backgroundColor: 'rgb(255, 240, 254)',
                        marginTop: 10,
                    margin:3,
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
                }}
                onPress={getImageResponse}
            >
                    <Text style={{
                        color: 'rgb(247, 2, 239)',
                        fontWeight: 'bold',
                        fontSize: 15
                    }}>
                    Abstract
                </Text>
            </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={{
                    backgroundColor: 'rgb(252, 126, 149)',
                    margin: 20,
                    padding: 10,
                    borderRadius: 10,
                    width: '80%',
                    alignItems: 'center'
                }}
                onPress={getImageResponse}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
                    {loading ? 'Creating...' : "Get Portrait"}
                </Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#841584" />}
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 320, // Same as image width
                height: 400, // Same as image height
                backgroundColor: 'white', // White border background
                marginTop: 20,
                borderRadius: 3, 
                border: 'dotted rgb(252, 126, 149)',
                borderWidth: 1.2,
            }}>

            {!imageUrl && (
                <Text style={{ color: "rgb(252, 126, 149)" }}>
                    Your AI Portrait Will Be Here!
                </Text>
                )}
                
            {imageUrl && (
                    <Image
                        source={imageUrl}
                        style={{
                            width: 300,
                            height: 300,
                            marginTop: 20,
                        }}
                        resizeMode="contain"
                    />
            )
            }
                
                
            </View>
        </SafeAreaView>
    );
}

export default GenImage;