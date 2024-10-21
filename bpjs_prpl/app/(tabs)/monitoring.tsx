import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

const Monitoring = () => {
  interface Item {
    _id: string;
    category: string;
    password: string;
    username: string;
    email: string;
  }

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/myapp/');
      const data = await response.json();
      
      
      // Assuming data is an array of user objects
      // const formattedData = data.map((user: any) => ({
      //   _id: user._id,
      //   username: user.username || 'No username', // Handle cases with no username
      //   email: user.email || 'No email', // Handle cases with no email
      // }));
      
      setItems(data);
    };

    fetchData();
  }, []);

  console.log(items);
  return (
    <View style={styles.container}>
      <Text>Items:</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id.toString()} // Pastikan _id diubah menjadi string
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>Username: {item.username}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Category: {item.category}</Text>
            <Text>Password: {item.password}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default Monitoring;


const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure that the container takes up the full screen
  },
  itemContainer: {
    marginBottom: 10, // Add some space between items
  },
});