import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

const StartPage = () => {
  return (
    <Redirect href="/home" />
  )
}

export default StartPage

const styles = StyleSheet.create({})

