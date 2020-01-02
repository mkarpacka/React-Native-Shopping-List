import React, {Component, useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import {NavigationStackProp} from "react-navigation-stack";
import {Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Text, Title} from "native-base";
import {DrawerActions} from "react-navigation-drawer";
import ImageScreen from "../ImageScreen";
import AsyncStorage from "@react-native-community/async-storage";

type Props = {
    navigation: NavigationStackProp;
};

export const ManageImageScreen = ({navigation}: Props) => {

    const result : string[] = [];
    const [filenameList, setFilenameList] = useState(result);

    useEffect(() => {
        readItemFromStorage();

    }, []);

    const DATABASE_getItems = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let returnedItems = await AsyncStorage.getItem('images');
                resolve(returnedItems)
            } catch (error) {
                reject(new Error('Error getting items from AsyncStorage: ' + error.message))
            }
        });
    };

    const readItemFromStorage = async () => {
        try {
            let items: any = await DATABASE_getItems();
            if (items) setFilenameList(JSON.parse(items));
            console.log(items);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <Header>
                <Left>
                    <Button
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <Icon name='menu'/>
                    </Button>
                </Left>
                <Body>
                    <Title>Zdjęcia</Title>
                </Body>
            </Header>
            <Content
                contentContainerStyle={{
                    flex: 1,
                    paddingLeft: 20,
                    paddingRight: 20,
                }}>
                <View>
                    <Button onPress={() => navigation.navigate('ImageScreen')}>
                        <Text>Dodaj nowe zdjęcie</Text>
                    </Button>
                </View>
                <View>
                    {filenameList.length > 0 && (
                        <List
                            dataArray={filenameList}
                            renderRow={data => {
                                return (
                                    <ListItem key={data}>
                                        <Image
                                            style={{width: 400, height: 600}}
                                            source={{uri: data}}
                                        />
                                    </ListItem>
                                );
                            }}
                        />
                    )}
                </View>
            </Content>
        </Container>
    )
}

ManageImageScreen.navigationOptions = {
    header: null,
};

export default ManageImageScreen;
