import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Step = () => {
  return (
    <View style={ styles.container }>
      <View style={ styles.grayBox }>  
        <Text style={ styles.text }>Step Yang Dilakukan</Text>
      </View>
    </View>
  )
}

export default Step

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    grayBox: {
        // flex: 1,
        backgroundColor: '#d9d9d9',
        justifyContent: 'center',
        alignItems: 'center',
        height: 68,
        width: '90%',
    },
    text: {
        fontSize: 20,
    },
})