import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');


  const handleRegister = async (e:any) => {
        setLoading(true);
        e.preventDefault();
        try {
            let body = JSON.stringify({
                'username': username,
                'email': email,
                'password1': password,
                'password2': password2
            });

            // const res = await axios.post('http://localhost:8000/register/', {
            //     // username,
            //     email,
            //     password,
            //     password2,
            // }, {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });
            // if (res.status === 200) {
            //     console.log(res.data);
            // }

            const res = await fetch('http://localhost:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            const data = await res.json();
            if (res.ok) {
                console.log('User created successfully!', data.message);
              } else {
                console.error('Validation error:', data); // Menampilkan error
                if (data.email) {
                  console.error('Email error:', data.email);
                }
                if (data.password) {
                  console.error('Password error:', data.password);
                }
              }

        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Register</Text>
    
    <View style={styles.inputGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
            style={styles.input}
            aria-label='username'
            placeholder="username"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
            autoCapitalize="none"
            accessibilityLabel="Username input field"
        />
    </View>

    <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
            style={styles.input}
            aria-label='email'
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

    <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={password2}
            onChangeText={setPassword2}
            secureTextEntry
        />
    </View>

    { loading ? <View /> : <Button title="Register" onPress={handleRegister} /> }
</View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop:50,
    //   justifyContent: 'center',
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
})

export default Register