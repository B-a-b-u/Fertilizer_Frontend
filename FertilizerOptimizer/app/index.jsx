import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const [soilReport, setSoilReport] = useState(null);
  const [cropType, setCropType] = useState('');
  const [locationData, setLocationData] = useState([]);
  const [convertedAddress, setConvertedAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const translateY = useSharedValue(1000); // Start from below the screen

  useEffect(() => {
    if (modalVisible) {
      translateY.value = withSpring(0, {
        damping: 10,
        stiffness: 100,
        overshootClamping: true,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      translateY.value = withSpring(1000, {
        damping: 10,
        stiffness: 100,
        overshootClamping: true,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [modalVisible]);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const googleMapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
              setLocationData([latitude, longitude]);
              console.log("lat : ",latitude);
              console.log("log:",longitude);
              await fetchAddress(latitude, longitude);
            },
            (error) => {
              setErrorMsg(error.message);
              setLocationData('Error fetching location');
            }
          );
        } else {
          setErrorMsg('Geolocation is not supported by this browser.');
          setLocationData('Geolocation not supported');
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access location was denied');
          setLocationData('Location permission denied');
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync({});
        const googleMapLink = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
        setLocationData(googleMapLink);
        await fetchAddress(coords.latitude, coords.longitude);
      }
    } catch (error) {
      setErrorMsg('Error getting location');
      setLocationData('Error fetching location');
    }
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${process.env.EXPO_PUBLIC_LOC_API}&lat=${lat}&lon=${lon}&format=json`
      );
      const address = response.data.display_name;
      setConvertedAddress(address);
    } catch (error) {
      setErrorMsg('Error converting location to address');
      setConvertedAddress('Error converting location');
    }
  };

  const uploadFileOnPressHandler = async () => {
    try {
      const pickedFile = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (pickedFile.type === 'cancel') {
        console.log('User cancelled the file picker');
        return;
      }

      if (pickedFile.assets && pickedFile.assets.length > 0) {
        const file = pickedFile.assets[0];
        setSoilReport({
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
        });
      } else {
        Alert.alert('Error', 'No file was picked');
      }
    } catch (err) {
      Alert.alert('Error', 'Error picking file');
    }
  };

  const showDetails = () => {
    setModalVisible(true);
  };

  const hideDetails = () => {
    setModalVisible(false);
  };

  const openFile = async () => {
    if (soilReport && soilReport.uri) {
      await Linking.openURL(soilReport.uri);
    } else {
      Alert.alert('Error', 'No file available to open');
    }
  };

  const clearData = () => {
    setSoilReport(null);
    setCropType('');
    setLocationData('');
    setConvertedAddress('');
    setErrorMsg(null);
  };

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const send_data = () =>{
    console.log("send data called");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Fertilizer Suggestion</Text>

          {/* Input 1: Soil Report File Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>1. Soil Report</Text>
            <Button title="Pick Soil Report" onPress={uploadFileOnPressHandler} />
            {soilReport && (
              <View style={styles.fileContainer}>
                <Text style={styles.infoText}>
                  Selected file: {soilReport.name}
                  {Platform.OS === 'web' && soilReport.uri && (
                    <Text style={styles.link} onPress={() => Linking.openURL(soilReport.uri)}>
                      (Download)
                    </Text>
                  )}
                </Text>
                <Button title="Remove File" onPress={() => setSoilReport(null)} />
              </View>
            )}
          </View>

          {/* Input 2: Crop Type Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>2. Crop Type</Text>
            <Picker
              selectedValue={cropType}
              style={styles.picker}
              onValueChange={(itemValue) => setCropType(itemValue)}
            >
              <Picker.Item label="Maize" value="Maize" />
          <Picker.Item label="Sugarcane" value="Sugarcane" />
          <Picker.Item label="Cotton" value="Cotton" />
          <Picker.Item label="Tobacco" value="Tobacco" />
          <Picker.Item label="Paddy" value="Paddy" />
          <Picker.Item label="Barley" value="Barley" />
          <Picker.Item label="Wheat" value="Wheat" />
          <Picker.Item label="Millets" value="Millets" />
          <Picker.Item label="Oil seeds" value="Oil seeds" />
          <Picker.Item label="Pulses" value="Pulses" />
          <Picker.Item label="Ground Nuts" value="Ground Nuts" />
        </Picker>
       
          </View>

          {/* Input 3: Location Access */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>3. Location</Text>
            <Button title="Get Location" onPress={getLocation} />
            <Text style={styles.infoText} onPress={() => Linking.openURL(locationData)}>
              {convertedAddress}
            </Text>
            {errorMsg && <Text style={styles.infoText}>{errorMsg}</Text>}
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Get Details" onPress={showDetails && send_data} style = {styles.button}/>
            <Button title="Clear" onPress={clearData} />
          </View>

          {/* Modal for displaying details */}
          <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={hideDetails}>
            <Animated.View style={[styles.modalBackground, animatedModalStyle]}>
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={hideDetails}>
                  <Text style={styles.closeButtonText}>x</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Details</Text>
                <Text style={styles.infoText}>
                  Selected file: {soilReport ? soilReport.name : 'No file selected'}
                  {Platform.OS === 'web' && soilReport && soilReport.uri && (
                    <Text style={styles.link} onPress={() => Linking.openURL(soilReport.uri)}>
                      (Download)
                    </Text>
                  )}
                </Text>
                <Text style={styles.infoText}>Crop Type: {cropType}</Text>
                <Text style={styles.infoText}>Location Data: </Text>
                <Text style={styles.infoText}>Converted Address: {convertedAddress}</Text>
                <Button title="Confirm" onPress={hideDetails} />
              </View>
            </Animated.View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'white',
  },
  title: {
    fontSize: 25,
    fontWeight: 'light',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'light',
  },
  picker: {
    height: 50,
    width: 250,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 10,
  },
  fileContainer: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth:500,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: 'light',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 30,
    fontWeight: 'light',
    top:-15,
  },
  button: {
    width: 200,
    marginVertical: 10,
    marginTop:30,
  },
  buttonMarginTop: {
    marginTop: 10, // Adjust this value as needed
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    width: '70%',
    maxWidth: 400, // Optional: limit the maximum width if needed
    alignItems: 'center', // Center-align contents inside the container
  },
  buttonContainer: {
    flexDirection: 'row', // Aligns children horizontally
    justifyContent: 'space-between', // Space between buttons
    marginTop: 20,
  },
  buttonWrapper: {
    marginHorizontal: 10, // Adds space between the two buttons
  },
  link: {  color: 'blue'},
});


export default App;
