import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import host from '@/constants/Env';
import Animated, { SlideInDown, SlideOutLeft } from 'react-native-reanimated';
import { useEffect, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Avatar from '@/components/Avatar';
import { getUserImageUrl } from '../utils/getUserImageUrl';
import Badge from '@/components/badges';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

export default function Conversations({ }) {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userString = await AsyncStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : {};
            setUserId(user.userId);
            setToken(user.token);
            fetch(`http://${host}/api/user/query`)
                .then((data) => data.json())
                .then((res) => { setUsers(res); console.log(res) })
                .catch((err) => console.log(err));
        };
        fetchUser();
    }, []);



    const Header = () => {
        const {t} = useTranslation()
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>{t('people')}</Text>
            </View>
        );
    };

    const goToProfile = (userId: string) => {
        router.push({
            pathname: '/profile/Profile',
            params: {
                personId: userId,// convert object to string
            },
        });
    };
    const renderConversation = ({ item }) => (
        <TouchableWithoutFeedback key={item.id} onPress={() => goToProfile(item.id)}>
            <Animated.View entering={SlideInDown} exiting={SlideOutLeft} style={styles.messageBubble}>
                <Avatar imageUrl={getUserImageUrl(item.id)} flagId={item.country} size={width * 0.15} />
                <View style={styles.messageContent}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.name]}
                    >
                        {item.name}
                    </Text>
                    {item?.badges?.map((badge: string, index: string) => (
                        <Badge key={index} type={badge.name} size={10} />
                    ))}
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" style="light" />
            <Header />
            {users.length > 0 ? (
                <FlatList
                    data={users}
                    renderItem={renderConversation}
                    keyExtractor={(item) => item.id}
                    style={styles.chatArea}
                    contentContainerStyle={{ padding: 10 }}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>There is nothing here</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    // Header styles
    headerContainer: {
        width: '100%',
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#007bff',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,

    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'left',
    },
    // Chat list styles
    chatArea: {
        flex: 1,
        marginTop: 10,
    },
    messageBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 3,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: width * 0.075,
        marginRight: 15,
    },
    messageContent: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    messageText: {
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});
