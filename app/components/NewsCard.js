import React from "react";
import { Text, View, Image, Button, StyleSheet, TouchableOpacity } from "react-native";
import colors        from "../config/colors";
export default function NewsCard({title, timeUpload}) {

    return (<View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
             <Image style={styles.newsImg} source ={require("../assets/test2jpg.jpg")}></Image>
            <Text style={styles.titleText}>
                {title}
            </Text>
            <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnTxt}>View</Text>
            </TouchableOpacity>

            <View style={styles.timeContainer}>
                <Image style={styles.timeIcon} source={require("../assets/icons/time-svgrepo-com.png")}></Image>
                <Text style={styles.timeText}>
                    {timeUpload} Hours ago
                </Text>
            </View>
            
        </View>
       
    </View>);

}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: 'white',
        width: 300,
        // height: 200,
        borderRadius: 30

    },
    innerContainer: {
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10
    },
    newsImg: {
        width: '100%',
        height: 150,
        borderRadius: 30
    },
    titleText: {
        fontSize: 17,
        fontWeight: 700,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    btn: {
        maxWidth: 100,
        backgroundColor: 'black',
        borderRadius: 5,
        marginBottom: 20,
        marginLeft: 10,
    },
    btnTxt: {
        color: 'white',
        padding: 10,
        margin: 'auto',
        paddingLeft: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        paddingLeft: 10,
    },

    timeIcon: {
        width: 20,
        height: 20
    },
    timeText: {
        color: 'gray',
        // paddingBottom: 10,
        paddingLeft: 5,
    }
})