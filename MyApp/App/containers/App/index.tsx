import React, {useState, useEffect} from 'react';
import {Root} from "native-base";
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer'
import HomeScreen from "../HomeScreen";
import ShoppingListsScreen from "../ShoppingListsScreen";
import SingleShoppingListScreen from "../SingleShoppingListScreen";
import PdfScreen from "../PdfScreen";
import ImageScreen from "../ImageScreen";

const HomeStack = createStackNavigator({HomeScreen});
const ShoppingListsStack = createStackNavigator({ShoppingListsScreen});
const SingleShoppingListStack = createStackNavigator({SingleShoppingListScreen});
const PDFStack = createStackNavigator({PdfScreen});
const ImageStack = createStackNavigator({ImageScreen});

const DrawerContainer = createDrawerNavigator(
    {
        'Start': {
            screen: HomeStack
        },
        'Twoje listy zakupów': {
            screen: ShoppingListsStack
        },
        'Wygeneruj PDF': {
            screen: PDFStack
        },
        'Zdjęcia paragonów': {
            screen: ImageStack
        },

    },
    {}
);

const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            HomeStack,
            DrawerContainer,
            ShoppingListsStack,
            SingleShoppingListStack,
            ImageStack
        },
        {
            initialRouteName: 'HomeStack',
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
