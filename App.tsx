import React, { ReactNode } from 'react';
import {DrawerNavigator} from "./src/navigator/DrawerNavigator";
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';



export const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;