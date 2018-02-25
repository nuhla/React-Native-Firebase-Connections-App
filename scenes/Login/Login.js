import React, { Component } from 'react';
import { View, Text, Button, Modal } from 'react-native';
import firebase from 'firebase';
import TextFieldInput from '../../components/TextFieldInput';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles.js';



class SignInForm extends Component {

    constructor(props) {
        super(props);
        this.state = {   
            email: '', 
            password: '', 
            error: '', 
            loading: false,
            modalVisible: false,
            dataSource:[],
        };
        this.itemsRef = this.getRef().child('users');
      }

    getRef() {
        return firebaseApp.database().ref();
    }

    listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {
            var users = [];
            snap.forEach((child) => {
            users.push({
                name: child.val().name,
                email: child.val().email,
                _key: child.key
                });
            });
        this.setState({dataSource: this.state.dataSource});
        });
    }   
              
    componentDidMount() {
        this.listenForItems(this.itemsRef);
    }

    onSignInPress() {
        this.setState({ error: '', loading: true });
        const { email, password } = this.state;
                firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => { this.setState({ error: '', loading: false }); })
                .catch(() => {
                this.setState({ error: 'Authentication failed.', loading: false });
            });
    }

    onRegisterPress(){
        this.setState({ error: '', loading: true });
        const { email, password} = this.state;
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((success) => { success.updateProfile({displayName: this.state.name}) 
                     this.setState({ error: '', loading: false })
                     this.itemsRef.push({
                        name: this.state.name,
                        email: this.state.email,
                      });
                })
                    .catch(() => {
                    this.setState({ error: 'Authentication failed.', loading: false });
                    });
        }

    renderButtonOrLoading() {
        if (this.state.loading) {
            return <View><Text> LOADING... </Text></View>
        }
        return <Button onPress={this.onSignInPress.bind(this)} color='white' title="Log in" />;
        }
    
    openModal() {
        this.setState({modalVisible:true});
      }
    
    closeModal() {
        this.setState({modalVisible:false});
      }

    render() {
        return (
            <View style={styles.logInContainer} >
            <LinearGradient colors={['#70dbdb', '#33cccc', '#196666']} style={styles.gradient} >
                <Text style={{fontSize:40, color:'white', paddingBottom:30,}}> CONNECTIONS </Text>

                <TextFieldInput
                    label='Email Address'
                    placeholder='youremailaddress'
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    autoCorrect={false}
                    />
                    <TextFieldInput
                    label='Password'
                    autoCorrect={false}
                    placeholder='Your Password'
                    secureTextEntry
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                    />
                    <Text style={styles.errorTextStyle}>{this.state.error}</Text>
                    {this.renderButtonOrLoading()}
                    <Button onPress={() => this.openModal()} color='white' title="Register" />

                <Modal
                visible={this.state.modalVisible}
                animationType={'slide'}
                onRequestClose={() => this.closeModal()}>
                <LinearGradient colors={['#196666', '#33cccc', '#196666']} style={styles.gradient} >

                    <TextFieldInput
                    label='Name'
                    autoCorrect={false}
                    placeholder='Your Name'
                    value={this.state.name}
                    onChangeText={name => this.setState({ name })}
                    />
                    <TextFieldInput
                    label='Email Address'
                    placeholder='youremailaddress'
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    autoCorrect={false}
                    />
                    <TextFieldInput
                    label='Password'
                    autoCorrect={false}
                    placeholder='Your Password'
                    secureTextEntry
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                    />

                    <Button onPress={() => this.closeModal()} color="white"  title="Cancel" />
                    <Button onPress={this.onRegisterPress.bind(this)} color="white"  title="Submit" />
                </LinearGradient>
                </Modal>
                </LinearGradient>
            </View>
        );
    }
}
export default SignInForm;