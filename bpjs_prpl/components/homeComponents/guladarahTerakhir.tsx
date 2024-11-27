import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const GuladarahTerakhir = () => {
  interface Item {
    createdAt: string | number | Date;
    hasilPengukuran: string;
    petugas: string;
    tempat: string;
    _id: string;
  }

  const URL = process.env.EXPO_PUBLIC_API_URL;
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/myapp/guladarah/terakhir/`);
        const data = await response.json();
        const dataArray = [data]
        setItems(dataArray);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching gula darah data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Determine blood sugar status and color
  const getBloodSugarStatus = (result: string) => {
    const value = parseFloat(result);
    if (isNaN(value)) return { status: 'Tidak Diketahui', color: '#FFA500' };
    
    if (value < 70) return { status: 'Rendah', color: '#FF6B6B' };
    if (value >= 70 && value <= 99) return { status: 'Normal', color: '#4CAF50' };
    if (value >= 100 && value <= 125) return { status: 'Prediabetes', color: '#FFC107' };
    return { status: 'Diabetes', color: '#FF5722' };
  };

  const renderBloodSugarItem = ({ item }: { item: Item }) => {
    const { status, color } = getBloodSugarStatus(item.hasilPengukuran);

    return (
      <TouchableOpacity style={styles.bloodSugarCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="water" size={30} color="white" />
        </View>
        <View style={styles.bloodSugarDetails}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Hasil: {item.hasilPengukuran} mg/dL</Text>
            <View style={[styles.statusBadge, { backgroundColor: color }]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
          <Text style={styles.detailText}>Petugas: {item.petugas}</Text>
          <Text style={styles.detailText}>Tempat: {item.tempat}</Text>
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Gula Darah Terakhir</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Gula Darah Terakhir</Text>
      <FlatList
        data={items}
        renderItem={renderBloodSugarItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada data gula darah</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#14B8AD',
    borderRadius: 27,
    padding: 15,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  bloodSugarCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  bloodSugarDetails: {
    flex: 1,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statusBadge: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
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
  }
});

export default GuladarahTerakhir
