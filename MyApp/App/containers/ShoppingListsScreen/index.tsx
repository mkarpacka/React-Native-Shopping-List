import React, {useEffect} from "react";
import {NavigationStackProp} from "react-navigation-stack";
import {Button, View, Text, StyleSheet, TextInput} from "react-native";
import {Body, Container, Content, Header, Icon, Left, List, ListItem, Title} from "native-base";
import {DrawerActions} from "react-navigation-drawer";
import AsyncStorage, {useAsyncStorage} from "@react-native-community/async-storage";


type Props = {
    navigation: NavigationStackProp;
};

interface ShoppingList {
    name: string;
    completed: boolean;
}

export const ShoppingListsScreen = ({navigation}: Props) => {

    const [shoppingLists, setMyShoppingLists] = React.useState<ShoppingList[]>([]);
    const [value, setValue] = React.useState<string>("");
    const [keys, setKeys] = React.useState([]);


    const handleSubmit = () => {
        //zabezpieczyc przed taka sama naza (klucz) - zapisywac bez spacji!
        if (value.trim()) {
            let itemToSave: ShoppingList = {name: value, completed: false};
            writeItemToStorage(itemToSave);
            // console.log('handled');
        } else console.log("not handled");
        setValue("");
    };

    const DATABASE_getAllLists = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let keys = await AsyncStorage.getAllKeys();
                // console.log(keys);
                let items = await AsyncStorage.multiGet(keys);
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


            // console.log("readed");
            // console.log(someItems);
            if(someItems) setMyShoppingLists(someItems);
            // console.log(shoppingLists[1])
        } catch (error) {
            console.log(error);
        }
    };

    const writeItemToStorage = async (shoppingListToSave: any) => {
        await AsyncStorage.setItem(shoppingListToSave.name, JSON.stringify(shoppingListToSave)).then(() => {
            // console.log("It was saved successfully");
        })
            .catch(() => {
                // console.log("There was an error saving lists")
            });

        // readItemFromStorage();
    };


    useEffect(() => {
        readItemFromStorage();
        // console.log("rendered")
    }, []);
    useEffect(() => {
        console.log('dupa', shoppingLists)
    },[shoppingLists])

    let getAllKeys = async () => {
        let returnedKeys: any = [];
        try {
            returnedKeys = await AsyncStorage.getAllKeys();
            setKeys(returnedKeys);
            // console.log("pobrano klucze zapisanych list :" + returnedKeys);
        } catch (e) {
            // console.log("nie można pobrać kluczy zapisanych list")
        }
        console.log(returnedKeys);
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
                    padding: 20,
                }}>
                <TextInput
                    placeholder="Dodaj nową listę zakupów"
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

                {shoppingLists.length === 0 && <Text>Nie masz jeszcze listy zakupów</Text>}
                {shoppingLists.length > 0 && (
                    <List
                        dataArray={shoppingLists}
                        renderRow={data => {
                            return (
                                <ListItem
                                    onPress={() => navigation.navigate('SingleShoppingListScreen', {data: data})}
                                >
                                    <Text>{data.name}</Text>
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


const styles = StyleSheet.create({
    inputStyle: {
        height: 40,
        borderColor: 'green',
        borderWidth: 1
    },
    viewStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        padding: 35,
        alignItems: "center"
    },
    inputWrapper: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    inputBox: {
        width: 200,
        borderColor: "purple",
        borderRadius: 8,
        borderWidth: 2,
        paddingLeft: 8
    },
    title: {
        fontSize: 40,
        marginBottom: 40,
        fontWeight: "bold",
        textDecorationLine: "underline"
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 20,
        color: "purple"
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 10
    },
    addButton: {
        alignItems: "flex-end"
    },
    task: {
        width: 200
    },
    error: {
        color: "red"
    }
});
