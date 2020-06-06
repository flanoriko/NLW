import React from 'react';
import{AppLoading} from 'expo';
import Home from  './src/pages/Home'
import {StatusBar} from 'react-native';
import {Ubuntu_700Bold, useFonts}  from '@expo-google-fonts/ubuntu'
import {Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto'
import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,Roboto_500Medium,Ubuntu_700Bold
  })
   
  if (!fontsLoaded){
     return <AppLoading/>

  }
 
  return (

    //nao da pra retornar dois componentes ao mesmo tempo. 
    //precisa ter uma view em torno, como se fosse uma div em branco
    //ou usa um conceito do react que é o fragment
    //q eh uma div q nao produz resultado, 
    <>
    <StatusBar barStyle="dark-content" backgroundColor="transparente"
    translucent />
     <Routes/>
    </>
   
  );
}