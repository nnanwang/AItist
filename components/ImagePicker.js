import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import {OpenAI} from "openai";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Alert, TouchableOpacity, FlatList } from 'react-native';
import ImageViewer from './ImageViewer';
import Button from './Button';
import axios from 'axios';
import OPENAI_API_KEY from './open_api_key'; // Ensure this file securely handles your API key


const PlaceholderImage = require('../assets/splash.png');

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDescription, setImageDescription] = useState('');
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [loading, setLoading] = useState(true);


  const getDescriptionForImage = async () => {
    setLoading(true);

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Describe this image." },
                {
                  type: "imageUri",
                  image_url: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                  }
                }
              ]
            }
          ],
          max_tokens: 100
        })
      });

      const data = await response.json();
      setImageDescription(data.choices[0].message.content.text); // Update the state with the response
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


    const pickImageAsync = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        quality: 1,
      });
    
      if (!result.canceled && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        setSelectedImage(selectedImageUri);
        setShowAppOptions(true);

        // get description for the image
        const description = await getDescriptionForImage(selectedImageUri);
        console.log('Description:', description);

        setImageDescription(description);
      } else {
        Alert.alert('No Image Selected', 'You did not select any image.');
      }
    };
    

    return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
              <ImageViewer
                  placeholderImageSource={PlaceholderImage}
                  selectedImage={selectedImage}
          />
          <Text style={styles.descriptionText}>This is a test!</Text>
          <Text style={styles.descriptionText}>{loading ? 'Loading...' : imageDescription}</Text>

          </View>
        {showAppOptions ? (
        <View />
      ) : (
            <View style={styles.footerContainer}>            
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
        alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
      optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
  },
  descriptionText: {
    marginTop: 20,
    padding: 10,
    color:'yellow'
    // Add additional styling for the description text
  },

});


    