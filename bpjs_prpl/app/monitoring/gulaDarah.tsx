import { View, Text, FlatList, StyleSheet, Button, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import URL from '../../env';

const GulaDarah = () => {
  interface Item {
    hasilPengukuran: number,
    petugas: string,
    tempat: string,
    createdAt: Date,
  };

  //const URL = process.env.API_URL;

  const [domain, setDomain] = useState(URL);
  const [hasilPengukuran, setHasilPengukuran] = useState('');
  const [petugas, setPetugas] = useState('');
  const [tempat, setTempat] = useState('');

  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/myapp/guladarah/`);
      const data = await response.json();
      data.sort((a: Item, b: Item) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      setItems(data);
    };

    fetchData();
  }, []);
  const handleSubmit = async () => {
    try {
      // e.preventDefault();
      const response = await fetch(`${URL}/myapp/guladarah/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hasilPengukuran: hasilPengukuran,
          petugas: petugas,
          tempat: tempat,
        }),
      });
      console.log(response);
      const newItem = await response.json();
      if (response.ok && newItem.createdAt) {
        setItems((prevItems) => {
          const updatedItems = [...prevItems, newItem];
          return updatedItems.sort((a: Item, b: Item) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
        });
      } else {
        console.error('Submit failed:', newItem);
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setHasilPengukuran('');
      setPetugas('');
      setTempat('');
      setIsModalOpen(false);
      const fetchData = async () => {
        const response = await fetch(`${URL}/myapp/guladarah/`);
        const data = await response.json();
        setItems(data);
      };

      fetchData();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addStyle} onPress={() => setIsModalOpen(true)}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
      {isModalOpen && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text>Pengisian Gula Darah</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>x</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>
              <View>
                <Text style={styles.textInputLabel}>Hasil Pengukuran</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Hasil Pengukuran"
                  placeholderTextColor={'#BBBBBB'}
                  value={hasilPengukuran}
                  onChangeText={setHasilPengukuran}
                  keyboardType='numeric'
                />
              </View>
              <View>
                <Text style={styles.textInputLabel}>Petugas</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Petugas"
                  placeholderTextColor={'#BBBBBB'}
                  value={petugas}
                  onChangeText={setPetugas}
                />
              </View>
              <View>
                  <Text>Tempat</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tempat"
                    placeholderTextColor={'#BBBBBB'}
                    value={tempat}
                    onChangeText={setTempat}
                  />
                </View>
              <TouchableOpacity style={styles.button} onPress={handleSubmit} >
                <Text style={{ color: 'white', fontSize: 20 }}>Submit</Text>
              </TouchableOpacity>
              {/* <Button title="Submit" onPress={handleSubmit} /> */}
            </ScrollView>
          </View>
        </View>)
      }
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.text}>Hasil Pengukuran: {item.hasilPengukuran}</Text>
            <Text style={styles.text}>Petugas: {item.petugas}</Text>
            <Text style={styles.text}>Tempat: {item.tempat}</Text>
            <Text style={styles.text}>Dibuat Pada: {new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1, // Ensure that the container takes up the full screen
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
    height: '91%',
  },
  itemContainer: {
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#14B8AD',
    width: 350,
  },
  addStyle: {
    backgroundColor: '#14B8AD',
    borderRadius: 100,
    margin: 10,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    zIndex: 1,
  },
  scroll: {
    // flex: 1,
    // alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInputLabel: {
    fontSize: 20,
    color: 'steelblue',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#14B8AD',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
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
  closeButton: {
    marginBottom: 2,
  },
  closeText: {
    fontSize: 20,
  },
  input: {
    width: '100%',
    height: 35,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    marginBottom: 10,
    padding: 8,
  },
  text: {
    fontSize: 15,
    padding: 5,
    color: 'white',
  }
});

export default GulaDarah;
