import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const KonsumsiTerakhir = () => {
  interface Item {
    createdAt: string | number | Date;
    kaloriMasuk: string;
    massaOrVol: string;
    nama: string;
    tipe: string;
    _id: string;
  }

  const URL = process.env.EXPO_PUBLIC_API_URL;
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/myapp/konsumsi/terakhir/`);
        const data = await response.json();
        const dataArray = [data]
        setItems(dataArray);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching konsumsi data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Determine food type icon and color
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Konsumsi Terakhir</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat data konsumsi...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Konsumsi Terakhir</Text>
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
  konsumsiCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    flex: 1,
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
  },
});

export default KonsumsiTerakhir
