import { View, ActivityIndicator } from 'react-native';
import React, { Suspense, lazy } from 'react';
import { useState, useEffect } from 'react';
import { Text } from 'react-native';


// this will store our promise and data
let promise: Promise<any> | null = null
let data: any | null = null

// our custom delay hook
function useCustomDelay(ms: number) {
  // if we already have data, return it immediately
  if (data) return data
  
  // if we're already in delay, throw the promise
  if (promise) throw promise
  
  // simulate api call with delay
  promise = new Promise(resolve => 
    setTimeout(() => {
      data = { name: 'John Doe' } // simulated data
      promise = null
      resolve(data)
    }, ms)
  )
  
  // throw the promise on first render
  throw promise
}

// usage component
function DelayedComponent() {
  const userData = useCustomDelay(3000) // 3 seconds delay
  return <Text>Hello {userData.name}</Text>
}

// Main component
export default function App() {

	React.useEffect(() => {
		return () => {
			console.log('unmount')
			promise = null
			data = null
		}
	}, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <DelayedComponent />
      </Suspense>
    </View>
  );
}

