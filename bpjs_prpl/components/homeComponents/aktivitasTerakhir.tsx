import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

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
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/myapp/aktivitas/terakhir/`);
      const data = await response.json();
      const dataArray = [data]
      setItems(dataArray);
    };

    fetchData();
  }, []);

  //console.log(items);
  return (
    <View style={styles.innerContainer1}>
      <Text style={styles.text}>
        Aktivitas Terakhir
      </Text>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.text1}>Olahraga: {item.olahraga}</Text>
            <Text style={styles.text1}>Durasi: {item.durasi}</Text>
            <Text style={styles.text1}>Kalori Terbakar: {item.kaloriTerbakar}gkal</Text>
            <Text style={styles.text1}>Dibuat Pada: {new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.olahraga}
      />
    </View>
  )
}

export default AktivitasTerakhir

const styles = StyleSheet.create({
  innerContainer1: {
    // flex: 1,
    backgroundColor: '#14B8AD',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    borderRadius: 27,
    padding: 27,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  text1: {
    fontSize: 14,
    color: 'white',
  }
})
