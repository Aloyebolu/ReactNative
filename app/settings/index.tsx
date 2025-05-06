import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { useLogout } from '../utils/logout';
import { t } from '../i18n';
import { useTranslation } from 'react-i18next';
import { useCustomAlert } from '../context/CustomAlertContext';


const SettingsPage = () => {
    const { t } = useTranslation();
      const [visible, setVisible] = useState(false);
    const [cacheSize, setCacheSize] = useState<number>(0);
    const navigation = useNavigation(); // Initialize navigation
    const logout = useLogout(); // Initialize logout function
    const { showAlert } = useCustomAlert(); // Destructure the showAlert function from the context
    useEffect(() => {
        calculateCacheSize();
    }, []);

    const calculateCacheSize = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const items = await AsyncStorage.multiGet(keys);
            let totalSize = 0;
            items.forEach(([key, value]) => {
                totalSize += key.length + (value?.length || 0);
            });
            setCacheSize(parseFloat((totalSize / 1024).toFixed(2))); // Convert to KB
        } catch (error) {
            Alert.alert('Error', 'Failed to calculate cache size.');
            console.error('Error calculating cache size:', error);
        }
    };

    const clearCache = async () => {
        try {
            setCacheSize(0);
            if(Platform.OS === 'web') {
                const confirmed = window.confirm('Are you sure you want to clear the cache?');
                if (confirmed) {
                    await AsyncStorage.removeItem('profiles'); // Clear specif
                    setCacheSize(0); // Reset cache size to 0
                }
            }else{
                Alert.alert('Clear Cache', 'Are you sure you want to clear the cache?', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Clear',
                        onPress: async () => {
                            await AsyncStorage.removeItem('profiles'); // Clear specif
                            // Clear all cache
                            setCacheSize(0) // Recalculate cache size
                        },
                    },
                ]);
            }
            Alert.alert('Cache Cleared', 'All cached data has been cleared.');
        } catch (error) {
            Alert.alert('Error', 'Failed to clear cache.');
            console.error('Error clearing cache:', error);
        }
    };

    const handleLogout = () => {
        console.log('hi')
        showAlert({ message: 'Are you sure you want to logout', cancel: t("cancel"), cancelDisplayed : true, position: 'bottom', onConfirm() {
            logout()
        }, });
    };

    // Function to navigate to the Languages screen
    const navigateToLanguages = () => {
        navigation.navigate('Languages'); // Replace 'Languages' with the actual screen name in your navigator
    };

    const settingsOptions = [
        { id: '1', title: t('account_security'), icon: 'security' },
        { id: '2', title: t('language'), icon: 'language', action: navigateToLanguages }, // Add navigation action
        { id: '3', title: t('display_over_other_apps'), icon: 'apps' },
        { id: '4', title: t('notification_settings'), icon: 'notifications' },
        { id: '5', title: t('blocked_users'), icon: 'block' },
        { id: '6', title: t('hide_online_status'), icon: 'visibility-off' },
        { id: '7', title: t('customer_service_help'), icon: 'help' },
        { id: '8', title: t('about'), icon: 'info' },
        { id: '9', title: `${t('clear_cache')} (${cacheSize} KB)`, icon: 'delete', action: clearCache },
        { id: '10', title: t('logout'), icon: 'exit-to-app', action: handleLogout },
    ];

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={item.action ? item.action : () => console.log(`${item.title} pressed`)}
            accessibilityLabel={item.title}
            accessibilityRole="button"
        >
            <Icon name={item.icon} size={24} color="#555" />
            <Text style={styles.itemText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={settingsOptions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    list: {
        padding: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        elevation: 1,
    },
    itemText: {
        marginLeft: 16,
        fontSize: 16,
        color: '#333',
        flex: 1, // Ensure text takes up remaining space
    },
});

export default SettingsPage;