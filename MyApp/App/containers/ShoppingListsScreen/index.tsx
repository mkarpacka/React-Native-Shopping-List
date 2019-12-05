import React from "react";
import {NavigationStackProp} from "react-navigation-stack";
import {Button, View, Text, StyleSheet, TextInput} from "react-native";
import {Body, Container, Content, Header, Icon, Left, List, ListItem, Title} from "native-base";
import {DrawerActions} from "react-navigation-drawer";
import navigateWithParams from "../../utils/navigateWithParams";


type Props = {
    navigation: NavigationStackProp;
};

export const ShoppingListsScreen = ({navigation}: Props) => {

    let userTestStatus: { id: number, name: string }[] = [
        {"id": 0, "name": "Available"},
        {"id": 1, "name": "Ready"},
        {"id": 2, "name": "Started"}
    ];

    const [shoppingLists, setMyShoppingLists] = React.useState(userTestStatus);


    // setMyShoppingLists(userTestStatus);

    const navigateToDetails = ({id}: any) => () => {
        navigateWithParams(navigation, 'SingleShoppingListScreen', 'SingleShoppingList', {listObject: id});
    };

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
            <Content
                contentContainerStyle={{
                    justifyContent: 'center',
                    flex: 1,
                }}>
                {userTestStatus.length > 0 && (
                    <List
                        dataArray={userTestStatus}
                        renderRow={data => {
                            return (
                                <ListItem
                                    onPress={() => navigation.navigate('SingleShoppingListScreen', {data: data})}
                                >
                                    <Text style={{marginLeft: 5}}>{data.name}</Text>
                                </ListItem>
                            );
                        }}
                    />
                )}
            </Content>
        </Container>
    );
};

ShoppingListsScreen.navigationOptions = {
    header: null,
};

export default ShoppingListsScreen;
