import { StyleSheet, Image, Platform } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TextCardContent from '@/components/TextCardContent';

export default function TabTwoScreen() {
  const workList = [
    {
        location: 'T.Nagar',
        task: 'Inspection'
    },
    {
        location: 'Mylapore',
        task: 'Well cleaning'
    },
    {
        location: 'Chethpet',
        task: 'Afforestation'
    },
    {
        location: 'Anna Salai',
        task: 'Road Cleaning'
    },
    {
        location: 'Anna Nagar',
        task: 'Field clearing'
    },
]
  return (
    <ParallaxScrollView
    headerBackgroundColor={{ light: '#DD9BCF', dark: '#DD9BCF' }}
    headerName='Location'
    >
      {workList.map((work, index)=>(
     <TextCardContent key={index} title={work.location} work={work.task}/>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
