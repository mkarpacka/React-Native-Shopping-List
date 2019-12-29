import React, {useEffect, useState} from "react";
import {NavigationStackProp} from "react-navigation-stack";
import {View, StyleSheet} from "react-native";
import {
    Body,
    Container,
    Content,
    Header,
    Icon,
    Left,
    List,
    ListItem,
    Title,
    Button,
    Text,
    Item,
    Input, Form, Picker
} from "native-base";
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
    const [checkIfExists, setCheckIfExists] = useState(false);
    const [option, setOption] = useState("");
    const [selectedVal, setSelectedVal] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        sort();

        console.log(selectedVal)
    }, [selectedVal]);

    useEffect(() => {
        filter();

        console.log(selectedFilter)
    }, [selectedFilter]);

    useEffect(() => {
        searchItem();

        console.log(searchText)
    }, [searchText]);


    const handleSubmit = () => {
        let temp = shoppingLists.map(a => a.name).indexOf(value) > -1
        setCheckIfExists(temp);
        if (!temp) {
            if (value.trim()) {
                let itemToSave: ShoppingList = {name: value, completed: false};
                writeItemToStorage(itemToSave);
            } else console.log("not handled");
            setValue("");
        } else {
            console.log("istnieje :(");
        }

        console.log(temp);
    };

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

            if (someItems) setMyShoppingLists(someItems);

        } catch (error) {
            console.log(error);
        }
    };

    const writeItemToStorage = async (shoppingListToSave: any) => {
        await AsyncStorage.setItem('shopping' + shoppingListToSave.name, JSON.stringify(shoppingListToSave)).then(() => {
            console.log("It was saved successfully");
            readItemFromStorage();
        })
            .catch(() => {
                console.log("There was an error saving lists")
            });
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

    useEffect(() => {
        readItemFromStorage();
    }, []);

    const toggleComplete = (elem: ShoppingList): void => {
        const newShoppingList = [...shoppingLists];
        let index = newShoppingList.indexOf(elem);
        newShoppingList[index].completed = !newShoppingList[index].completed;
        setMyShoppingLists(newShoppingList);
        writeItemToStorage(elem);
    };

    const removeItem = (elem: ShoppingList): void => {
        const newShoppingList = [...shoppingLists];
        let index = newShoppingList.indexOf(elem);
        newShoppingList.splice(index, 1);
        removeItemFromStorage(elem.name);
        setMyShoppingLists(newShoppingList);
    };

    const renderOption = (name: string) => {
        console.log(name);
        setOption(name);
    };

    const sort = () => {

        if (selectedVal == 'def') {
            readItemFromStorage();
        }
        if (selectedVal == 'high') {
            sortAscending();
        }
        if (selectedVal == 'low') {
            sortDescending();
        }
        if (selectedVal == 'rand') {
            sortRandom();
        }
    };

    const sortAscending = () => {
        const x = [...shoppingLists]
        setMyShoppingLists(x.sort((a, b) => a.name.localeCompare(b.name)));
    };
    const sortDescending = () => {
        const x = [...shoppingLists]
        const ascending =  x.sort((a, b) => a.name.localeCompare(b.name));
        // ascending.sort().reverse();
        setMyShoppingLists(ascending.reverse());
    };
    const sortRandom = () => {
        shuffleArray(shoppingLists);
    };


    function shuffleArray(array) {
        let shuffled = array
            .map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
        console.log(shuffled);
        setMyShoppingLists(shuffled);
    }

    const searchItem = () => {
        let val = searchText;
        if (val && val.trim() !== '') {
            const copyItemsList = shoppingLists.filter(term => {
                return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
            setMyShoppingLists(copyItemsList);
        } else {
            readItemFromStorage();
        }
    };

    const filter = () =>{
        if(selectedFilter == 'all'){
            readItemFromStorage();
        }
        if(selectedFilter == 'completed'){
            const x = [...shoppingLists];
            const filtered = x.filter(({completed}) => completed);
            setMyShoppingLists(filtered)
            console.log(filtered)
        }
        if(selectedFilter == 'inprogress'){
            const x = [...shoppingLists];
            const filtered = x.filter(({completed}) => !completed);
            setMyShoppingLists(filtered)
            console.log(filtered)
        }
    };

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
                    <Title>Listy zakupów</Title>
                </Body>
            </Header>
            <Content
                contentContainerStyle={{
                    justifyContent: 'center',
                    flex: 1,
                    padding: 20,
                }}>

                <View style={{flexDirection: "row", justifyContent: 'center'}}>
                    <Button light onPress={() => renderOption("add")}>
                        <Icon name='ios-add'/>
                    </Button>
                    <Button light onPress={() => renderOption("search")}>
                        <Icon name='ios-search'/>
                    </Button>
                    <Button light onPress={() => renderOption("filter")}>
                        <Icon name='ios-funnel'/>
                    </Button>
                    <Button light onPress={() => renderOption("sort")}>
                        <Icon name='ios-swap'/>
                    </Button>
                </View>

                {option === "add" && (
                    <Form>
                        <Item>
                            <Input
                                placeholder="Dodaj nową listę"
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
                )}
                {checkIfExists && <Text style={{color: 'red'}}>Lista o podanej nazwie istnieje</Text>}


                {option === "sort" && (
                    <Picker
                        selectedValue={selectedVal}
                        onValueChange={selectedVal =>
                            setSelectedVal(selectedVal)
                        }>
                        <Picker.Item label="Domyślnie" value="def"/>
                        <Picker.Item label="Rosnąco" value="high"/>
                        <Picker.Item label="Malejąco" value="low"/>
                        <Picker.Item label="Losowo" value="rand"/>
                    </Picker>
                )}

                {option === "filter" && (
                    <Picker
                        selectedValue={selectedFilter}
                        onValueChange={selectedFilter =>
                            setSelectedFilter(selectedFilter)
                        }>
                        <Picker.Item label="Wszystkie" value="all"/>
                        <Picker.Item label="Zakończone" value="completed"/>
                        <Picker.Item label="Niezakończone" value="inprogress"/>
                    </Picker>
                )}

                {option === "search" && (
                    <Header searchBar rounded>
                        <Item>
                            <Icon name="ios-search"/>
                            <Input placeholder="Szukaj" value={searchText} onChangeText={e => {
                                setSearchText(e);
                            }}/>
                        </Item>
                        <Button transparent>
                            <Text>Search</Text>
                        </Button>
                    </Header>
                )}

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
                                    <Button small
                                            onPress={() => toggleComplete(data)}>
                                        <Icon name={data.completed ? "ios-hammer" : "ios-checkmark-circle-outline"}/>
                                    </Button>
                                    <Button small danger
                                            onPress={() => {
                                                removeItem(data);
                                            }}
                                            color="crimson"
                                    >
                                        <Text>X</Text>
                                    </Button>
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
