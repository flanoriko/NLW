import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; //navegação em pilha
//as telas anteriores nao deixam de existir, os usuarios podem voltar pra tela anterior

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';

const AppStack //obrigatorio fazer, ta na documentação 
    = createStackNavigator();//vai fazer o roteamento da aplicação

const Routes = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator headerMode="none"
                screenOptions={
                    {
                        cardStyle: {
                            backgroundColor: '#f0f0f5'
                        }
                    }
                }
            >
                <AppStack.Screen name="Home" component={Home} />
                <AppStack.Screen name="Points" component={Points} />
                <AppStack.Screen name="Detail" component={Detail} />
            </AppStack.Navigator>
        </NavigationContainer>

    );
};

export default Routes;