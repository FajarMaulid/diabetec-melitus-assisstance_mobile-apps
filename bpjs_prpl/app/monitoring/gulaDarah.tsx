import { View, Text, FlatList, StyleSheet, Button, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Confirm from '@/components/confirm';
import Chart from '@/components/chart';

const GulaDarah = () => {
  interface Item {
    hasilPengukuran: number,
    petugas: string,
    tempat: string,
    createdAt: Date,
  };

  const URL = process.env.EXPO_PUBLIC_API_URL;

  const [domain, setDomain] = useState(URL);
  const [hasilPengukuran, setHasilPengukuran] = useState('');
  const [petugas, setPetugas] = useState('');
  const [tempat, setTempat] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [idDelete, setIdDelete] = useState('');

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
    if (!hasilPengukuran || !petugas || !tempat) {
      setError('Semua field harus diisi');
      return;
    };
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
        console.log('Submit failed:', newItem);
      }
    } catch (error) {
      console.log('Submit error:', error);
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

  const deleteItem = (id: string) => {
    setIsConfirmOpen(true);
    setIdDelete(id);
  }

  const getBloodSugarStatus = (result: string) => {
    const value = parseFloat(result);
    if (isNaN(value)) return { status: 'Tidak Diketahui', color: '#FFA500' };

    if (value < 70) return { status: 'Rendah', color: '#FF6B6B' };
    if (value >= 70 && value <= 99) return { status: 'Normal', color: '#4CAF50' };
    if (value >= 100 && value <= 125) return { status: 'Prediabetes', color: '#FFC107' };
    return { status: 'Diabetes', color: '#FF5722' };
  };

  const processedItems = items.map(item => {
    const { status, color } = getBloodSugarStatus(item.hasilPengukuran);
    return {
      ...item,
      status,
      color,
    };
  });

  const renderBloodSugarItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.hasilText}>Hasil Pengukuran: {item.hasilPengukuran}</Text>
        <View style={{ backgroundColor: item.color, width: '30%', borderRadius: 20, alignItems: 'center', marginTop: 10, marginRight: 10, justifyContent: 'center' }}>
          <Text style={[styles.statusText]}>{item.status}</Text>
        </View>
      </View>
      <View style={{ marginBottom: 10, flexDirection: 'column', justifyContent:'center' }}>
        <View>
          <Text style={styles.text}>Petugas: {item.petugas}</Text>
          <Text style={styles.text}>Tempat: {item.tempat}</Text>
          <Text style={styles.text}>Dibuat Pada: {new Date(item.createdAt).toLocaleString()}</Text>
        </View>
        <View style={{ justifyContent:'flex-end', alignSelf:'flex-end' }}>
          <TouchableOpacity onPress={() => deleteItem(item._id)}>
            <MaterialCommunityIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const chartData = items.map(item => parseFloat(item.hasilPengukuran) || 0).reverse();
  const chartLabels = items.map(item => new Date(item.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
  })).reverse();

  const closeOpen = () => {
    setIsConfirmOpen(isConfirmOpen => !isConfirmOpen);
  }

  const afterDelete = () => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/myapp/guladarah/`);
      const data = await response.json();
      setItems(data);
    };
    fetchData();
  }

  return (
    <View style={styles.container}>
      <Chart labels={chartLabels} data={chartData} />
      <TouchableOpacity style={styles.addStyle} onPress={() => setIsModalOpen(true)}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
      {isConfirmOpen && 
        <Confirm 
          text='Apakah Anda ingin menghapus ini?' 
          url={`${URL}/myapp/guladarah/delete`} 
          id={idDelete} 
          closeOpen={closeOpen} 
          after={afterDelete} />}
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
                <Text style={styles.textInputLabel}>Hasil Pengukuran <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-end' }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Hasil Pengukuran"
                    placeholderTextColor={'#BBBBBB'}
                    value={hasilPengukuran}
                    onChangeText={setHasilPengukuran}
                    keyboardType='numeric'
                  />
                  <Text style={styles.unitText}>mg/dL</Text>
                </View>
              </View>
              <View>
                <Text style={styles.textInputLabel}>Petugas <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Petugas"
                  placeholderTextColor={'#BBBBBB'}
                  value={petugas}
                  onChangeText={setPetugas}
                />
              </View>
              <View>
                <Text style={styles.textInputLabel}>Tempat <Text style={{ color: 'red' }}>*</Text></Text>
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

        data={processedItems} // Menggunakan data yang sudah diproses
        renderItem={renderBloodSugarItem} // Menggunakan renderItem untuk menampilkan setiap item
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada data gula darah</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1, // Ensure that the container takes up the full screen
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
    height: '92%',
    top: '3%',
  },
  itemContainer: {
    marginBottom: 10,
    borderRadius: 15,
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
    elevation: 100,
    position: 'relative',
  },
  closeButton: {
    marginBottom: 2,
  },
  closeText: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    width: '100%',
    height: 35,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    marginBottom: 10,
    padding: 8,
  },
  unitText: {
    paddingLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  text: {
    marginLeft: 10,
    fontSize: 14,
    color: 'white',
  },
  statusText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  hasilText: {
    marginLeft: 10,
    fontSize: 16,
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default GulaDarah;
