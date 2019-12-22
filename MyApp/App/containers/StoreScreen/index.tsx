import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import AsyncStorage, {useAsyncStorage} from '@react-native-community/async-storage';
import {NavigationStackProp} from "react-navigation-stack";
import {Body, Container, Content, Header, Left, Title} from "native-base";
import {DrawerActions} from "react-navigation-drawer";


type Props = {
    navigation: NavigationStackProp;
};

export const StoreScreen = ({navigation}: Props) => {
    const [value, setValue] = useState('value');
    const {getItem, setItem} = useAsyncStorage('@storage_key');

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
        <Container>
            <Header>
                <Left>
                    <Button
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())} title={'menu'}>
                    </Button>
                </Left>
                <Body>
                    <Title>Listy zakupów</Title>
                </Body>
            </Header>
            <Content>
                <View style={{margin: 40}}>
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
            </Content>
        </Container>
    );
}

StoreScreen.navigationOptions = {
    header: null,
};

export default StoreScreen;
