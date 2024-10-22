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

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})