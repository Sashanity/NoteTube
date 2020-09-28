import React from 'react';
import { Component } from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
let json = {
    "time": 1554920381017,
    "blocks": [
        {
            "type": "header",
            "data": {
                "text": "Hello Editor.js",
                "level": 2
            }
        },
    ],
    "version": "2.12.4"
}


// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

// Create Document Component
class MyDocument extends Component {
    render() {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text>Section #1</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>Section #2</Text>
                    </View>
                </Page>
            </Document>
        )
    }
}
ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);
