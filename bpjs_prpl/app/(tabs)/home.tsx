import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import Control from '@/components/control'
import Konsumsi from '@/components/homeComponents/konsumsi'
import GulaDarah from '@/components/homeComponents/guladarah'
import AktivitasTerakhir from '@/components/homeComponents/aktivitasTerakhir'
import KontrolTerakhir from '@/components/homeComponents/controlTerakhir'
import KontrolSelanjutnya from '@/components/homeComponents/controlSelanjutnya'
import CuciDarahSelanjutnya from '@/components/homeComponents/cuciDarahSelanjutnya'

const Home = () => {
  
  return (
    <ScrollView contentContainerStyle={ styles.container }>
      <View style={{ height: 14, backgroundColor: '#00541B' }} />
      <KontrolTerakhir />
      <KontrolSelanjutnya />
      <CuciDarahSelanjutnya />
      <Konsumsi />
      <GulaDarah />
      <AktivitasTerakhir />
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