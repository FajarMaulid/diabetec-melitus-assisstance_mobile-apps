import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import URL from '../../env'

const KonsumsiTerakhir = () => {
  interface Item {
    createdAt: string | number | Date;
    kaloriMasuk: string;
    massaOrVol: string;
    nama: string;
    tipe: string;
    _id: string;
  }

  //const URL = process.env.API_URL;
  const [domain, setDomain] = useState(URL);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/myapp/konsumsi/terakhir/`);
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
        Konsumsi Terakhir
      </Text>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.text1}>Tipe: {item.tipe}</Text>
            <Text style={styles.text1}>Nama: {item.nama}</Text>
            <Text style={styles.text1}>Massa/Volume: {item.massaOrVol}g</Text>
            <Text style={styles.text1}>Kalori Masuk: {item.kaloriMasuk} kcal</Text>
            <Text style={styles.text1}>Dibuat Pada: {new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.nama}
      />
    </View>
  )
}

export default KonsumsiTerakhir

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
