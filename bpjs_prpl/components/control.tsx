import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Control = () => {
  return (
    <View>
      {/* <View style={styles.outerContainer}> */}
        <View style={styles.innerContainer1}>
          <Text style={styles.text}>
            Kontrol Terakhir
          </Text>
          <Text style={styles.text1}>
            12 oktober 2024
          </Text>
        </View>
        <View style={styles.innerContainer2}>
          <Text style={styles.text}>
            Kontrol Selanjutnya
          </Text>
          <Text style={styles.text1}>
            2 hari lagi, Dr. ucup bin marucup
          </Text>
        </View>
        <View style={styles.innerContainer3}>
          <Text style={styles.text}>
              Cuci Darah Selanjutnya
          </Text>
          <Text style={styles.text1}>
            besok
          </Text>
        </View>
      {/* </View> */}
    </View>
  )
}

export default Control

const styles = StyleSheet.create({
    general : {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    outerContainer: {
        // flex: 1,
        backgroundColor: '#white',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        width: '50%',
        // margin: 10,
        borderRadius: 27,
    },
    innerContainer1: {
        flex: 1,
        backgroundColor: '#14B8AD',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
        borderRadius: 27,
        padding: 27,
    },
    innerContainer2: {
        flex: 1,
        backgroundColor: '#00852A',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
        borderRadius: 27,
        padding: 27,
    },
    innerContainer3: {
        flex: 1,
        backgroundColor: '#14B8AD',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 0,
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