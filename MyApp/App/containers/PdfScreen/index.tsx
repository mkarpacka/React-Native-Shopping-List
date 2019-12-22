import React, { Component } from 'react';

import {
    Text,
    TouchableHighlight,
    View,
} from 'react-native';

import { RNHTMLtoPDF } from 'react-native-html-to-pdf'
import {NavigationStackProp} from "react-navigation-stack";

type Props = {
    navigation: NavigationStackProp;
};

export const PDFScreen = ({navigation}: Props) => {
    const createPDF = async () => {
        let options = {
            html: '<h1>PDF TEST</h1>',
            fileName: 'test',
            directory: 'Documents',
        };

        // let file = await RNHTMLtoPDF.convert(options)
        // console.log(file.filePath);
        // alert(file.filePath);

        try {
            let file = await RNHTMLtoPDF.convert(options)
            console.log('Succe ss', file)
        } catch (err){
        console.log(err)
    }
    }


        return(
            <View>
                <TouchableHighlight onPress={createPDF}>
                    <Text>Create PDF</Text>
                </TouchableHighlight>
            </View>
        )
    }

PDFScreen.navigationOptions = {
    header: null,
};

export default PDFScreen;
