import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Screen } from 'expo-router/build/views/Screen'
import Aktivitas from '../components/monitoring/aktivitas'

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, headerTitleAlign: 'center' }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="aktivitas" />
    </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({})
