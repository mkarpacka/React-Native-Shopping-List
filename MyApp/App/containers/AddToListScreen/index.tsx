import React from "react";
import {NavigationStackProp} from "react-navigation-stack";
import {Button, View, Text, StyleSheet, TextInput} from "react-native";
import {Body, Container, Content, Header, Icon, Left, Title} from "native-base";
import {DrawerActions} from "react-navigation-drawer";

type Props = {
    navigation: NavigationStackProp;
};

interface IToDo {
    text: string;
    completed: boolean;
}

export const AddToListScreen = ({navigation}: Props) => {
    const [value, setValue] = React.useState<string>("");
    const [toDoList, setToDos] = React.useState<IToDo[]>([]);


    const handleSubmit = (): void => {
        if (value.trim())
            setToDos([...toDoList, {text: value, completed: false}]);
        else console.log("error");
        setValue("");
    };

    const toggleComplete = (index: number): void => {
        const newToDoList = [...toDoList];
        newToDoList[index].completed = !newToDoList[index].completed;
        setToDos(newToDoList);
    };

    const removeItem = (index: number): void => {
        const newToDoList = [...toDoList];
        newToDoList.splice(index, 1);
        setToDos(newToDoList);
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
                    <Title>Dodaj produkt</Title>
                </Body>
            </Header>
            <Content
                contentContainerStyle={{
                    justifyContent: 'center',
                    flex: 1,
                    padding: 20,
                }}>
                    {/*<TextInput style={styles.inputStyle} placeholder="Enter your todo task..." onChangeText={e => {}}> </TextInput>*/}
                    <TextInput
                        placeholder="Dodaj do listy..."
                        value={value}
                        onChangeText={e => {
                            setValue(e);
                        }}
                        style={styles.inputStyle}
                    />
                    < Button
                        title="Dodaj"
                        onPress={handleSubmit}
                    />


                <Text style={styles.subtitle}>Twoja lista :</Text>
                {toDoList.length === 0 && <Text>Lista jest pusta</Text>}
                {toDoList.map((toDo: IToDo, index: number) => (
                    <View style={styles.listItem} key={`${index}_${toDo.text}`}>
                        <Text
                            style={[
                                styles.task,
                                { textDecorationLine: toDo.completed ? "line-through" : "none" }
                            ]}
                        >
                            {toDo.text}
                        </Text>
                        <Button
                            title={toDo.completed ? "Completed" : "Complete"}
                            onPress={() => toggleComplete(index)}
                        />
                        <Button
                            title="X"
                            onPress={() => {
                                removeItem(index);
                            }}
                            color="crimson"
                        />
                    </View>
                    ))}
            </Content>
        </Container>
)
};

AddToListScreen.navigationOptions = {
    header: null,
};

export default AddToListScreen;



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

