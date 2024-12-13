import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import Home from '../(tabs)/home'

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown:false }}>
      <Stack.Screen name="login" options={{ headerShown:false }}/>
      <Stack.Screen name="register" options={{ headerShown:false }}/>
      {/* <Stack.Screen name="home" component={Home} /> */}
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})