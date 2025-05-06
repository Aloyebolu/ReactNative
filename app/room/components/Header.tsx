// components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Chat from './Chat';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
// const insets = useSafeAreaInsets();
const Header = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
    <View style={styles.headerContiner}>
      <View style={styles.firstSection}>
<TouchableOpacity onPress={() => {router.back()}}>

        <Icon name="arrow-back" size={24} color="#fff" />
</TouchableOpacity>
        <View style={styles.centerSection}>
          <Text style={styles.title}>{t("topic_not_set")}</Text>
          <Text style={styles.roomId}>{t("id")}:19348776</Text>
        </View>
      </View>


      
      <View style={styles.secondSection}>
      <TouchableOpacity>
        <Icon name="copy-outline" size={24} color="#fff" />
      </TouchableOpacity>
      </View>
    </View>
    <Chat />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
      flex: 1,
       position: 'absolute', 
       top: 0, 
       left: 0, 
       right: 0,
       zIndex: 100,
    }
  ,
  headerContiner: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
paddingVertical: 40,
position: 'absolute',
flex: 1,
// top: 
  },
  centerSection: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  roomId: {
    color: '#ccc',
    fontSize: 12,
  },firstSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:15,
    backgroundColor: '#2228',
    borderRadius: 50,
    marginRight: 10,
    // maxWidth: '30%',
    flexShrink: 1
  }, secondSection: {
    flex: 1,
    padding: 10,

    width: 2,
  },
});

export default Header;
