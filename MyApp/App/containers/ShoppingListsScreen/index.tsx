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

    const handleSubmit = () => {
        //zabezpieczyc przed taka sama naza (klucz) - zapisywac bez spacji!
        if (value.trim()) {
            let itemToSave: ShoppingList = {name: value, completed: false};
            writeItemToStorage(itemToSave);
        } else console.log("not handled");
        setValue("");
    };

    const DATABASE_getAllLists = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let keys = await AsyncStorage.getAllKeys();
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

            if (someItems) setMyShoppingLists(someItems);

        } catch (error) {
            console.log(error);
        }
    };

    const writeItemToStorage = async (shoppingListToSave: any) => {
        await AsyncStorage.setItem(shoppingListToSave.name, JSON.stringify(shoppingListToSave)).then(() => {
            console.log("It was saved successfully");
        })
            .catch(() => {
                console.log("There was an error saving lists")
            });

    };

    const removeItemFromStorage = async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
            console.log("removed ", key);
            readItemFromStorage();
            return true;
        }
        catch(exception) {
            return false;
        }
    };

    useEffect(() => {
        readItemFromStorage();
        // console.log("rendered")
    }, []);
    useEffect(() => {
        console.log('listy po effect', shoppingLists)
    }, [shoppingLists])


    const toggleComplete = (elem: ShoppingList): void => {
        const newShoppingList = [...shoppingLists];
        let index = newShoppingList.indexOf(elem);
        console.log(index)
        newShoppingList[index].completed = !newShoppingList[index].completed;
        setMyShoppingLists(newShoppingList);
        writeItemToStorage(elem);
    };

    const removeItem = (elem: ShoppingList): void => {
        const newShoppingList = [...shoppingLists];
        let index = newShoppingList.indexOf(elem);
        newShoppingList.splice(index, 1);
        console.log(elem.name);
        removeItemFromStorage(elem.name);
        setMyShoppingLists(newShoppingList);
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
                                    <Text
                                        style={[
                                            styles.task,
                                            {textDecorationLine: data.completed ? "line-through" : "none"}
                                        ]}
                                    >
                                        {data.name}
                                    </Text>
                                    <Button
                                        title={data.completed ? "Completed" : "Complete"}
                                        onPress={() => toggleComplete(data)}
                                    />
                                    <Button
                                        title="X"
                                        onPress={() => {
                                            removeItem(data);
                                        }}
                                        color="crimson"
                                    />
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
