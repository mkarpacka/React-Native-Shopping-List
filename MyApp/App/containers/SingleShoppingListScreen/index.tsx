import {NavigationStackProp} from "react-navigation-stack";
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
    Picker
} from "native-base";
import {StyleSheet, View,} from "react-native";
import {DrawerActions} from "react-navigation-drawer";
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {Checkbox} from 'react-native-material-ui';
import * as faker from "faker";


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
    const [selectedVal, setSelectedVal] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");
    const [option, setOption] = useState("");
    const [searchText, setSearchText] = useState("");
    const [fakeShoppingList, setFakeShoppingList] = useState<ItemsList[]>([]);


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
        // console.log('items po effect', itemsList)
    }, [itemsList]);

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

    const clicked = (checked: any, item: any) => {
        const index = itemsList.findIndex(({name}) => name === item.name);
        const copy = [...itemsList];
        copy[index].isChecked = checked
        setItemsList(copy)
        writeItemToStorage(copy);
    }


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
        const x = [...itemsList]
        setItemsList(x.sort((a, b) => a.name.localeCompare(b.name)));
    };
    const sortDescending = () => {
        const x = [...itemsList]
        const ascending = x.sort((a, b) => a.name.localeCompare(b.name));
        // ascending.sort().reverse();
        setItemsList(ascending.reverse());
    };
    const sortRandom = () => {
        shuffleArray(itemsList);
    };


    function shuffleArray(array) {
        let shuffled = array
            .map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
        console.log(shuffled);
        setItemsList(shuffled);
    }

    const renderOption = (name: string) => {
        console.log(name);
        setOption(name);
    };


    const searchItem = () => {
        let val = searchText;
        if (val && val.trim() !== '') {
            const copyItemsList = itemsList.filter(term => {
                return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
            setItemsList(copyItemsList);
        } else {
            readItemFromStorage();
        }
    };

    const generateFakerJsData = () => {
        const newFakeShoppingList = [...fakeShoppingList];
        for (let i = 0; i < 50; i++) {
            let productFakeName = faker.fake("{{commerce.product}}");
            newFakeShoppingList.push({isChecked: false, name: productFakeName});
        }
        console.log(newFakeShoppingList);
        setFakeShoppingList(newFakeShoppingList);
        const temp = [...itemsList, ...newFakeShoppingList];
        setItemsList(temp);
        writeItemToStorage(temp);
    };

    const removeItem = (elem: ItemsList): void => {
        const copyItemsList = [...itemsList];
        let index = copyItemsList.indexOf(elem);
        copyItemsList.splice(index, 1);
        setItemsList(copyItemsList);
        writeItemToStorage(copyItemsList);
        readItemFromStorage();
    };

    const filter = () => {
        if (selectedFilter == 'all') {
            readItemFromStorage();
        }
        if (selectedFilter == 'completed') {
            const x = [...itemsList];
            const filtered = x.filter(({isChecked}) => isChecked);
            setItemsList(filtered)
            console.log(filtered)
        }
        if (selectedFilter == 'inprogress') {
            const x = [...itemsList];
            const filtered = x.filter(({isChecked}) => !isChecked);
            setItemsList(filtered)
            console.log(filtered)
        }
    };

    const finishedCount = itemsList.filter(({isChecked}) => isChecked).length;

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
                    <Title style={{paddingLeft: 20}} >{singleList.name}</Title>
                </Body>
                <Right>
                    <Button
                        onPress={() => navigation.navigate('EditShoppingListScreen', {data: singleList})}
                    >
                        <Icon name='settings'/>
                    </Button>
                </Right>
            </Header>
            <Content
                contentContainerStyle={{
                    flex: 1,
                    paddingLeft: 20,
                    paddingRight: 20,
                }}>

                <View style={{flexDirection: "row", justifyContent: 'center'}}>
                    {!singleList.completed && (<Button light onPress={() => renderOption("add")}>
                        <Icon name='ios-add'/>
                    </Button>)}
                    <Button light onPress={() => renderOption("search")}>
                        <Icon name='ios-search'/>
                    </Button>
                    <Button light onPress={() => renderOption("filter")}>
                        <Icon name='ios-funnel'/>
                    </Button>
                    <Button light onPress={() => renderOption("sort")}>
                        <Icon name='ios-swap'/>
                    </Button>
                    <Button light onPress={() => renderOption("generate")}>
                        <Icon name='ios-build'/>
                    </Button>
                </View>

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

                {option === "sort" && (
                    <Picker
                        selectedValue={selectedVal}
                        style={{height: 50}}
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
                        style={{height: 50}}
                        onValueChange={selectedFilter =>
                            setSelectedFilter(selectedFilter)
                        }>
                        <Picker.Item label="Wszystkie" value="all"/>
                        <Picker.Item label="Zakończone" value="completed"/>
                        <Picker.Item label="Niezakończone" value="inprogress"/>
                    </Picker>
                )}

                {singleList.completed && <Text>Lista zakończona</Text>}
                {(!singleList.completed && option === "add") && (
                    <View>
                        <Form>
                            <Item>
                                <Input
                                    placeholder="Dodaj nowy produkt"
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
                    </View>

                )}
                {itemsList.length > 0 && (<Text>Twoje zakupy {finishedCount}/{itemsList.length}</Text>)}
                {itemsList.length === 0 && <Text>Nie dodano produktów</Text>}
                {itemsList.length > 0 && (
                    <List
                        dataArray={itemsList}
                        renderRow={data => {
                            return (
                                <ListItem key={data.name}>
                                    <Checkbox label={data.name} checked={data.isChecked} value="temp"
                                              onCheck={checked => {
                                                  clicked(checked, data);
                                              }}/>
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
                {option === "generate" && (
                    <Button small light style={{justifyContent: 'center'}} onPress={() => generateFakerJsData()}>
                        <Text>Dodaj wygenerowane dane</Text>
                    </Button>
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
