import {NavigationStackProp} from "react-navigation-stack";
import {Body, Container, Content, Header, Left, Title} from "native-base";
import {Button, Text} from "react-native";
import {DrawerActions} from "react-navigation-drawer";
import React, {useEffect, useState} from "react";

type Props = {
    navigation: NavigationStackProp;
};

export const SingleShoppingListScreen = ({navigation}: Props) => {

    const [listName, setListName] = useState('');

    useEffect(() => {
        if ( navigation.state.params !== undefined) {
            const id = navigation.state.params.listObject;
            setListName(id.toString);
            console.log(id);
            console.log(navigation.state.params.listObject);
        }
        console.log('undef');
    }, [navigation.state.params]);

    return(
        <Container>
            <Header>
                <Left>
                    <Button
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())} title={'menu'}>
                    </Button>
                </Left>
                <Body>
                    <Title>Jedna lista zakupów</Title>
                </Body>
            </Header>
            <Content
                contentContainerStyle={{
                    justifyContent: 'center',
                    flex: 1,
                    padding: 20,
                }}>
                <Text>id: {listName}</Text>
            </Content>
        </Container>
    );
};

SingleShoppingListScreen.navigationOptions = {
    header: null,
};

export default SingleShoppingListScreen;
