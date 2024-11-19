import { router } from 'expo-router';
import React from 'react';
import { View, Text, Image, StyleSheet, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Profile = () => {
  const handleLogOut = () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ?si=hb8HleuKY9qYc3Hr&t=1';
    Linking.openURL(url).catch((err) => console.error('Failed to open URL', err));
  }
  return (
    <View style={styles.container}>
      <Image 
        source={{uri: '../../assets/images/profile.png'}} // Ganti dengan URL gambar profilmu
        style={styles.profileImage}
      />

      <Text style={styles.username}>John Doe</Text>

      <Text style={styles.bio}>Software Developer, Tech Enthusiast, Traveler</Text>

      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>Email: johndoe@example.com</Text>
        <Text style={styles.contactText}>Phone: +1 234 567 890</Text>
      </View>
      <TouchableOpacity onPress={handleLogOut}>
        <View style={styles.button}>
          <Text style={{ color:'white', padding:10 }}> LogOut </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    marginTop: 50,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#ff0000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default Profile;
