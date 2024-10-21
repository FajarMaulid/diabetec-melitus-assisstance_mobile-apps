import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios';

const Asal = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsal = async (e:any) => {
        setLoading(true);
        e.preventDefault();
        try {
            let body = JSON.stringify({
                "email": email,
            });

            // const res = await axios.post('http://localhost:8000/Asal/', {
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

            fetch('http://localhost:8000/find/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            }).then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    alert('Asal failed');
                    throw res.json();
                }
            }).then(json => console.log(json))

        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none">        
        </TextInput>
        <Button title="Asal" onPress={handleAsal} />
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

export default Asal