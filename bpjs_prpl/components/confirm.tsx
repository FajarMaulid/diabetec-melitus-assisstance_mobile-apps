import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';

interface confirmProps {
  id: string;
  text: string;
  url: string;
  closeOpen: (open: boolean) => void;
  after: () => void;
}

const Confirm = ({ id, text, url, closeOpen, after }: confirmProps) => {
  const submit = async() => {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    after();
    closeOpen(false);
  }
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text></Text>
          <TouchableOpacity onPress={() => closeOpen(false)} style={styles.closeButton}>
            <Text style={styles.closeText}>x</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>{text}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'flex-end' }}>
          <TouchableOpacity style={styles.button} onPress={submit}>
            <View style={{ width: '45%' }}>
              <Text style={styles.yesNoText}>     Yes</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => closeOpen(false)}>
            <View style={{ width: '45%' }}>
              <Text style={styles.yesNoText}>      No</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Confirm;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeText: {
    fontSize: 20,
  },
  yesNoText: {
    color: 'white',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
  closeButton: {
    marginBottom: 2,
  },
  overlay: {
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  modal: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 100,
    position: 'relative',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#14B8AD',
    borderRadius: 5,
    padding: 10,
    marginVertical: 3,
  },
})
