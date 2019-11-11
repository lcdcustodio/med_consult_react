import React, { Component } from 'react';
import { Alert, View, StyleSheet, Image, Text, Button, TouchableWithoutFeedback, Share } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import Builder from '../util/Builder';

import Session from '../Session';

export default class Sidebar extends Component {
	
	constructor(props) {
	
		super(props);
	
		this.items = [
			{
				navOptionName: 'HOSPITAIS',
				screenToNavigate: 'Hospitals',
			}, 
			{
				navOptionName: 'RELATÓRIO',
				screenToNavigate: 'Report',
			}, 
			{
				navOptionName: 'SAIR',
				screenToNavigate: 'SignIn',
			}
		];
	}

	getProfileName(profile) {
		
		if (profile == 'ADMIN') {
			return 'Administrador';
		}
		
		if (profile == 'MANAGER') {
			return 'Gestor';
		}

		if (profile == 'CONSULTANT') {
			return 'Consultor';
		}
	}

	renderIconTrash() {

		return <TouchableWithoutFeedback onPress={() => {

			Alert.alert(
				'Atenção',
				'Tem certeza que deseja limpar todos os dados?',
				[{ text: 'Cancelar',onPress: () => console.log('Cancel Pressed'), style: 'cancel'  },
				  {text: 'Limpar', onPress: () => {

						AsyncStorage.removeItem('userData');
						AsyncStorage.removeItem('auth');
						AsyncStorage.removeItem('dateSync');

						Alert.alert(
							'Compartilhar',
							'Deseja compartilhar esses dados antes de apagar',
							[
								{ 
									text: 'Não', onPress: () => {
										AsyncStorage.removeItem('hospitalizationList');
										this.props.navigation.navigate("SignIn");
									} 
								},
								{
									text: 'Compartilhar', onPress: () => {

										AsyncStorage.getItem('hospitalList', (err, res) => {

											if (res !== null) {

												let hospitalList = JSON.parse(res);
												
												AsyncStorage.getItem('hospitalizationList', (err, res) => {

													let builder = new Builder();

													builder = builder.parseToSync(res, hospitalList);

													let data = { "hospitalizationList": builder };
													
													Share.share({
														message: JSON.stringify(data),
												    }).then(response => {

												    }).catch(error => {

												    });

												    AsyncStorage.removeItem('hospitalList');
												    AsyncStorage.removeItem('hospitalizationList');

												    this.props.navigation.navigate("SignIn");

												});
											}
										});
									}
								},
							],
							{
								cancelable: false
							},
						);
				  }},
				],
				{cancelable: false},
			);

		}}>
			
			<Icon name="trash" style={{ color: 'white', fontSize: 15}}/>

		</TouchableWithoutFeedback>;
	}

	clearPartialData() {
		AsyncStorage.removeItem('userData');
		AsyncStorage.removeItem('auth');
	}

	render() {

		let user = Session.current.user;
		
		if (!user) {
			return null;
		}

		let enviroment = Session.current.enviroment._name;
		
		return (
				<LinearGradient colors={['#005cd1', '#35d8a6']} style={styles.linearGradient}>

				<View style={styles.sideMenuContainer}>
					<Image source={require('../images/logo-mc-branca.png')} style={styles.sideMenuLogoIcon} />
					<Text style={{ fontSize: 14, color: '#FFF', fontWeight: "bold" }}>
						{user.name}
					</Text>
					<Text style={{ fontSize: 12, color: '#CFC', marginBottom: 20, }}>
						{this.getProfileName(user.profile)}
					</Text>
					<View style={styles.divider} />
					<View style={styles.containerMenu}>
						{this.items.map((item, key) => (
							<TouchableWithoutFeedback key={key} onPress={() => { 

								if (item.screenToNavigate == 'SignIn') {
									this.clearPartialData();
								}

								this.props.navigation.closeDrawer(); this.props.navigation.navigate(item.screenToNavigate); 
							}}>
								<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 2, paddingBottom: 2, backgroundColor:'transparent', borderBottomColor: '#fff', borderBottomWidth: 1}} >
									<View style={styles.itemIcon}>
										<View style={styles.sideButtonRight}>
											<Icon type="AntDesign" name="right" style={{ color: 'white', fontSize: 15}} />
										</View>
									</View>
									<Text style={{ fontSize: 15, color: '#FFF', fontWeight: "bold" }} >
										{item.navOptionName}
									</Text>
								</View>
							</TouchableWithoutFeedback>
						))}
					</View>
					<View style={styles.boxButton}>
						<Image source={require('../images/logo-rededor.png')} style={styles.sideMenuLogoIcon} />
						<Text style={{ fontSize: 15, bottom: 20, textAlign: 'right', color: '#FFF', fontWeight: "bold"}}> Versão 1.7.0 { enviroment } [ { this.renderIconTrash() } ]</Text>
					</View>
				</View>
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		position: 'absolute',
		left: 10,
		top: 10,
		width: 50
	},
  	sideMenuContainer: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		paddingTop: 20,
	},
	linearGradient: {
		flex: 1
	},
	sideMenuLogoIcon: {
		resizeMode: 'center',
		width: 150,
		height: 150,
		marginTop: 20,
	},
	divider: {
		width: '100%',
		height: 1,
		backgroundColor: '#e2e2e2',
	},
	containerMenu: {
		width: '100%',
	},
	itemIcon: {
		marginRight: 20,
	},
	sideButtonRight : {
		height: 50,
		width:5,
		backgroundColor: "#fff", 
		fontWeight: "bold"
	},
	boxButton: {
		position: 'absolute',
		alignItems: 'center',
		bottom:0
	},
	userName: {
		color: '#EFE'
	},
	userProfile: {
		color: '#CFC'
	},
});
