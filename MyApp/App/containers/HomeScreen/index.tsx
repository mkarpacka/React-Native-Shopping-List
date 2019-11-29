import React from 'react';
import {FlatList, StyleSheet, Text, View, Button} from 'react-native';
import {
    Body,
    Container,
    Content,
    Header,
    Icon,
    Left,
    Title,
    Input
} from 'native-base';
import {DrawerActions} from 'react-navigation-drawer';
import {NavigationStackProp} from 'react-navigation-stack';
import AddToListScreen from "../AddToListScreen";

type Props = {
    navigation: NavigationStackProp;
};

const HomeScreen = ({navigation}: Props) => {
    const [todos, setTodos] = React.useState([]);

    return (
        <Container>
            <Header>
                <Left>
                    <Button
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())} title={'menu'}>
                    </Button>
                </Left>
                <Body>
                    <Title>Home</Title>
                </Body>
            </Header>
            <Content
                contentContainerStyle={{
                    justifyContent: 'center',
                    flex: 1,
                    padding: 20,
                }}>
                <Text>Home</Text>
            </Content>
        </Container>
    );
};
export default HomeScreen;

HomeScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
