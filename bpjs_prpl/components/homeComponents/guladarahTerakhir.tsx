import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const guladarahTerakhir = () => {
  interface Item {
    createdAt: string | number | Date;
    hasilPengukuran: string;
    petugas: string;
    tempat: string;
    _id: string;
  }

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/myapp/guladarah/terakhir/');
      const data = await response.json();
      const dataArray = [data]
      setItems(dataArray);
    };

    fetchData();
  }, []);

  console.log(items);
  return (
    <View style={styles.innerContainer1}>
      <Text style={styles.text}>
        Gula Darah Terakhir
      </Text>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.text1}>Tipe: {item.hasilPengukuran}</Text>
            <Text style={styles.text1}>Nama: {item.petugas}</Text>
            <Text style={styles.text1}>Massa/Volume: {item.tempat}g</Text>
            <Text style={styles.text1}>Dibuat Pada: {new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.hasilPengukuran}
      />
    </View>
  )
}

export default guladarahTerakhir

const styles = StyleSheet.create({
  innerContainer1: {
    // flex: 1,
    backgroundColor: '#14B8AD',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
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
