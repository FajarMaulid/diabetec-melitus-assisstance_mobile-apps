import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, gestureHandlerRootHOC } from 'react-native-gesture-handler';

const Register = () => {
  const URL = process.env.EXPO_PUBLIC_API_URL;
  const navigation = useNavigation<NavigationProp<any>>();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleRegister = async (e: any) => {
    setError('');
    if (password !== password2) {
      setError('Password mismatch!');
      return;
    }
    if (email === '' || password.length < 8 || username === '') {
      setError('Input is to short!');
      return;
    }
    setLoading(true);
    e.preventDefault();
    try {
      let body = JSON.stringify({
        'username': username,
        'email': email,
        'password1': password,
        'password2': password2
      });

      const res = await fetch(`${URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      const data = await res.json();
      if (res.ok) {
        console.log('User created successfully!', data.message);
        navigation.navigate('login');
      } else {
        console.error('Validation error:', data); // Menampilkan error
        if (data.email) {
          console.error('Email error:', data.email);
        }
        if (data.password) {
          console.error('Password error:', data.password);
        }
        if (data.non_field_errors[0]) {
          setError(data.non_field_errors[0]);
        }
      }

    } catch (error: any) {
      console.error('Login error:', error);
      //if (error.response.data.non_field_errors) {
      //  setError(error.response.data.non_field_errors[0]);
      //  setError('Login failed');
      //}
      if (error) {
        setError(error.detail);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text>{error}</Text>

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
        <TouchableOpacity
          //style={styles.toggleButton}
          onPress={() => setShowPassword(!showPassword)}  // Toggle the password visibility
        >
          <Text 
            //style={styles.toggleButtonText}
          >
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
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
        <TouchableOpacity
          //style={styles.toggleButton}
          onPress={() => setShowPassword2(!showPassword2)}  // Toggle the password visibility
        >
          <Text 
            //style={styles.toggleButtonText}
          >
            {showPassword2 ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonGroup}>
        <View style={styles.buttonGroupLeftContainer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text style={{ color: "blue" }}>Login</Text>
          </TouchableOpacity>
        </View>
        <Button title="Register" onPress={handleRegister} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
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

export default gestureHandlerRootHOC(Register)
