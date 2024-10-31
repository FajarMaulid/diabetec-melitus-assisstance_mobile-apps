import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import Control from '@/components/control'
import KonsumsiTerakhir from '@/components/homeComponents/konsumsiTerakhir'
import GulaDarahTerakir from '@/components/homeComponents/guladarahTerakhir'
import AktivitasTerakhir from '@/components/homeComponents/aktivitasTerakhir'
import KontrolTerakhir from '@/components/homeComponents/controlTerakhir'
import KontrolSelanjutnya from '@/components/homeComponents/controlSelanjutnya'
import CuciDarahSelanjutnya from '@/components/homeComponents/cuciDarahSelanjutnya'

const Home = () => {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ height: 14, backgroundColor: '#00541B' }} />
      <KontrolTerakhir />
      <KontrolSelanjutnya />
      <CuciDarahSelanjutnya />
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
})
