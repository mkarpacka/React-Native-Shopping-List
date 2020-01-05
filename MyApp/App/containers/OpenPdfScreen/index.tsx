import {NavigationStackProp} from "react-navigation-stack";
import React, {useEffect, useState} from "react";
import Pdf from 'react-native-pdf';
import {Dimensions, PermissionsAndroid, StyleSheet} from "react-native";
import {Body, Button, Text, Container, Header, Icon, Left, Title} from "native-base";
import {DrawerActions} from "react-navigation-drawer";

type Props = {
    navigation: NavigationStackProp;
};

export const OpenPdfScreen = ({navigation}: Props) => {

    const [path, setPath] = useState("");
    const [source, setSource] = useState({});

    useEffect(() => {
        requestExternalStoragePermission();
        loadContent();
    }, []);

    const requestExternalStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
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

    async function loadContent() {
        if (navigation.state.params !== undefined) {
            const pathToWrite = await navigation.getParam('pathToWrite');
            setPath(pathToWrite);
            setSource({uri: 'file://' + pathToWrite});
            console.log(pathToWrite);
        }
    }

    return (
        <>
            <Header>
                <Left>
                    <Button
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <Icon name='menu'/>
                    </Button>
                </Left>
                <Body>
                    <Title>PDF</Title>
                </Body>
            </Header>
            <Text>{path}</Text>
            <Pdf
                source={source}
                style={styles.pdf}
            />
        </>
    )

};

OpenPdfScreen.navigationOptions = {
    header: null,
};

export default OpenPdfScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width
    }
});
