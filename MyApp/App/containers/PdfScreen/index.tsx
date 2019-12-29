import React, {Component} from 'react';

import {
    Text,
    TouchableHighlight,
    View,
} from 'react-native';

import {RNHTMLtoPDF} from 'react-native-html-to-pdf'
import {NavigationStackProp} from "react-navigation-stack";
import {Body, Button, Container, Content, Header, Icon, Left, Title} from "native-base";
import {DrawerActions} from "react-navigation-drawer";

type Props = {
    navigation: NavigationStackProp;
};

export const PDFScreen = ({navigation}: Props) => {
    const createPDF = async () => {
        let options = {
            html: '<h1>PDF TEST</h1>',
            fileName: 'test',
            directory: 'Documents',
        };

        // let file = await RNHTMLtoPDF.convert(options)
        // console.log(file.filePath);
        // alert(file.filePath);

        try {
            let file = await RNHTMLtoPDF.convert(options)
            console.log('Success', file)
        } catch (err) {
            console.log(err)
        }
    }


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
                    <Title>Wygeneruj PDF</Title>
                </Body>
            </Header>
            <Content
                contentContainerStyle={{
                    justifyContent: 'center',
                    flex: 1,
                    padding: 20,
                }}>
                <View>
                    <Button
                        onPress={() => createPDF()}>
                        <Text>Generuj PDF</Text>
                    </Button>
                    <Button>
                        <Text>Pobierz PDF</Text>
                    </Button>
                </View>
            </Content>
        </Container>
    )
}

PDFScreen.navigationOptions = {
    header: null,
};

export default PDFScreen;
