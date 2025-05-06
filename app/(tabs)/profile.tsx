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
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import i18n,{t, initI18next} from'../i18n';
import InfoBadge from '@/components/InfoBadge';
import { SceneMap, TabView } from 'react-native-tab-view';
// import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';


export default function ProfileScreen() {
  const { t } = useTranslation();

  const logout = useLogout();
  interface Profile {
    name?: string;
    followers?: number;
    following?: number;
    age: number;
    gender: string;
    country: string;
    badges?: string[]; // Add other properties of the profile object here if needed
  }

  const [profile, setProfile] = React.useState<Profile>({});
  const [userId, setUserId] = React.useState('');
  const [token, setToken] = React.useState({});


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
    const fetchProfile = async () => {
      try {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : {};
      setUserId(user.userId);
      setToken(user.token);
      try {
        const response = await fetch(`http://${host}/api/user/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId : user.userId, viewerId : user.userId }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProfile(data);

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      }
      catch (error) {
        console.error('Error fetching user data:', error);
      }
      
    }
    fetchProfile();
  }, []);




  return (
    <View style={{flex: 1}}>
      <View style={{paddingTop: 50, backgroundColor: Colors.vip}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Badge type='vip' size={10} />

          <TouchableOpacity onPress={() => router.push('settings')}>
            <Ionicons name="settings" size={30} color="white" />
          </TouchableOpacity>
      </View>
      </View>
    <ImageBackground
       source={flagImages[profile?.country]}
        imageStyle={{ width: '115%', height: '100%', marginLeft: '-7.5%' }}
        resizeMode='cover'
        blurRadius={2}>
       
      
      <LinearGradient colors={['#ffffff3d', '#00000067']} style={styles.header}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%', padding: 15}}>
          <View style={{flex: 1}}>
            <Avatar
              imageUrl={getUserImageUrl(userId)}
              flagId={profile?.country}
              size={120}
            />
          </View>
          
        <View style={styles.stats}>
          <TouchableOpacity style={styles.nobleBtn}>
            <Text style={styles.statItem}>{profile?.following}</Text>
            <Text style={styles.statItem}>{t('following')}</Text>

            </TouchableOpacity>
          
            <TouchableOpacity style={styles.nobleBtn}>
            <Text style={styles.statItem}>{profile?.followers} </Text>
            <Text style={styles.statItem}>{t('followers')}</Text>

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
        <LiveRipple size={10} color='#00ff33' />
      </View>
      <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>


<InfoBadge type="gender" value={[profile?.age, profile?.gender]} size={13} />
<InfoBadge type="active" value={['true', 'live']} size={14} />



</View>

      </View>
        
        
      <View style={styles.vipSection}>

<View style={{flex: 1, padding: 10}}>
  <View style={styles.vipCard}>
          <Text style={styles.vipText}>VIP has taken effect</Text>
          <Text>Expires in 49 days</Text>
        </View>
</View>
        <View style={{flex: 1, padding: 10}}>
          <View style={styles.walletCard}>
          <Text style={styles.walletText}>Wallet</Text>
          <Text>12</Text>
        </View>
        </View>
        
      </View>

<TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: useWindowDimensions().width }}
            style={{ flex: 1 }}
          />

      </View>

    </ScrollView>
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
    fontSize: 24,
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
  }
});
