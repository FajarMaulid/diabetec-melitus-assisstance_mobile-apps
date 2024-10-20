import { TextInput, Button, View, Text , StyleSheet} from 'react-native';
import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = (email: string, password: string) => {
        // Handle login logic here
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
            <Button title="Login" onPress={() => handleLogin(email, password)} />
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