import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAsyncStorage } from '@react-native-community/async-storage';
import {NavigationStackProp} from "react-navigation-stack";


type Props = {
    navigation: NavigationStackProp;
};

export const StoreScreen = ({navigation}: Props) => {
    const [value, setValue] = useState('value');
    const { getItem, setItem } = useAsyncStorage('@storage_key');

    const readItemFromStorage = async () => {
        const item = await getItem();
        setValue(item);
    };

    const writeItemToStorage = async newValue => {
        await setItem(newValue);
        setValue(newValue);
    };

    useEffect(() => {
        readItemFromStorage();
    }, []);

    return (
        <View style={{ margin: 40 }}>
            <Text>Current value: {value}</Text>
            <TouchableOpacity
                onPress={() =>
                    writeItemToStorage(
                        Math.random()
                            .toString(36)
                            .substr(2, 5)
                    )
                }
            >
                <Text>Update value</Text>
            </TouchableOpacity>
        </View>
    );
}

StoreScreen.navigationOptions = {
    header: null,
};

export default StoreScreen;
