import { TextInput, Button, View, Text , StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const Login = () => {
    const navigation = useNavigation<NavigationProp<any>>();
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
                navigation.navigate('home');
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
            <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            </View>
            <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            </View>
            <View style={styles.buttonGroup}>
            <View style={styles.buttonGroupLeftContainer}>
                <Text>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('register')}>
                    <Text style={{ color: "blue" }}>Register</Text>
                </TouchableOpacity>
                </View>
                <Button title="Login" onPress={handleLogin} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:50,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        margin: 24,
    },
    inputGroup: { 
      width: '80%',         
      marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        padding: 8,
    },
    label: {
      marginBottom: 4,
      fontWeight: 'bold',
  },
  buttonGroup: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%',
    marginBottom: 10,
  },
  buttonGroupLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default Login