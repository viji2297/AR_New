import { LogoutFunction } from '@/app/Services/Authentication';
import FloatingButton from '@/components/FAB';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { FlatList, ToastAndroid, View } from 'react-native';
import { Divider, Icon, IconButton, MD3Colors, Menu, PaperProvider, useTheme } from 'react-native-paper';
import ImageCardCover from '../../components/ImageCardCover';
import { ThemedView } from '../Components/Common/Theme';
import { configuration } from '../Configuration/ServerConfig';
import { TransactionType } from '../Datatype/interface';
import database from '../LocalStorage/database';

export default function HomeScreen() {
  const theme = useTheme();

  const [imagesToDisplay, setImagesToDisplay] = useState<TransactionType[]>([])
  const [lastObj,setLastObj] = useState<TransactionType>()
  const [visible, setVisible] = React.useState(false);
  const [nestedMenuVisible, setNestedMenuVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const openNestedMenu = () => setNestedMenuVisible(true);
  const closeNestedMenu = () => setNestedMenuVisible(false);
  
  const getImagesToDisplay = async () => {
    const imagesList = await database.get('transactions').query().fetch()
    const parsedImageList: TransactionType[] = imagesList.map((item:any) => item._raw as any)
    console.log("parsedImageList",parsedImageList);
    
    setImagesToDisplay(parsedImageList)
    const lastAddedObj = parsedImageList[parsedImageList.length -1]
    console.log("lastAddedObj",lastAddedObj);
    setLastObj(lastAddedObj)    
  }

  useEffect(() => {
    getImagesToDisplay()
  }, [])

  const handleLogout = async () => {
    console.log("inside logout");

    let loginId = await AsyncStorage.getItem('loginId');
    console.log("loginId",loginId);
    
    const logout = await LogoutFunction(loginId, configuration.companyID);
    if (logout) {
      ToastAndroid.showWithGravity("Logout Successfully", ToastAndroid.SHORT, ToastAndroid.CENTER);
      await AsyncStorage.clear();
      router.replace("/SignIn");
    } else {
      console.log("Something went wrong");
    }
  };
  
  
  const handleOnPress = () => {
    router.replace('/Camera')
  }

  return (
    <>
      <PaperProvider>
      <ParallaxScrollView
  headerBackgroundColor={{ light: '#DD9BCF', dark: '#DD9BCF' }}
  headerComponent={
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 40, 
      height: 120, 
      width: '100%',
    }}>
      <ThemedText type="title" style={{ color: '#F6FFEE' }}>AR</ThemedText>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon="menu"
            size={30}
            onPress={openMenu}
            iconColor="#F6FFEE"
          />
        }
        contentStyle={{ backgroundColor: theme.colors.surface }}
      >
        <Menu.Item onPress={() => { }} title="Profile" />
        <Menu.Item onPress={openNestedMenu} title="View" />
        <Divider />
        <Menu.Item onPress={handleLogout} title="Logout" />
      </Menu>

      <Menu
        visible={nestedMenuVisible}
        onDismiss={closeNestedMenu}
        anchor={<View />} 
        contentStyle={{ backgroundColor: theme.colors.surface }}
      >
        <Menu.Item onPress={() => console.log("Option 1")} title="Option 1" />
        <Menu.Item onPress={() => console.log("Option 2")} title="Option 2" />
      </Menu>
    </View>
  }
>

  <FlatList
    data={imagesToDisplay}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <ImageCardCover
        source={item.image_url !== "" ? { uri: item.image_url } : require('../assets/images/noimage.jpg')}
      />
    )}
    ListEmptyComponent={
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '50%', backgroundColor: 'white' }}>
        <ThemedText>
          You can add an image by clicking on the&nbsp;
          <Icon source="camera" color={MD3Colors.secondary0} size={20} /> below!!
        </ThemedText>
      </ThemedView>
    }
  />
</ParallaxScrollView>

      </PaperProvider>

      <FloatingButton
        iconName={'camera'}
        visible={true}
        extended={false}
        label="Camera"
        animateFrom="right"
        iconMode="static"
        showAddModal={() => ("")}
        buttonColor={lastObj?.swipe_flag?.trim().toUpperCase() === "Y" ?'#F48882' : '#C6FAD2' }
        onPress={handleOnPress}
      />
    </>
  );
}
