import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Button, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
      base64: true,
    });

    //console.log(result);

    //if (!result.cancelled) {
    setImage(result.assets[0].base64);
    //}
  };

  const takeImage = async () => {
    // Ambil gambar dengan kamera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    //if (!result.canceled) {
    // Gambar berhasil diambil, tampilkan atau lakukan sesuatu dengan hasilnya
    //console.log(result);
    setImage(result.assets[0].base64); // Menyimpan URI gambar (opsional)
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
  //console.log(image);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image == null? `data:image/png;base64,${items.image}` : `data:image/png;base64,${image}`}} // Ganti dengan URL gambar profilmu
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
          <View style={styles.pictureButton}>
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
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>x</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
              <View>
                <Text style={styles.textInputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={newUsername}
                  onChangeText={setNewUsername}
                />
              </View>

              <View>
                <Text style={styles.textInputLabel}>Nama</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nama"
                  value={newName}
                  onChangeText={setNewName}
                />
              </View>

              <View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.pictureButton} onPress={pickImage}>
                    <Text style={styles.buttonText}><MaterialCommunityIcons size={24} name="image" /></Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.pictureButton} onPress={takeImage}>
                    <Text style={styles.buttonText}><MaterialCommunityIcons size={24} name="camera" /></Text>
                  </TouchableOpacity>
                </View>

                <View style={{ marginVertical: 10, alignItems:'center' }}>
                {image && <Image source={{ uri: `data:image/png;base64,${image}` }} style={{ width: 200, height: 200, alignItems:'center' }} />}
                </View>
              </View>

              {/*<View style={styles.modalButtons}>*/}
                <TouchableOpacity onPress={handleSaveChanges}>
                  <View style={styles.pictureButton}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </View>
                </TouchableOpacity>

                {/*<TouchableOpacity onPress={() => setModalVisible(false)}>
                  <View style={styles.cancelButton}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </View>
                </TouchableOpacity>*/}
              {/*</View>*/}
            </ScrollView>
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
    paddingHorizontal: 5,
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
    //justifyContent: 'space-between',
    justifyContent: 'space-evenly',
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
    padding : 10,
    //width: '48%',
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 10,
  },
  closeButton: {
    marginBottom: 2,
  },
  closeText: {
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    zIndex: 1,
  },
  scroll: {
    //flex: 1,
    // alignItems: 'center',
  },
  textInputLabel: {
    fontSize: 20,
    color: 'steelblue',
  },
  modal: {
    marginTop: 100,
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    position: 'relative',
  },
  text: {
    fontSize: 15,
    padding: 5,
    color: 'white',
  },
  pictureButton: {
    alignItems: 'center',
    backgroundColor: '#14B8AD',
    padding: 10,
    borderRadius: 5,
    marginVertical: 3,
  },
});

export default Profile;


