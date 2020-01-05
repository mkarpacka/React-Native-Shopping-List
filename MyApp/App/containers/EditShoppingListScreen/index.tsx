import {NavigationStackProp} from "react-navigation-stack";
import React, {useEffect, useState} from "react";
import {
    Body,
    Button,
    Container,
    Content, Form,
    Header,
    Icon,
    Input,
    Item,
    Left,
    List,
    ListItem,
    Text,
    Title
} from "native-base";
import {DrawerActions} from "react-navigation-drawer";
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

export const EditShoppingListScreen = ({navigation}: Props) => {

    const [singleList, setSingleList] = useState<ShoppingList>({name: '', completed: false});
    const [value, setValue] = React.useState<string>("");
    const [itemsList, setItemsList] = useState<ItemsList[]>([]);


    useEffect(() => {
        loadContent();
        readItemFromStorage();
    });

    async function loadContent() {
        if (navigation.state.params !== undefined) {
            const data = await navigation.getParam('data');
            setSingleList(data);
        }
    }

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

    const removeItemFromStorage = async (key: string) => {
        try {
            await AsyncStorage.removeItem('shopping' + key);
            console.log("removed ", key);
            readItemFromStorage();
            return true;
        } catch (exception) {
            return false;
        }
    };

    const writeItemToStorage = async (itemsToSave: any) => {
        await AsyncStorage.setItem(value + 'items', JSON.stringify(itemsToSave)).then(() => {
            console.log("It was saved successfully");
            readItemFromStorage();
        })
            .catch(() => {
                console.log("There was an error saving lists")
            });
    };

    const writeShoppingListToStorage = async (shoppingListToSave: any) => {
        await AsyncStorage.setItem('shopping' + shoppingListToSave.name, JSON.stringify(shoppingListToSave)).then(() => {
            console.log("It was saved successfully");
            readItemFromStorage();
        })
            .catch(() => {
                console.log("There was an error saving lists")
            });
    };

    function handleSubmit() {
        writeItemToStorage(itemsList);
        writeShoppingListToStorage({name: value, completed: singleList.completed});
        removeItemFromStorage(singleList.name);
        navigation.navigate('ShoppingListsScreen');
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
                    <Title>Edytuj: {singleList.name}</Title>
                </Body>
            </Header>
            <Content
                contentContainerStyle={{
                    padding: 20,
                }}>
                <Form>
                    <Item>
                        <Input
                            placeholder="Podaj nową nazwę"
                            value={value}
                            onChangeText={e => {
                                setValue(e);
                            }}
                        />
                        <Button small
                                onPress={handleSubmit}
                        >
                            <Text>Dodaj</Text>
                        </Button>
                    </Item>
                </Form>
            </Content>
        </Container>
    )

};

EditShoppingListScreen.navigationOptions = {
    header: null,
};

export default EditShoppingListScreen;
