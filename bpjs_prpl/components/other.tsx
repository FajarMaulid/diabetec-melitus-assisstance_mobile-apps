import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GrayBoxesRow = () => {
  return (
    <View style={styles.container}>
      <View style={styles.grayBox}>
        <Text>Olahraga</Text>
      </View>
      <View style={styles.grayBox}>
        <Text>Makan</Text>
      </View>
      <View style={styles.grayBox}>
        <Text>Rekomendasi</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  grayBox: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
});

export default GrayBoxesRow;
