import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MiniProfile from './miniProfile'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

const TopHomeBar = () => {    
  // const navigation = useNavigation();

  // const handleProfilePress = () => {
  //   navigation.navigate('Profile');
  // };
  return (
    <View style={styles.container}>
      <Text style={styles.bpjsText}>BPJS</Text>
      <Text style={styles.healthCareText}>MeDiAH</Text>
      <View style={styles.profileContainer}>
        {/* <TouchableOpacity onPress={handleProfilePress}> */}
          {/* <MiniProfile /> */}
        {/* </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    // height: 65,
  },
  bpjsText: {
    fontSize: 24,
    color: '#14B8AD',
    fontWeight: '900',
  },
  healthCareText: {
    marginTop: 9,
    fontSize: 16,
    color: '#00852A',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
})

export default TopHomeBar
