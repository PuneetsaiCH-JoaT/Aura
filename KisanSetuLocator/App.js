import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import CentreLocatorScreen from './screens/CentreLocatorScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <CentreLocatorScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
});
