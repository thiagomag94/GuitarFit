import { View, Text } from 'react-native';
export const Progresso = () => {
    return (
        <View className="flex-1 items-center justify-center bg-gray-100">
            <Text className="text-2xl font-bold">Meu Progresso</Text>
            <Text className="text-gray-500 mt-2">Aqui você pode acompanhar seu progresso nos treinos.</Text>
        </View>
    );
}

export default Progresso;