import { View, Text, StyleSheet } from 'react-native';

export default function DevamsizlikScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Devamsızlık Sayfası</Text>
            <Text>Buraya devamsızlık modülü geliştirilecek.</Text>
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
