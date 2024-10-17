import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { FontAwesome } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ headerShown: false, title: 'Home', headerTitleAlign: 'center', tabBarIcon: ({color}) => <MaterialCommunityIcons size={19} name="home" color = {color} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', headerTitleAlign: 'center', tabBarIcon: ({color}) => <MaterialCommunityIcons size={19} name="message" color = {color} /> }} />
      <Tabs.Screen name="monitoring" options={{ title: 'Monitorning', headerTitleAlign: 'center', tabBarIcon: ({color}) => <MaterialCommunityIcons size={19} name="history" color = {color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', headerTitleAlign: 'center', tabBarIcon: ({color}) => <MaterialCommunityIcons size={19} name="account" color = {color} /> }} />
    </Tabs>
  )
}

export default TabsLayout

const styles = StyleSheet.create({})
