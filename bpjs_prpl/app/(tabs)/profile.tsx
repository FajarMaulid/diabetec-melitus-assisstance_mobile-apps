import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    //if (!result.cancelled) {
    setImage(result.uri);
    //}
  };

  const takeImage = async () => {
    // Ambil gambar dengan kamera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Opsional: memungkinkan pengeditan gambar
      aspect: [4, 3], // Opsional: rasio aspek untuk gambar
      quality: 1,  // Opsional: kualitas gambar
    });

    //if (!result.canceled) {
    // Gambar berhasil diambil, tampilkan atau lakukan sesuatu dengan hasilnya
    console.log(result);
    setImage(result.assets[0].uri); // Menyimpan URI gambar (opsional)
    //}
  };

  const handleLogOut = () => {
    router.push('/auth/login');
  };

  const handleEditProfile = () => {
    setNewUsername(items.username);
    setNewEmail(items.email);
    setModalVisible(true); // Show modal when clicking edit
    setNewName(items.name)
  };

  const handleSaveChanges = () => {
    // Simulate saving changes, you would send the data to the server
    try {
      console.log('Saved Changes:', newUsername, newName);
      const res = fetch(`${API_URL}/profile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUsername,
          name: newName,
          image: image
        }),
      }).then((res) => {
        if (res.ok) {
          console.log('Profile updated successfully!');
          window.location.reload();
        } else {
          console.error('Failed to update profile:', res.message);
        }
      });
    }
    catch (error) {
      console.error('Failed to update profile:', error);
    }
    setModalVisible(false); // Hide modal after saving

  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/profile/`);
      const data = await response.json();
      setItems(data);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }} // Ganti dengan URL gambar profilmu
        style={styles.profileImage}
      />

      <Text style={styles.username}>{items.name || items.username}</Text>

      <Text style={styles.bio}>Software Developer, Tech Enthusiast, Traveler</Text>

      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>Email: {items.email}</Text>
        <Text style={styles.contactText}>Phone: +1 234 567 890</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleEditProfile}>
          <View style={styles.editButton}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogOut}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal for editing profile */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              label="Username"
              placeholder="Username"
              value={newUsername}
              onChangeText={setNewUsername}
            />
            <TextInput
              style={styles.input}
              label="Nama"
              placeholder="Nama"
              value={newName}
              onChangeText={setNewName}
            />

            <View>

              <TouchableOpacity style={styles.saveButton} onPress={pickImage}>
                <Text style={styles.buttonText}>Choose Profile Picture</Text>
              </TouchableOpacity>

              {/* TouchableOpacity untuk mengambil gambar menggunakan kamera */}
              <TouchableOpacity style={styles.saveButton} onPress={takeImage}>
                <Text style={styles.buttonText}>Take a picture</Text>
              </TouchableOpacity>

              <View style={{ marginVertical: 10 }} />
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleSaveChanges}>
                <View style={styles.saveButton}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <View style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'linear-gradient(to right, #ff7e5f, #feb47b)', // Gradient background
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#000',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  contactContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  contactText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#ff0000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  editButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    //width: '48%',
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 10,
  },
  cancelButton: {
    //width: '48%',
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 10,
  },
});

export default Profile;

