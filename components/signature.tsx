import { View, Text, Pressable, StyleSheet } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import * as MediaLibrary from 'expo-media-library';
import React, { useRef, useState } from 'react';
import * as FileSystem from 'expo-file-system';


// Define the web styles at the top of the component
const SIGNATURE_CANVAS_STYLE = `
  .m-signature-pad--footer { 
    display: none; 
  }
  .m-signature-pad { 
    width: 100%; 
    height: 100%; 
    border: none !important; 
    box-shadow: none !important; 
  }
  .m-signature-pad--body { 
    width: 100%; 
    height: 100%; 
    border: none !important; 
  }
  canvas { 
    width: 100%; 
    height: 100%; 
  }
  body { 
    width: 100%;
    height: 100%;
    margin: 0; 
    padding: 0; 
  }
`;

export default function SignatureComponent() {
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef();

  // Function to handle signature completion
  const handleSignature = (signature) => {
    setSignature(signature);
  };

  // Function to save the signature as PNG
  const saveSignature = async () => {
    // ... existing save function code
  };

  // Function to clear the signature
  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setSignature(null);
  };

  return (
    <View style={styles.container}>
      <SignatureScreen
        ref={signatureRef}
        onOK={handleSignature}
        webStyle={SIGNATURE_CANVAS_STYLE}
        style={styles.signatureCanvas}
        autoClear={false}
      />
      
      {/* Your buttons and other UI elements */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    width: '100%', 
    height: '100%',
    borderWidth: 0,
    backgroundColor: 'white'
  },
  signatureCanvas: {
    flex: 1, 
    width: '100%', 
    height: '100%', 
    borderWidth: 0,
    backgroundColor: 'transparent'
  }
}); 