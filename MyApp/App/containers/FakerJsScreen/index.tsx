import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import AsyncStorage, {useAsyncStorage} from '@react-native-community/async-storage';
import {NavigationStackProp} from "react-navigation-stack";
import {Body, Container, Content, Header, Left, List, ListItem, Title} from "native-base";
import {DrawerActions} from "react-navigation-drawer";
import * as faker from 'faker'

type Props = {
    navigation: NavigationStackProp;
};

export const FakerJsScreen = ({navigation}: Props) => {
    const [fakeShoppingList, setFakeShoppingList] = useState([faker.fake("{{commerce.product}}")]);


    const addFakeData = () => {
        const newFakeShoppingList = [...fakeShoppingList];
        for (let i = 0; i < 50; i++) {
            newFakeShoppingList.push(faker.fake("{{commerce.product}}"))
        }
        console.log(newFakeShoppingList);
        setFakeShoppingList(newFakeShoppingList);
    };

    useEffect(() => {
        addFakeData()
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
                    <Title>Fake</Title>
                </Body>
            </Header>
            <Content>
                <List
                    dataArray={fakeShoppingList}
                    renderRow={data => {
                        return (
                            <ListItem>
                                <Text>{data}</Text>
                            </ListItem>
                        );
                    }}
                />
            </Content>
        </Container>
    )
};

FakerJsScreen.navigationOptions = {
    header: null,
};

export default FakerJsScreen;
