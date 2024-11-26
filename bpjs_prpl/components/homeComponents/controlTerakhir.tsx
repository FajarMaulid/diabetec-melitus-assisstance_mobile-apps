import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'

const KontrolTerakhir = () => {
  const [items, setItems] = useState('');
  const URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/myapp/guladarah/terakhir/`);
      const data = await response.json();
      const dataArray = [data]
      setItems(data);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.innerContainer1}>
      <Text style={styles.text}>
        Kontrol Terakhir
      </Text>
      <Text style={styles.text1}>
        { items.createdAt !== undefined && items.charCodeAt !== '' ?
          new Date(items.createdAt).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',  // Menggunakan nama bulan
            year: 'numeric'
          }) : '' }
      </Text>
      <Text style={styles.text1}>
        Hasil: <Text style={{ fontWeight:'800' }}>{items.hasilPengukuran}</Text>
      </Text>
    </View>
  )
}

export default KontrolTerakhir

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
