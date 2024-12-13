<<<<<<< HEAD
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopHomeBar from '@/components/topHomeBar'
import Control from '@/components/control'
import Step from '@/components/step'
import Other from '@/components/other'

const Home = () => {
  const [lateAct, setLateAct] = useState(null);
  const [lateGula, setLateGula] = useState(null);
  const [lateKon, setLateKon] = useState(null);

  const fetchLateAct = async () => {
    const response = await fetch('http://localhost:8000/myapp/aktivitas/terakhir', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if(response.ok) {
      setLateAct(result);
    }
    else {
      throw new Error('Something went wrong!');
    }
  }

  const fetchLateGula = async () => {
    const response = await fetch('http://localhost:8000/myapp/guladarah/terakhir', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if(response.ok) {
      setLateGula(result);
    }
    else {
      throw new Error('Something went wrong!');
    }
  }

  const fetchLateKon = async () => {
    const response = await fetch('http://localhost:8000/myapp/konsumsi/terakhir/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if(response.ok) {
      setLateKon(result);
    }
    else {
      throw new Error('Something went wrong!');
    }
  }

  useEffect(() => {
    fetchLateKon();
  }, []);

  useEffect(() => {
    fetchLateAct();
  }, []);

  useEffect(() => {
    fetchLateGula();
  }, []);

  return (
    <View >
      <View style={{ height: 14, backgroundColor: '#00541B' }} />
      <Control />
      <View style={{ height: 14, backgroundColor: '#00541B' }} />
      <Step />
      <View style={{ height: 14, backgroundColor: '#00541B' }} />
      <Other />
    </View>
  )
}
=======
import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Control from '@/components/control';
import KonsumsiTerakhir from '@/components/homeComponents/konsumsiTerakhir';
import GulaDarahTerakir from '@/components/homeComponents/guladarahTerakhir';
import AktivitasTerakhir from '@/components/homeComponents/aktivitasTerakhir';
import KontrolTerakhir from '@/components/homeComponents/controlTerakhir';
import KontrolSelanjutnya from '@/components/homeComponents/controlSelanjutnya';
import CuciDarahSelanjutnya from '@/components/homeComponents/cuciDarahSelanjutnya';

const Home = () => {
  const [items, setItems] = useState([]);
  const URL = process.env.EXPO_PUBLIC_API_URL;
>>>>>>> front

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/profile/`);
      const data = await response.json();
      setItems(data);
    };
    fetchData();
  }, []);

  // This function conditionally renders the login or welcome message
  const renderHeader = () => {
    if (items.length === 0 || items.detail === 'Not authenticated') {
      return (
        <View style={[styles.headerContainer, {backgroundColor:'red'}]}>
          <Text style={styles.loginText}>Silahkan Login terlebih dahulu</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome, {items.name || items.username}</Text>
        </View>
      );
    }
  };

  // Data for the rest of the components inside the list
  const data = [
    { id: '0', component: renderHeader() },
    { id: '1', component: <KontrolTerakhir /> },
    { id: '2', component: <KonsumsiTerakhir /> },
    { id: '3', component: <GulaDarahTerakir /> },
    { id: '4', component: <AktivitasTerakhir /> },
  ];

  return (
    <View style={{ flex: 1, justifyContent:'center' }}>  {/* Ensure the parent View takes up full screen */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => item.component}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
  headerContainer: {
    marginBottom: 20,
    backgroundColor: 'green',
    width: '100%', // Ensure the header takes full width
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center', // Center the text inside the header
  },
  loginText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  welcomeText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  dasboardText: {
    fontSize: 22,
    color: '#14B8AD',
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 10,
  },
});

