import React, {useState, useEffect} from 'react';
import {Root} from "native-base";
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer'
import HomeScreen from "../HomeScreen";
import AddToListScreen from "../AddToListScreen";
import ShoppingListsScreen from "../ShoppingListsScreen";
import SingleShoppingListScreen from "../SingleShoppingListScreen";


const HomeStack = createStackNavigator({HomeScreen});
const AddToListStack = createStackNavigator({AddToListScreen});
const ShoppingListsStack = createStackNavigator({ShoppingListsScreen});
const SingleShoppingListStack = createStackNavigator({SingleShoppingListScreen});

const DrawerContainer = createDrawerNavigator(
    {
        'Home': {
            screen: HomeStack
        },
        'Dodaj do listy': {
            screen: AddToListStack
        },
        'Twoje listy zakupów': {
            screen: ShoppingListsStack
        }

    },
    {}
);

const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            HomeStack,
            AddToListStack,
            DrawerContainer,
            ShoppingListsStack,
            SingleShoppingListStack
        },
        {
            initialRouteName: 'AddToListStack',
            // headerMode: 'screen'
        },
    ),
);

export default function App() {
    return (
        <Root>
            <AppContainer/>
        </Root>
    );
}
