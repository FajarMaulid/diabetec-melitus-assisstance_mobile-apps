import { TextInput, Button, View, Text , StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e:any) => {
        setLoading(true);
        try {
            e.preventDefault();

            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: email,
                  password: password,
                }),
              });
          
              const data = await response.json();
          
              if (response.ok) {
                // Simpan token JWT di AsyncStorage (atau secure storage)
                await AsyncStorage.setItem('accessToken', data.access);
                await AsyncStorage.setItem('refreshToken', data.refresh);
                console.log('Login successful!');
                console.log('Access token:', data.access);
                console.log('Refresh token:', data.refresh);
              } else {
                console.error('Login failed:', data.detail);
              }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
    },
    input: {
        width: '80%',
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 16,
        padding: 8,
    },
})

export default Login