import {NavigationStackProp} from "react-navigation-stack";
import React, {useEffect} from "react";
import Pdf from 'react-native-pdf';
import {Dimensions, PermissionsAndroid, StyleSheet} from "react-native";

type Props = {
    navigation: NavigationStackProp;
};
import {
    Text,

} from 'react-native';
import {Body, Button, Container, Header, Icon, Left, Title} from "native-base";
import {DrawerActions} from "react-navigation-drawer";

export const OpenPdfScreen = ({navigation}: Props) => {

    // const source = require('./data/user/0/com.myapp/files/data.pdf');
    // const source = {uri: 'file:///data/user/0/com.myapp/files/data.pdf'};
    // const source = {uri: '/storage/emulated/0/data.pdf'};
    // const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
    const source = {uri:"data:application/pdf;base64,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oWLI6EsVMAhyWpclPULWXd6dBi1jnfn733GecjIzEl9bmt1CglOtsb0GIZKWaAVPM1gDoEW0S2la4XHoCOaz5Pd6mXGX1PbHLq8781XUw70ZfqjOt7hOvVC9w8JkGOpsRPou8/fRBvUrNTruhdbye4On2eMvPZOy+TmKhq1Y65fDaURDegIaKAAYPuH+wUUBWoB1md6tQ5YMHbpkSEVBSUnBXcOHA1sPldw7UM5NgypmNxjJLXwTFoAfWz23GvvV8Dq2ceRb2Ij9DGw12NbrWMjhtsJ05i2oZ29AkKvF/b+CGYwLtsqQO1Y2lgex7m0JNZPODfL6PhEjO2tmnkxy3e6y+aUymZ0nM7kyGSjlyWyue6TMZo2cEPSE3GF3eExl2D3SPa+iUuaytB4X5oZD+W4ZJgbnI50UlOSSkKt7ODcUKs6TOSqG08SEQyhgQZeABZoAPB/Nk/ncsW6Z9ZYHHwjKa0tdcklpyCVJ7jL5cHlQPlzqkkKhPFnXraM79u+Tpq0+V9YNzJMNMQkTg3KJS4ZQOBzjPJK8Nhx2hdGCOH+4J99M4M6JksQJ9EBZM1lbrq2s9UguOuGRPBJqGCrNk425YycGy1BFCVVMypWzy/JkU648ADtzbqQ/qXOHJwZbSoCDOc0GqJsUbIFs9ovqkEv2oHB3XbMA3XPUyuRcuaSu2Q3TgpEBUOpqgQHsF6WhvP8DkkbPHgplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCAxOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDIwNDcgMDAwMDAgbiAKMDAwMDAwMjEwNCAwMDAwMCBuIAowMDAwMDAxOTg1IDAwMDAwIG4gCjAwMDAwMDE5NjQgMDAwMDAgbiAKMDAwMDAwMDI5MiAwMDAwMCBuIAowMDAwMDAwMTc1IDAwMDAwIG4gCjAwMDAwMDAwNjUgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAxODE2IDAwMDAwIG4gCjAwMDAwMDA2OTggMDAwMDAgbiAKMDAwMDAwMDYxMCAwMDAwMCBuIAowMDAwMDAwNjM2IDAwMDAwIG4gCjAwMDAwMDA2NjIgMDAwMDAgbiAKMDAwMDAwMjE1MSAwMDAwMCBuIAowMDAwMDAwNzc0IDAwMDAwIG4gCjAwMDAwMDEwNDAgMDAwMDAgbiAKMDAwMDAwMTQ2OCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDE4Ci9Sb290IDMgMCBSCi9JbmZvIDEwIDAgUgovSUQgWzw1OWJmZjBmOTFiNDdmY2QwYjIwNzhhZjUwMzM0MWNlYj4gPDU5YmZmMGY5MWI0N2ZjZDBiMjA3OGFmNTAzMzQxY2ViPl0KPj4Kc3RhcnR4cmVmCjUwNTMKJSVFT0YK"};

    useEffect(() => {
        requestExternalStoragePermission();
    }, []);

    const requestExternalStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'My App Storage Permission',
                    message: 'My App needs access to your storage ' +
                        'so you can save your photos',
                },
            );
            return granted;
        } catch (err) {
            console.error('Failed to request permission ', err);
            return null;
        }
    };

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
            <Text>PDF </Text>
            <Pdf
                source={source}
                style={styles.pdf}
            />
        </>
    )

}

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
