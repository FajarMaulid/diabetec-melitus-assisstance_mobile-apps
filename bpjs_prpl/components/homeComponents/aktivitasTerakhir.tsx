import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

const AktivitasTerakhir = () => {
  interface Item {
    createdAt: string | number | Date;
    olahraga: string;
    durasi: number;
    kaloriTerbakar: number;
    _id: string;
  }

  const URL = process.env.EXPO_PUBLIC_API_URL
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/myapp/aktivitas/terakhir/`);
        const data = await response.json();
        const dataArray = [data]
        setItems(dataArray);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching aktivitas:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map sports to appropriate icons
  const getSportIcon = (sport: string) => {
    const sportIcons: {[key: string]: string} = {
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
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Durasi: {item.durasi} menit</Text>
          <Text style={styles.detailText}>Kalori: {item.kaloriTerbakar} kkal</Text>
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Memuat aktivitas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Aktivitas Terakhir</Text>
      <FlatList
        data={items}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada aktivitas terakhir</Text>
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
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  activityCard: {
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
  activityDetails: {
    flex: 1,
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
  loadingContainer: {
    backgroundColor: '#14B8AD',
    borderRadius: 27,
    padding: 27,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
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

export default AktivitasTerakhir
