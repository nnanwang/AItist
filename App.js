import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ImageBackground, TouchableOpacity } from 'react-native';
import { useFonts } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';


import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ImagePicker from './components/ImagePicker';
import AIPortrait from './components/AIPortrait';
import RandomPick from './components/RandomPick';
import MoodGenerator from './components/MoodGenerator';
import MemeArtist from './components/MemeArtist';

const Stack = createNativeStackNavigator();
const HomePageImage = require('./assets/home.jpg');

const BoldOutlineText = ({ text, style }) => {
  // Shadow offset directions
  const shadwOffsets = [
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

const Theme = {
  dark: false,
  colors: {
    primary: 'rgb(245, 2, 83)',
    background: 'white',
    card: 'rgb(250, 15, 89)',
    text: 'rgba(255, 255, 255, 0.6)',
    border: 'white',
    notification: 'white',
    justifyContent: "center"
  }
};

const HomeScreen = ({ navigation }) => {
  let [fontsLoaded, fontError] = useFonts({
    Agbalumo: require('./assets/fonts/Agbalumo-Regular.ttf'),
    Monoton: require('./assets/fonts/Monoton-Regular.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <LinearGradient
    colors={['rgb(25, 5, 247)', 'rgb(250, 15, 89)', 'rgb(250, 206, 62)']}
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    }}
  >
    <View style={{
      flex: 1,
      // backgroundImage: 'linear-gradient(to bottom, rgb(25, 5, 247),  rgb(250, 15, 89), rgb(250, 206, 62)'
    }}>

      <ImageBackground
        source={HomePageImage}
        style={{ width: "100%", height: 280, alignItems: "left", justifyContent: "left" }}>
        <Text
          style={{
            fontSize: 32,
            color: "white",
            margin: 30,
            fontWeight: 'bold',
            textShadowColor: 'black',
            textShadowRadius: 2,
            textShadowOffset: { width: 1, height: 1 }
          }}>
            AI Image Assistant{"\n"}
            to Vivid{"\n"}
            Your Social Media
        </Text>

      </ImageBackground>
      
      <View style={{ flexDirection: 'row', justifyContent: "center", marginTop: 20 }}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Creat Your AI Portrait')}>
          <Icon
            style={styles.icon}
            name="user-circle-o"
            color="white"
            size={25}
          />
          <Text style={styles.homeButtonText}>AI Portrait</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Create Memes for Your Story')}>
          <Icon
            style={styles.icon}
            name="image"
            color="white"
            size={25}
          />
          <Text style={styles.homeButtonText}>Meme Artist</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: "center", marginTop: -20 }}>
      <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Generate Images for Your Mood')}>
          <Icon
            style={styles.icon}
            name="smile-o"
            color="white"
            size={25}
          />
          <Text style={styles.homeButtonText}>Mood Generator</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Pick a Random Image')}>
          <Icon
            style={styles.icon}
            name="braille"
            color="white"
            size={25}
          />
          <Text style={styles.homeButtonText}>Random Picker</Text>
        </TouchableOpacity>
        
        {/* <Button
          title="generate image"
          onPress={() => navigation.navigate('GenImage')} 
        />
        <Button
          title="generate Test"
          onPress={() => navigation.navigate('GenTest')} 
        /> */}


      </View>
{/* logo */}
      <View style={{ alignItems: "center", marginTop: 50,}}>
        <Text style={{
          fontSize: 40,
          // textShadowColor: 'rgba(255, 244, 207, 0.4)',
          textShadowColor: 'rgb(250, 15, 89)',
          textShadowRadius: 4,
          textShadowOffset: {
            width: 3, height: 4
          }
        }}>
          <Text style={{ color: 'white', fontFamily: 'Monoton' }}>AI</Text>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>tist</Text>
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.copyright}>Copyright @ Nan Wang 2023</Text>
        </View>

      </View>
      </LinearGradient>
  );
};

const MyStack = () => {

  return (
    <NavigationContainer
      theme={Theme}
    >
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          // options={{
          //   // headerTintColor: '#fff', 
          //   title: 'AI Image Assistant'
          // }}
          component={HomeScreen}    
          
        />
        <Stack.Screen name="Pick a Random Image"
          component={RandomPick}
          options={{
            headerTintColor: '#fff', 
          }}
        />
        <Stack.Screen name="Creat Your AI Portrait"
          component={AIPortrait}
          options={{
            headerTintColor: '#fff'
          }}
        />
        <Stack.Screen name="Generate Images for Your Mood"
          component={MoodGenerator}
          options={{
            headerTintColor: '#fff'
          }}
        />
        <Stack.Screen name="Create Memes for Your Story"
          component={MemeArtist}
          options={{
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    marginTop: 30,
    width: 160,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 244, 207, 0.4)', // Add background color for visibility
  },
  homeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  icon: {
    padding: 10,
  },
  footer: {
    flex:1,
    justifyContent: "flex-end",
  },
  copyright: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 45
  },

shadowText: {
    position: 'absolute',
    color: 'transparent',
    textShadowColor: 'black',
    textShadowRadius: 2,
},
});

export default MyStack;
