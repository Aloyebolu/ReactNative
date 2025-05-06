import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import LiveRipple from './animation/LiveAnimation';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
// The prop types will be dynamic so we handle them accordingly
interface InfoBadgeProps {
  type: string;
  value: Array<string>;
  size?: string;
}

const InfoBadge: React.FC<InfoBadgeProps> = ({ type, value, size = 'medium' }) => {
  // Default style size for medium (you can extend for small, large, etc.)

  const getTypeStyle = (type) => {
    switch (type) {
      case 'gender':
            if (value[1] === 'm') {
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <Ionicons name="male" size={size} color={Colors.blue} />
                        <Text style={[styles.typeText, { color: Colors.blue, fontSize: size }]}>{value[0]} </Text>
                    </View>
                );
          }else{
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <Ionicons name="female" style={{transform: 'rotate(45deg)'}} size={size} color={Colors.pink} />
                    <Text style={[styles.typeText, { color: Colors.pink, fontSize: size }]}>{value[0]} </Text>
                </View>
            );
          }
      case 'country':
        return (
          <Text style={[styles.countryText]}>{type}: </Text>
        );
      case 'active':
        if(value[0] === 'true') {
            if(value[1] === 'live') {
                return (
                    <Text style={[styles.timeText]}><LiveRipple size={size} /></Text>
                );
            }else{
                return (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: size/2, height: size/2, borderRadius: 9999, backgroundColor: '#00e600', marginRight: 5}} />
                    <Text style={[styles.timeText]}> Online</Text>
                </View>
                );
            }
        }else{
            return (
                <Text style={[styles.timeText]}>{type}: {value[1]} days ago</Text>
                
            );
        }
      default:
        return (
          <Text style={[styles.basicText]}>{type}: </Text>
        );
    }
  };

  return (
    <View style={[styles.container, { padding: size/3, fontSize: size }]}>
      {getTypeStyle(type)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000017',
    borderRadius: 50
  },
  typeText: {
    fontWeight: 'bold',
    marginRight: 5,
    color: 'green'
  },
  valueText: {
    fontSize: 16,
    color: 'black',
  },
  basicText: {
    color: 'black',
  },
  countryText: {
    color: 'blue',
  },
  timeText: {
    color: 'green',
  },
});

export default InfoBadge;
