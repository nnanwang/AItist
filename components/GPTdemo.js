import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, FlatList, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import open_api_key from './open_api_key';

const APIdemo = () => {
    const [data, setData] = useState([]);
    const [promptText, setPromptText] = useState("");
    const [prompt, setPrompt] = useState("what is three times five?");
    const [loading, setLoading] = useState(true);

    const getResponse = async () => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                },
                {
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + open_api_key,
                    },
                }
            );
            setData(response.data); // Set response data
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    useEffect(() => {
        if (prompt) { // Only get response if prompt is not empty
            getResponse();
        }
    }, [prompt]);

    const ChatResponse = ({ role, content }) => (
        <View style={{ backgroundColor: 'honeydew', margin: 10, padding: 30 }}>
            <Text style={{ fontSize: 20, color: 'darkturquoise', marginBottom: 10, textAlign: 'center' }}>
                ChatGPT says:
            </Text>
            <Text style={{ backgroundColor: 'white', fontSize: 18, marginTop: 20 }}>{content}</Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, fontSize: 24, margin: 50 }}>
            <Text style={{ color: "darkturquoise", marginLeft: 10, fontSize: 30, fontWeight: 'bold' }}>OpenAI ChatGPT</Text>
            <Text style={{ marginTop: 30, marginLeft: 10 }}>Enter your prompt:</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gainsboro', borderWidth: 1, borderRadius: 10, padding: 10, margin: 10 }}
                onChangeText={text => setPromptText(text)}
                value={promptText}
            />

            <TouchableOpacity
                style={{ backgroundColor: 'darkturquoise', padding: 10, margin: 10, borderRadius: 10, alignItems: 'center' }}
                onPress={() => {
                    setLoading(true);
                    setData([]); // Clear previous data
                    setPrompt(promptText); // Update prompt with user input
                }}
                disabled={loading}
                accessibilityLabel="Send prompt to OpenAI">
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
                    {loading ? 'Loading...' : 'Submit'}
                </Text>
            </TouchableOpacity>

            <FlatList
                style={{ marginTop: 30 }}
                data={data.choices}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <ChatResponse {...item.message} />}
            />
        </SafeAreaView>
    );
};

export default APIdemo;

