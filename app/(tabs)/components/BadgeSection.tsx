import InfoBadge from '@/components/InfoBadge';
import TimeChangeAnimation from '@/components/TimeChangeAnimation';
import { View, Text, StyleSheet } from 'react-native';

export default function ClippedTag() {
  const myTimestamp = '1745677071322';
  return (
    <View style={{ flex: 1, padding: 20 }}>
      
      <View style={styles.clipBackground} />

      <View style={styles.tag}>
        <Text style={styles.text}>Pinned!</Text>
      </View>
<TimeChangeAnimation timestamp={myTimestamp}></TimeChangeAnimation>
<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>


<InfoBadge type="active" value={['true', 'live']} size={20} />
<InfoBadge type="active" value={['true', 'liv']} size={20} />
<InfoBadge type="gender" value={['19', 'm']} size={17} />
<InfoBadge type="gender" value={['17', 'f']} size={17} />



</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 5, // shadow on Android
    shadowColor: '#000', // shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 2,
  },
  clipBackground: {
    position: 'absolute',
    top: 12,
    right: 30,
    width: 20,
    height: 20,
    backgroundColor: '#555',
    transform: [{ rotate: '45deg' }],
    zIndex: 1,
    borderRadius: 3,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
