import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TopHomeBar from '@/components/topHomeBar'
import Control from '@/components/control'
import Step from '@/components/step'
import Other from '@/components/other'

const Home = () => {
  return (
    <View >
      <TopHomeBar />
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