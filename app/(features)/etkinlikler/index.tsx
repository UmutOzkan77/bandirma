import { View, Text, StyleSheet } from 'react-native';

export default function EtkinliklerScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Etkinlikler Sayfası</Text>
            <Text>Buraya etkinlikler modülü geliştirilecek.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
