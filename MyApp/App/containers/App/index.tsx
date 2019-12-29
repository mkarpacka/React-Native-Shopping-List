import React, {useState, useEffect} from 'react';
import {Root} from "native-base";
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer'
import HomeScreen from "../HomeScreen";
import AddToListScreen from "../AddToListScreen";
import ShoppingListsScreen from "../ShoppingListsScreen";
import SingleShoppingListScreen from "../SingleShoppingListScreen";
import StoreScreen from "../StoreScreen";
import FakerJsScreen from "../FakerJsScreen";
import PdfScreen from "../PdfScreen";

const HomeStack = createStackNavigator({HomeScreen});
const AddToListStack = createStackNavigator({AddToListScreen});
const ShoppingListsStack = createStackNavigator({ShoppingListsScreen});
const SingleShoppingListStack = createStackNavigator({SingleShoppingListScreen});
const StoreStack = createStackNavigator({StoreScreen});
const FakerJsStack = createStackNavigator({FakerJsScreen});
const PDFStack = createStackNavigator({PdfScreen});

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
            screen: FakerJsStack
        },

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
            SingleShoppingListStack,
            StoreStack
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
