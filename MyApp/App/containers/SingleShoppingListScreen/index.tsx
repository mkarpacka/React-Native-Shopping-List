import {NavigationStackProp} from "react-navigation-stack";
import {Body, Container, Content, Header, Left, List, ListItem, Title} from "native-base";
import {Button, StyleSheet, Text, TextInput} from "react-native";
import {DrawerActions} from "react-navigation-drawer";
import React, {useEffect, useState} from "react";
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

export const SingleShoppingListScreen = ({navigation}: Props) => {

    const [singleList, setSingleList] = useState<ShoppingList>({name: '', completed: false});
    const [itemsList, setItemsList] = useState<ItemsList[]>([]);
    const [value, setValue] = React.useState<string>("");


    async function loadContent() {
        if (navigation.state.params !== undefined) {
            const data = await navigation.getParam('data');
            setSingleList(data);
        }
    }


    useEffect(() => {
        async function waitForLoadContent() {
            await loadContent();

        }
        waitForLoadContent();
    }, []);

    useEffect(() => {
        async function read() {
            await readItemFromStorage();

        }
        read();
    }, [singleList]);



    useEffect(() => {
        console.log('items po effect', itemsList)
    }, [itemsList]);

    const handleSubmit = () => {
        if (value.trim()) {
            let itemToSave: ItemsList = {name: value, isChecked: false};
            const copyItemsList = [...itemsList];
            copyItemsList.push(itemToSave);
            setItemsList(copyItemsList);
            writeItemToStorage(copyItemsList);
        } else console.log("not handled");
        setValue("");
    };

    const DATABASE_getItems = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let returnedItems = await AsyncStorage.getItem(singleList.name + 'items');
                resolve(returnedItems)
            } catch (error) {
                reject(new Error('Error getting items from AsyncStorage: ' + error.message))
            }
        });
    };

    const readItemFromStorage = async () => {
        try {
            let items: any = await DATABASE_getItems();
            if (items) setItemsList(JSON.parse(items));

        } catch (error) {
            console.log(error);
        }
    };

    const writeItemToStorage = async (itemsToSave: any) => {
        await AsyncStorage.setItem(singleList.name + 'items', JSON.stringify(itemsToSave)).then(() => {
            console.log("It was saved successfully");
            readItemFromStorage();
        })
            .catch(() => {
                console.log("There was an error saving lists")
            });
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
                    <Title>{singleList.name}</Title>
                </Body>
            </Header>
            <Content
                contentContainerStyle={{
                    justifyContent: 'center',
                    flex: 1,
                    padding: 20,
                }}>
                <TextInput
                    placeholder="Dodaj nowy produkt"
                    value={value}
                    onChangeText={e => {
                        setValue(e);
                    }}
                    style={styles.inputStyle}
                />
                <Button
                    title="Dodaj"
                    onPress={handleSubmit}
                />

                {itemsList.length === 0 && <Text>Nie dodano produktów</Text>}
                {itemsList.length > 0 && (
                    <List
                        dataArray={itemsList}
                        renderRow={data => {
                            return (
                                <ListItem>
                                    <Text>
                                        {data.name}
                                    </Text>
                                </ListItem>
                            );
                        }}
                    />
                )}
            </Content>
        </Container>
    );
};

SingleShoppingListScreen.navigationOptions = {
    header: null,
};

export default SingleShoppingListScreen;

const styles = StyleSheet.create({
    inputStyle: {
        height: 40,
        borderColor: 'green',
        borderWidth: 1
    },
})
