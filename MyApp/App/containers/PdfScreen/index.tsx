import React, {Component, useEffect, useState} from 'react';

import {
    PermissionsAndroid,
    TouchableHighlight,
    View,
} from 'react-native';

import {NavigationStackProp} from "react-navigation-stack";
import {
    Body,
    Button,
    Container,
    Content,
    Form,
    Header,
    Icon,
    Input,
    Item,
    Left,
    Picker,
    Textarea,
    Title,
    Text
} from "native-base";
import {DrawerActions} from "react-navigation-drawer";
import RNFetchBlob from 'rn-fetch-blob';

import pdfMake from 'pdfmake/build/pdfmake'
import AsyncStorage from "@react-native-community/async-storage";

type Props = {
    navigation: NavigationStackProp;
};

interface ShoppingList {
    name: string;
    completed: boolean;
}

interface ItemsList {
    name: string;
    isChecked: boolean;
}

export const PDFScreen = ({navigation}: Props) => {
    const result: string[] = [];
    const [selectedVal, setSelectedVal] = useState("");
    const [shoppingLists, setMyShoppingLists] = React.useState<ShoppingList[]>([]);
    var pdfFonts = require('pdfmake/build/vfs_fonts');
    const [shoppingListNames, setShoppingListNames] = useState(result);
    const [nick, setNick] = useState("");
    const [text, setText] = useState("");
    const [itemsList, setItemsList] = useState<ItemsList[]>([]);
    const [itemsNamesList, setItemsNamesList] = useState(result);


    useEffect(() => {
        readItemFromStorage();
        requestExternalStoragePermission();
    }, []);

    useEffect(() => {
        readSingleListItemFromStorage();
    }, [selectedVal]);

    const DATABASE_getAllLists = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let keys = await AsyncStorage.getAllKeys();
                const val = 'shopping';
                let filteredKeys = keys.filter(term => {
                    return term.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
                });
                let items = await AsyncStorage.multiGet(filteredKeys);
                resolve(items)
            } catch (error) {
                reject(new Error('Error getting items from AsyncStorage: ' + error.message))
            }
        });
    };

    const readItemFromStorage = async () => {
        try {
            var items: any = await DATABASE_getAllLists();
            var someItems: ShoppingList[] = items.map((result, i, store) => {
                let value = store[i][1];
                return JSON.parse(value);
            });

            if (someItems) {
                setMyShoppingLists(someItems)
                let temp = someItems.map(item => item.name);
                setShoppingListNames(temp);
            }


        } catch (error) {
            console.log(error);
        }
    };


    const createPDF = (base64PDF) => {
        const RNFS = require('react-native-fs');
        let path: string = RNFS.ExternalStorageDirectoryPath;

        requestExternalStoragePermission();

        const pathToWrite = path + '/' + selectedVal + '.pdf';
        console.log('pathToWrite', pathToWrite);

        RNFetchBlob.fs
            .writeFile(pathToWrite, base64PDF, 'base64')
            .then(() => {
                navigation.navigate('OpenPdfScreen', {
                    pathToWrite: pathToWrite
                });
            })
            .catch(error => console.error(error));
    };

    const requestExternalStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    buttonNegative: "", buttonNeutral: "", buttonPositive: "",
                    title: 'My App Storage Permission',
                    message: 'My App needs access to your storage ' +
                        'so you can save your photos'
                },
            );
            return granted;
        } catch (err) {
            console.error('Failed to request permission ', err);
            return null;
        }
    };

    const DATABASE_getItems = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let returnedItems = await AsyncStorage.getItem(selectedVal + 'items');
                resolve(returnedItems);
            } catch (error) {
                reject(new Error('Error getting items from AsyncStorage: ' + error.message))
            }
        });
    };

    const readSingleListItemFromStorage = async () => {
        try {
            let items: any = await DATABASE_getItems();
            if (items) {
                setItemsList(JSON.parse(items));
                let temp = JSON.parse(items).map(item => item.name);
                setItemsNamesList(temp);
                console.log(temp);
            }


        } catch (error) {
            console.log(error);
        }
    };

    const generatePdf = () =>
        new Promise(resolve => {
            let docDefinition = {
                content: [
                    {text: selectedVal, style: 'header'},
                    {text: new Date().toLocaleString("pl-PL"), alignment: 'right'},

                    {text: 'Stworzono przez: ', style: 'subheader'},
                    {text: nick},

                    {text: 'Lista zakupów: ', margin: [0, 20, 0, 20]},
                    {
                        ul: itemsNamesList, margin: [40, 0, 40, 0]
                    },

                    {text: text, style: 'additionalText', margin: [0, 20, 0, 20]}
                ],

                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 15, 0, 0]
                    },
                    additionalText: {
                        italic: true,
                        width: '50%',
                    }
                }
            };
            const pdfDocGenerator = pdfMake.createPdf(docDefinition)
            pdfDocGenerator.getBase64(pdfData => {

                let returnedItems = {
                    pdfData: 'data:application/pdf;base64,${pdfData}',
                    onlyData: pdfData,
                }

                resolve(returnedItems);
                createPDF(returnedItems.onlyData);
            })
        })


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
                    padding: 20,
                }}>
                <View>
                    <Form>
                        <Text style={{fontWeight: 'bold'}}>Wybierz listę do eksportu</Text>
                        <Picker
                            mode="dropdown"
                            placeholder="Wybierz listę do eksportu"
                            selectedValue={selectedVal}
                            style={{height: 50}}
                            onValueChange={selectedVal =>
                                setSelectedVal(selectedVal)
                            }>
                            {shoppingListNames.map((value) => (<Picker.Item key={value} value={value} label={value}/>))}
                        </Picker>
                        <Text style={{fontWeight: 'bold'}}>Dodaj parametry</Text>
                        <Item underline>
                            <Input
                                placeholder="Twój nick"
                                value={nick}
                                onChangeText={e => {
                                    setNick(e);
                                }}
                            />
                        </Item>

                        <Item underline>
                            <Input
                                placeholder="Opcjonalny tekst"
                                value={text}
                                style={{height: 100}}
                                onChangeText={e => {
                                    setText(e);
                                }}
                            />
                        </Item>

                    </Form>
                </View>
                {/*<View style={{paddingTop: 10, justifyContent: 'center'}}>*/}
                {/*    <Button primary>*/}
                {/*        <Text>Generuj PDF</Text>*/}
                {/*    </Button>*/}
                {/*</View>*/}
                <View style={{paddingTop: 10}}>
                    <Button onPress={() => generatePdf()}>
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
