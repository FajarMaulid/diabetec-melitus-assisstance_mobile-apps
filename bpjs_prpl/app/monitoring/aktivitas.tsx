import { View, Text, FlatList, StyleSheet, Button, TextInput, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import Confirm from '@/components/confirm';
import Chart from '@/components/chart';

const Aktivitas = () => {
  interface Item {
    _id: string;
    olahraga: string;
    durasi: number;
    kaloriTerbakar: number;
    createdAt: Date;
  }

  const URL = process.env.EXPO_PUBLIC_API_URL;

  const [domain, setDomain] = useState(URL);
  const [aktivitas, setAktivitas] = useState('');
  const [durasi, setDurasi] = useState('');
  const [kaloriTerbakar, setKaloriTerbakar] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [error, setError] = useState('');
  const [idDelete, setIdDelete] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/myapp/aktivitas/`);
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

  const getSportIcon = (sport: string) => {
    const sportIcons: { [key: string]: string } = {
      'Lari': 'running',
      'Sepeda': 'bicycle',
      'Bersepeda': 'bicycle',
      'Renang': 'swimmer',
      'Berenang': 'swimmer',
      'Yoga': 'dumbbell',
      'Push Up': 'walking'
    };
    return sportIcons[sport] || 'walking';
  };

  const deleteItem = (id: string) => {
    setIsConfirmOpen(true);
    setIdDelete(id);
  }

  const renderActivityItem = ({ item }: { item: Item }) => (
    <TouchableOpacity style={styles.activityCard}>
      <View style={styles.iconContainer}>
        <FontAwesome5
          name={getSportIcon(item.olahraga)}
          size={30}
          color="white"
        />
      </View>
      <View style={styles.activityDetails}>
        <Text style={styles.sportName}>{item.olahraga}</Text>
        <Text style={styles.detailText}>Durasi: {item.durasi} menit</Text>
        <Text style={styles.detailText}>Kalori: {item.kaloriTerbakar} kkal</Text>
        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => deleteItem(item._id)}>
          <MaterialCommunityIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleSubmit = async () => {
    if (!aktivitas || !durasi) {
      setError('Aktivitas dan durasi harus diisi');
      return;
    }
    try {
      // e.preventDefault();
      const response = await fetch(`${URL}/myapp/aktivitas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'olahraga': aktivitas,
          durasi: durasi,
          kaloriTerbakar: kaloriTerbakar,
        }),
      });
      //console.log(response);
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
        //console.error('Submit failed:', newItem);
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setAktivitas('');
      setDurasi('');
      // setKaloriTerbakar('');
      setIsModalOpen(false);
      const fetchData = async () => {
        const response = await fetch(`${URL}/myapp/aktivitas/`);
        const data = await response.json();
        setItems(data);
      };

      fetchData();
    }
  };

  const chartData = items.map(item => parseFloat(item.kaloriTerbakar) || 0).reverse();
  const chartLabels = items.map(item => new Date(item.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
  })).reverse();

  const closeOpen = () => {
    setIsConfirmOpen(isConfirmOpen => !isConfirmOpen);
  }

  const afterDelete = () => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/myapp/aktivitas/`);
      const data = await response.json();
      setItems(data);
    };
    fetchData();
  }

  return (
    <View style={styles.container}>
      <Chart data={chartData} labels={chartLabels} />
      <TouchableOpacity style={styles.addStyle} onPress={() => setIsModalOpen(true)}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        visible={isConfirmOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={closeOpen}
      >
        <View style={styles.overlay}>
        <Confirm id={idDelete}
          text="Apakah Anda ingin menghapus aktivitas ini?"
          url={`${URL}/myapp/aktivitas/delete`}
          closeOpen={closeOpen}
          after={afterDelete}
        />
        </View>
      </Modal>
      <Modal
        visible={isModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text>Pengisian Aktivitas</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>x</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: 'red' }}>{error}</Text>
            <ScrollView contentContainerStyle={styles.scroll}>
              <View>
                <Text style={styles.textInputLabel}>Aktivitas <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Aktivitas"
                  placeholderTextColor={'#BBBBBB'}
                  value={aktivitas}
                  onChangeText={setAktivitas}
                />
              </View>
              <View>
                <Text style={styles.textInputLabel}>Durasi (menit) <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-around' }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Durasi"
                    placeholderTextColor={'#BBBBBB'}
                    value={durasi}
                    onChangeText={setDurasi}
                    keyboardType='numeric'
                  />
                  <Text style={styles.unitText}>menit</Text>
                </View>
              </View>
              <View>
                <Text style={styles.textInputLabel}>Kalori Terbakar</Text>
                <Text style={{ fontSize: 12 }}>Apabila kosong akan otomatis diisi oleh AI</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-end' }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Kalori Terbakar"
                    placeholderTextColor={'#BBBBBB'}
                    value={kaloriTerbakar}
                    onChangeText={setKaloriTerbakar}
                    keyboardType='numeric'
                  />
                  <Text style={styles.unitText}>kkal</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSubmit} >
                <Text style={{ color: 'white', fontSize: 20 }}>Submit</Text>
              </TouchableOpacity>
              {/* <Button title="Submit" onPress={handleSubmit} /> */}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <FlatList
        data={items}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada data aktivitas</Text>
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
    paddingTop: 100,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInputLabel: {
    fontSize: 20,
    color: 'steelblue',
  },
  unitText: {
    paddingLeft: 8,
    fontSize: 16,
    color: '#333',
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
  text: {
    fontSize: 15,
    padding: 5,
    color: 'white',
  },
  activityCard: {
    width: 350,
    flexDirection: 'row',
    backgroundColor: '#14B8AD',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityDetails: {
    //flex: 1,
  },
  sportName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: 'white',
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
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

export default Aktivitas;
