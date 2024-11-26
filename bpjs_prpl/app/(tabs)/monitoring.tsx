import { View, Text, FlatList, StyleSheet, Button, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeViewGestureHandler, GestureHandlerRootView, ScrollView, TouchableOpacity, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router';
import Aktivitas from '../monitoring/aktivitas';
import Konsumsi from '../monitoring/konsumsi';
import GulaDarah from '../monitoring/gulaDarah';

const Monitoring = () => {
  const [toggleAktivitas, setToggleAktivitas] = useState(false);
  const [toggleKonsumsi, setToggleKonsumsi] = useState(false);
  const [toggleGulaDarah, setToggleGulaDarah] = useState(false);

  const handlePressAktivitas = () => {
    //router.push('../monitoring/aktivitas');
    setToggleAktivitas(true);
    setToggleKonsumsi(false);
    setToggleGulaDarah(false);
  }

  const handlePressKonsumsi = () => {
    //router.push('../monitoring/konsumsi');
    setToggleAktivitas(false);
    setToggleKonsumsi(true);
    setToggleGulaDarah(false);
  }

  const handlePressGulaDarah = () => {
    //router.push('../monitoring/gulaDarah');
    setToggleAktivitas(false);
    setToggleKonsumsi(false);
    setToggleGulaDarah(true);
  }

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ height: 10 }} />
        <TouchableOpacity 
          onPress={handlePressAktivitas} 
          style={[styles.button, toggleAktivitas && styles.buttonPressed]} 
          activeOpacity={0.7}
        >
          <Text style={[styles.text, toggleAktivitas && styles.textPressed]} >Aktivitas</Text>
        </TouchableOpacity>
        <View style={{ height: 10 }} />
        <TouchableOpacity 
          onPress={handlePressKonsumsi} 
          style={[styles.button, toggleKonsumsi && styles.buttonPressed]} 
          activeOpacity={0.7} 
        >
          <Text style={[styles.text, toggleKonsumsi && styles.textPressed]}>Konsumsi</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handlePressGulaDarah} 
          style={[styles.button, toggleGulaDarah && styles.buttonPressed]} 
          activeOpacity={0.7}
        >
          <Text style={[styles.text, toggleGulaDarah && styles.textPressed]}>Gula Darah</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.result}>
        {toggleKonsumsi ? (<Konsumsi />) : null}
        {toggleAktivitas ? (<Aktivitas />) : null}
        {toggleGulaDarah ? (<GulaDarah />) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  result: {
    //flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    //alignItems: 'center',
    zIndex: 1,
  },
  button: {
    backgroundColor: '#14B8AD',
    borderRadius: 15,
    margin: 10,
    padding: 10,
  },
  buttonPressed: {
    backgroundColor: '#ffffff',
    borderColor: '#14B8AD',
    borderRadius: 15,
    borderWidth: 2,
    margin: 10,
    padding: 10,
  },
  textPressed:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14B8AD',
  }
});

export default gestureHandlerRootHOC(Monitoring);
