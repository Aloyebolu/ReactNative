// ProfileScreen.js
import React, { useEffect } from 'react';
// import { StyleSheet, View } from 'react-native';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Badge from '@/components/badges';
import Avatar from '@/components/Avatar';
import { flagImages } from '../utils/loadFlagFiles';
import { Colors } from '@/constants/Colors';
import {useLogout} from '../utils/logout';
import host from '@/constants/Env';
import LiveRipple from '@/components/animation/LiveAnimation';
import { getUserImageUrl } from '../utils/getUserImageUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { followUser } from '../services/followService';
import { t } from '../i18n';
import { SceneMap, TabView } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';

// import Icon from 'react-native-vector-icons/Ionicons';

export default function Profile() {
  interface Profile {
    name?: string;
    followers?: number;
    following?: number;
    followed?: boolean;
    age: number;
    gender: string;
    country: string;
    badges?: string[]; // Add other properties of the profile object here if needed
  }

  const [profile, setProfile] = React.useState<Profile>({});
  const [userId, setUserId] = React.useState('');
  const [token, setToken] = React.useState({});
  const { personId } = useLocalSearchParams();
  const { t } = useTranslation();


    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'badges', title: t('badges') },
      { key: 'relation', title: t('relation') },
      { key: 'posts', title: t('posts') },
      { key: 'profile', title: t('profile') },
    ]);
  
    const renderScene = SceneMap({
      badges: () => (
        <View style={styles.tabContent}>
          {
            profile?.badges?.map((value, index)=>(
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Badge key={index} type={value.name} />
              </View>
            ))
          }
        </View>
      ),
      relation: () => (
        <View style={styles.tabContent}>
          <Text>{t('Relation Content')}</Text>
        </View>
      ),
      posts: () => (
        <View style={styles.tabContent}>
          <Text>{t('Posts Content')}</Text>
        </View>
      ),
      profile: () => (
        <View style={styles.tabContent}>
          <Text>{t('Profile Content')}</Text>
        </View>
      ),
    });



  useEffect(() => {
    (async () => {
      const userString = await AsyncStorage.getItem(`profiles`);
              const fetchProfile = async () => {
          try {
            const userString = await AsyncStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : {};

            setUserId(user.userId);
            setToken(user.token);

            const response = await fetch(`http://${host}/api/user/profile`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ userId : personId, viewerId : user.userId }),
            });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProfile(data);
            AsyncStorage.setItem(`profiles`, JSON.stringify({personId, data}));
          } catch (error) {
            console.error('Error fetching profile or user data:', error);
          }
        };
      if (userString) {
        // Parse the user string to get the user object
        const user = JSON.parse(userString);
        if (user.personId == personId) {

          setProfile(user.data);
          fetchProfile()

        }else{
        fetchProfile()
          
        }
      } else {

        fetchProfile();
      }
    })();
  }, [personId]);




  return (
    <View style={{flex: 1}}>
    <ImageBackground
       source={flagImages[profile?.country]}
        imageStyle={{ width: '115%', height: '100%', marginLeft: '-7.5%' }}
        resizeMode='cover'
        blurRadius={2}>
       
      
      <LinearGradient colors={['#ffffff00', '#000000ff']} style={styles.header}>
        <Badge type='vip' size={10} />
        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%', padding: 15}}>
          <View style={{flex: 1}}>
            <Avatar
              imageUrl={getUserImageUrl(personId)}
              flagId={profile?.country}
              size={120}
            />
          </View>
          
        <View style={styles.stats}>
          <TouchableOpacity style={styles.nobleBtn}>
            <Text style={styles.statItem}>{profile?.following}</Text>
            <Text style={styles.statItem}>{t("following")}</Text>

            </TouchableOpacity>
          
            <TouchableOpacity style={styles.nobleBtn}>
            <Text style={styles.statItem}>{profile?.followers} </Text>
            <Text style={styles.statItem}>{t("followers")}</Text>

            </TouchableOpacity>
        </View>
        </View>
        


        
    </LinearGradient>
      </ImageBackground>

    <ScrollView style={styles.container}>
  
      <View style={styles.body}>

      
      <View style={styles.name}>
        <Text style={styles.username}>{profile?.name}</Text>
        {
          profile?.badges?.map((badge, index) => (
            <Badge key={index} type={badge.name} size={10} />
          ))
        }
        <LiveRipple size={10} color='red' />
      </View>
        

<TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: useWindowDimensions().width }}
            style={{ flex: 1 }}
          />
      <View style={styles.giftItem}>
        <Text style={styles.giftText}>Log Out</Text>
      </View>
      </View>

    </ScrollView>
    <View style={styles.bottom}>
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button, 
          profile.followed && { flex: 1.2, display: 'none' },
          !profile.followed && { flex: 1.2, display: 'flex' },
        ]}
      >
      <TouchableOpacity onPress={() => {followUser( userId, personId)}}>
      
        <Text style={styles.buttonText}>{t("follow")}</Text>
      
      </TouchableOpacity></LinearGradient>
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button,  {flex: 2}]}
      >
      <TouchableOpacity >
        <Text style={[styles.buttonText]}>{t('message')}</Text>
      </TouchableOpacity>
      </LinearGradient>
      <View style={{flex: 0.5}}>
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, {width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}]}>
      <TouchableOpacity>
        <Text style={styles.buttonText}>{t("gift")}</Text>
      </TouchableOpacity>
      </LinearGradient>
      </View>
    </View>
    </View>


  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 300
  },
  body : {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    zIndex: 232232324
  },
  nobleBtn: {
    alignSelf: 'center',
    // backgroundColor: '#ffcc00',
    borderRadius: 15,
    padding: 5
  },
  nobleText: {
    color: '#fff',
    fontSize: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  username: {
    fontSize: 22,
    marginVertical: 5,
    color: Colors.vip,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 14,
    color: '#eee',
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    width: '100%',
    alignContent: 'center',
  },
  statItem: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 0

  },
  vipSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  vipCard: {
    backgroundColor: '#f9d776',
    padding: 10,
    borderRadius: 10,
  },
  vipText: {
    fontWeight: 'bold',
  },
  walletCard: {
    backgroundColor: '#c2f0f7',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  walletText: {
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  tab: {
    color: '#888',
  },
  tabActive: {
    color: '#00c6ff',
    fontWeight: 'bold',
  },
  giftItem: {
    padding: 20,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  giftText: {
    fontSize: 16,
  },name : {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10

  },
  button: {
    alignItems: 'center',
    borderRadius: 5550,
    // backgroundColor: '#222',
    padding: 10,
    height : 50
    
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  },gradient : {
    borderRadius: 5550,
  }
});
