import { View, Text, Image } from 'react-native'
import React from 'react'

const MiniProfile = () => {
  return (
    <View>
      <Image source={ require('../assets/images/profile.png') } style={{ width: 30, height: 30, borderRadius: 15 }} />
    </View>
  )
}

export default MiniProfile