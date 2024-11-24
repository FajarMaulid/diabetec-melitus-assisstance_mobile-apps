import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import Control from '@/components/control'
import KonsumsiTerakhir from '@/components/homeComponents/konsumsiTerakhir'
import GulaDarahTerakir from '@/components/homeComponents/guladarahTerakhir'
import AktivitasTerakhir from '@/components/homeComponents/aktivitasTerakhir'
import KontrolTerakhir from '@/components/homeComponents/controlTerakhir'
import KontrolSelanjutnya from '@/components/homeComponents/controlSelanjutnya'
import CuciDarahSelanjutnya from '@/components/homeComponents/cuciDarahSelanjutnya'

const Home = () => {
  const [items, setItems] = useState([]);
  const URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/profile/`);
      const data = await response.json();
      const dataArray = [data];
      setItems(data);
    };

    fetchData();
  }, []);
  
  console.log(items);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {items.length === 0 || items.detail == 'Not authenticated'? 
        <Text style={styles.loginText}>Silahkan Login terkebih dahulu</Text> 
        : 
        <Text style={styles.welcomeText}>Wellcome, {items.name || items.username}</Text>}
      <View style={{ height: 14, backgroundColor: '#00541B' }} />
      <KontrolTerakhir />
      {/*<KontrolSelanjutnya />*/}
      {/*<CuciDarahSelanjutnya />*/}
      <KonsumsiTerakhir />
      <GulaDarahTerakir />
      <AktivitasTerakhir />
      <View style={{ height: 20 }} />
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 18,
    color: '#FF6347', // Tomat (warna merah terang)
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  welcomeText: {
    fontSize: 22,
    color: '#4CAF50', // Hijau terang
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
})
