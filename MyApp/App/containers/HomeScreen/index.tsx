import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {DrawerActions} from 'react-navigation-drawer';
import {NavigationStackProp} from 'react-navigation-stack';
import {
    Body,
    Container,
    Content,
    Header,
    Icon,
    Input,
    Item,
    Left,
    List,
    ListItem,
    Right,
    Title,
    Button,
    Text,
    Form,
    Picker, CardItem, Card
} from "native-base";

type Props = {
    navigation: NavigationStackProp;
};

const HomeScreen = ({navigation}: Props) => {

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
                    <Title>Start</Title>
                </Body>
            </Header>
            <Content
                contentContainerStyle={{
                    flex: 1,
                    padding: 20,
                }}>
                <Card>
                    <CardItem header>
                        <Text>Witamy w aplikacji!</Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>
                                Aplikacja została stworzona aby ułatwić Twoje zakupy! Możesz rozpocząć dodając nowe listy zakupów oraz produkty. Każdą listę możesz zapisać i pobrać w formacje PDF.
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
                <View style={{padding: 10}}>
                    <Button light>
                        <Icon name="ios-basket"/>
                        <Text>Dodaj listę zakupów</Text>
                    </Button>
                </View>
                <View style={{padding: 10}}>
                    <Button light>
                        <Icon name="ios-document"/>
                        <Text>Wygeneruj PDF</Text>
                    </Button>
                </View>

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
