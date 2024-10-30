import { View, Text, FlatList, StyleSheet, Button, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { API_URL } from '@env';
import { router } from 'expo-router';

const Monitoring = () => {
  const handlePressAktivitas = (e: any) => {
    e.preventDefault();
    router.push('../monitoring/aktivitas');
  }

  const handlePressKonsumsi = (e: any) => {
    e.preventDefault();
    router.push('../monitoring/konsumsi');
  }

  return (
    <View>
      <Button title="Aktivitas" onPress={handlePressAktivitas} />
      <Button title="Konsumsi" onPress={handlePressKonsumsi} />
    </View>
  )
}

const styles = StyleSheet.create({
});

export default gestureHandlerRootHOC(Monitoring);
