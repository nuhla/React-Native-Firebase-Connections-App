import React, {Component} from 'react';
import {StyleSheet, Text, View } from 'react-native';
import firebase from '../../firebase/firebase';
import {Gravatar, GravatarApi} from 'react-native-gravatar';
import ActionButton from '../../components/ActionButton';
import styles from './styles';

export default class Profile extends Component {
    static route = {
        navigationBar: {
          title: 'Profile',
          backgroundColor: '#33cccc',
          tintColor: 'white',
        }
      }
    signOutUser = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.log(error);
        }
    }
    render() { 
        var user = firebase.auth().currentUser;
        return (
            <View style={styles.profileContainer}>
            <View style={styles.innerProfileContainer}>
                <Gravatar options={{
                email: user.email,
                parameters: { "size": "200", "d": "mm" },
                secure: true
                }}
                style={styles.roundedProfileImage} />

             <Text style={styles.profileText}>{ user.displayName ? `Hi ${user.displayName}!` :  'Loading'} </Text> 
             <Text style={styles.profileText}> {user.email}</Text>
             <Text style = {styles.subProfileText}> To add or edit your image, log on to Gravatar! </Text>
             </View>
          
            <ActionButton onPress={() => this.signOutUser()}  title="Logout" />
            </View>
        ); 
    };
};

