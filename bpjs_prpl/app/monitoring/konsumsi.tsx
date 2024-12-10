import { View, Text, FlatList, StyleSheet, Button, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const Konsumsi = () => {
  interface Item {
    _id: string;
    tipe: string;
    nama: string;
    massaOrVol: number;
    kaloriMasuk: number;
    createdAt: Date;
  }

  const URL = process.env.EXPO_PUBLIC_API_URL;

  const [domain, setDomain] = useState(URL);
  const [tipe, setTipe] = useState('');
  const [nama, setNama] = useState('');
  const [massaOrVol, setMassaOrVol] = useState('');
  const [kaloriMasuk, setKaloriMasuk] = useState('');

  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/myapp/konsumsi/`);
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

  const screenWidth = Dimensions.get('window').width;

  const processDataForChart = () => {
    if (!items || items.length === 0) {
      // Jika items tidak ada atau kosong, kembalikan data default
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      };
    }

    const labels = items
      .map(item =>
        new Date(item.createdAt).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
        })
      ).reverse(); // Membalik urutan labels

    const data = items
      .map(item => parseFloat(item.kaloriMasuk) || 0)
      .reverse(); // Membalik urutan data

    return {
      labels: labels.slice(-5), // Hanya gunakan 5 data terbaru
      datasets: [
        {
          data: data.slice(-5), // Data untuk 5 pengukuran terakhir
          strokeWidth: 2, // Ketebalan garis
          color: () => `rgba(20, 184, 173, 1)`, // Warna garis
        },
      ],
    };
  };

  const getFoodTypeDetails = (type: string) => {
    const foodTypeIcons: {[key: string]: {icon: string, color: string}} = {
      'Makanan': { icon: 'food', color: '#4CAF50' },
      'Minuman': { icon: 'cup', color: '#2196F3' },
      'Snack': { icon: 'food-apple', color: '#FF9800' },
      'Buah': { icon: 'fruit-watermelon', color: '#E91E63' },
      'Sayur': { icon: 'leaf', color: '#8BC34A' }
    };
    return foodTypeIcons[type] || { icon: 'food-variant', color: '#9C27B0' };
  };

  const renderKonsumsiItem = ({ item }: { item: Item }) => {
    const { icon, color } = getFoodTypeDetails(item.tipe);

    return (
      <TouchableOpacity style={styles.konsumsiCard}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}50` }]}>
          <MaterialCommunityIcons name={icon} size={30} color={color} />
        </View>
        <View style={styles.konsumsiDetails}>
          <View style={styles.headerRow}>
            <Text style={styles.namaText}>{item.nama}</Text>
            <View style={[styles.tipeBadge, { backgroundColor: color }]}>
              <Text style={styles.tipeText}>{item.tipe}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>
              Massa/Volume: {item.massaOrVol}g
            </Text>
            <Text style={styles.kaloriText}>
              {item.kaloriMasuk} kcal
            </Text>
          </View>
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
      </TouchableOpacity>
    );
  };

  const handleSubmit = async () => {
    try {
      // e.preventDefault();
      const response = await fetch(`${URL}/myapp/konsumsi/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'tipe': tipe,
          'nama': nama,
          'massaOrVol': parseInt(massaOrVol) || '',
          'kaloriMasuk': kaloriMasuk
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
      setTipe('');
      setNama('');
      setMassaOrVol('');
      setKaloriMasuk('');
      setIsModalOpen(false);
      const fetchData = async () => {
        const response = await fetch(`${URL}/myapp/konsumsi/`);
        const data = await response.json();
        setItems(data);
      };

      fetchData();
    }
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={processDataForChart()}
        width={screenWidth - 20} // Lebar grafik (dengan margin)
        height={220} // Tinggi grafik
        chartConfig={{
          //backgroundColor: '#e26a00',
          backgroundGradientFrom: '#14B8AD',
          //backgroundGradientTo: '#00d4ff',
          decimalPlaces: 1, // Angka desimal
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 0 },
          propsForDots: {
            r: '6',
            //strokeWidth: '2',
            stroke: '#14B8AD',
          },
        }}
        bezier
        style={{ marginVertical: 0, borderRadius: 8 }}
      />
      <TouchableOpacity style={styles.addStyle} onPress={() => setIsModalOpen(true)}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
      {isModalOpen && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text>Pengisian Konsumsi</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>x</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>
              <View>
                <Text style={styles.textInputLabel}>Tipe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tipe"
                  placeholderTextColor={'#BBBBBB'}
                  value={tipe}
                  onChangeText={setTipe}
                />
              </View>
              <View>
                <Text style={styles.textInputLabel}>Nama</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nama"
                  placeholderTextColor={'#BBBBBB'}
                  value={nama}
                  onChangeText={setNama}
                  keyboardType='numeric'
                />
              </View>
              <View>
                <Text style={styles.textInputLabel}>Massa Atau Volume</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Massa Atau Volume"
                  placeholderTextColor={'#BBBBBB'}
                  value={massaOrVol}
                  onChangeText={setMassaOrVol}
                  keyboardType='numeric'
                />
              </View>
              <View>
                <Text style={styles.textInputLabel}>Kalori Masuk</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Kalori Masuk"
                  placeholderTextColor={'#BBBBBB'}
                  value={kaloriMasuk}
                  onChangeText={setKaloriMasuk}
                  keyboardType='numeric'
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
        renderItem={renderKonsumsiItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada data konsumsi</Text>
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
  },
  konsumsiCard: {
    width: 350,
    flexDirection: 'row',
    backgroundColor: '#14B8AD',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  konsumsiDetails: {
    //flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  namaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginRight: 10,
  },
  tipeBadge: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tipeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  kaloriText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Konsumsi;
