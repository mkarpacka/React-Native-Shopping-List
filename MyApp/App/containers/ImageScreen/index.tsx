import React, {PureComponent, useEffect, useState} from 'react';
import {AppRegistry, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {NavigationStackProp} from "react-navigation-stack";
import {Button, Icon} from "native-base";
import AsyncStorage from "@react-native-community/async-storage";

const PendingView = () => (
    <View
        style={{
            flex: 1,
            backgroundColor: 'lightgreen',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Text>Otwieranie aparatu</Text>
    </View>
);

type Props = {
    navigation: NavigationStackProp;
};

const ImageScreen = ({navigation}: Props) => {
    const result : string[] = [];
    const [filenameList, setFilenameList] = useState(result);

    useEffect(() => {
        readItemFromStorage();

    }, []);

    const DATABASE_getItems = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let returnedItems = await AsyncStorage.getItem('images');
                resolve(returnedItems)
            } catch (error) {
                reject(new Error('Error getting items from AsyncStorage: ' + error.message))
            }
        });
    };

    const readItemFromStorage = async () => {
        try {
            let items: any = await DATABASE_getItems();
            if (items) setFilenameList(JSON.parse(items));
            console.log(items);

        } catch (error) {
            console.log(error);
        }
    };

    const takePicture = async function (camera) {
        const options = {quality: 1, base64: true};
        const imageData = await camera.takePictureAsync(options);

        save(imageData)
    };

    const save = (imageData) => {
        const RNFS = require('react-native-fs');
        let filename: string = '/' + imageData.uri.substring(imageData.uri.lastIndexOf('/') + 1);
        let path: string = RNFS.DocumentDirectoryPath + filename;

        RNFS.writeFile(path, imageData.base64, 'base64')
            .then((success) => {
                console.log(filename);
                let copyFilenameList: string[] = [...filenameList];
                copyFilenameList.push(imageData.uri);
                setFilenameList(copyFilenameList);
                console.log('JPG WRITTEN!');

                writeItemToStorage(copyFilenameList);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const writeItemToStorage = async (filenameList: any) => {
        await AsyncStorage.setItem('images', JSON.stringify(filenameList)).then(() => {
            console.log("It was saved successfully");
            console.log(filenameList);
        })
            .catch(() => {
                console.log("There was an error saving lists")
            });
    };


    return (
        <View style={styles.container}>
            <RNCamera
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
            >
                {({camera, status}) => {
                    if (status !== 'READY') return <PendingView/>;
                    return (
                        <>
                            <View style={{flex: 0}}>
                                <Button
                                    onPress={() => navigation.navigate('ManageImageScreen')}><Text>Back</Text></Button>
                            </View>
                            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
                                <TouchableOpacity onPress={() => takePicture(camera)} style={styles.capture}>
                                    <Icon name='ios-camera'/>
                                </TouchableOpacity>
                            </View>
                        </>

                    );
                }}
            </RNCamera>
        </View>
    );
};

export default ImageScreen;

ImageScreen.navigationOptions = {
    header: null,
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});

