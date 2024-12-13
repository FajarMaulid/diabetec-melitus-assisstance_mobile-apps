import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const KontrolSelanjutnya = () => {
  return (
    <View style={styles.innerContainer1}>
      <Text style={styles.text}>
        Kontrol Selanjutnya
      </Text>
      <Text style={styles.text1}>
        Belum ditentukan 
      </Text>
    </View>
  )
}

export default KontrolSelanjutnya

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
