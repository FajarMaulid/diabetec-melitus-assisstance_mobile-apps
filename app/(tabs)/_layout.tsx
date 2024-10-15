import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home', headerTitleAlign: 'center', tabBarIcon: ({color}) => <FontAwesome size={20} name="home" color = {color} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', headerTitleAlign: 'center', tabBarIcon: ({color}) => <FontAwesome size={20} name="message" color = {color} /> }} />
    </Tabs>
  )
}

export default TabsLayout

const styles = StyleSheet.create({})
