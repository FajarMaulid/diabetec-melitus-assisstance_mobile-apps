import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CuciDarahSelanjutnya = () => {
  return (
      <View style={styles.innerContainer1}>
          <Text style={styles.text}>
              Cuci Darah Selanjutnya
          </Text>
          <Text style={styles.text1}>
            besok
          </Text>
        </View>
  )
}

export default CuciDarahSelanjutnya

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