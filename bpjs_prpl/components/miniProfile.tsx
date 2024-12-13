import { View, Text, Image } from 'react-native'
import React, {useEffect, useState} from 'react'

const MiniProfile = () => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/profile/`);
      const data = await response.json();
      setItems(data);
    };

    fetchData();
  }, []);
  
  return (
    <View>
      <Image source={{ uri: `data:image/png;base64,${items.image}` || require('../assets/images/profile.png') }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 20 }} />
    </View>
  )
}

export default MiniProfile
