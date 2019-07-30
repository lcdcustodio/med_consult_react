import React, { Component } from 'react';
import { Alert, View, StyleSheet, Image, Text, Button, TouchableWithoutFeedback, Share } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

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

	parseObject(json) {

		let parse = {};

		for (var i = 0; i < json.length; i++) {

			for (var attrname in json[i])
			{
				if (attrname == 'id') continue;

				let patient = this.getPatient(json[i].id);

				if (patient == null) {
					continue;
				}

				if (parse.hasOwnProperty(json[i].id)) {
					
					parse[json[i].id][attrname] = json[i][attrname];
				}
				else
				{
					parse[json[i].id] = json[i];	
				}

				if (!parse[json[i].id].hasOwnProperty('recommendationClinicalIndication')) {
					parse[json[i].id]['recommendationClinicalIndication'] = patient.recommendationClinicalIndication;
				}

				if (!parse[json[i].id].hasOwnProperty('recommendationMedicineReintegration')) {
					parse[json[i].id]['recommendationMedicineReintegration'] = patient.recommendationMedicineReintegration;
				}

				if (!parse[json[i].id].hasOwnProperty('recommendationWelcomeHomeIndication')) {
					parse[json[i].id]['recommendationWelcomeHomeIndication'] = patient.recommendationWelcomeHomeIndication;
				}

				if (!parse[json[i].id].hasOwnProperty('diagnosticHypothesisList')) {
					parse[json[i].id]['diagnosticHypothesisList'] = null;
				}

				if (!parse[json[i].id].hasOwnProperty('secondaryCIDList')) {
					parse[json[i].id]['secondaryCIDList'] = null;
				}

				if (parse[json[i].id].hasOwnProperty('patientHeight')) {
					if (patient.patientHeight != null) {
						parse[json[i].id]['patientHeight'] = parse[json[i].id]['patientHeight'].toString().replace(',', '.');
					}
				}

				if (parse[json[i].id].hasOwnProperty('patientWeight')) {
					if (patient.patientWeight != null) {
						parse[json[i].id]['patientWeight'] = parse[json[i].id]['patientWeight'].toString().replace(',', '.');
					}
				}

				if (parse[json[i].id].hasOwnProperty('observationList')) {

					let listOfOrderedPatientObservations = _.orderBy(parse[json[i].id]['observationList'], ['observationDate'], ['desc']);

					let lastElementVisit = listOfOrderedPatientObservations[0];

					parse[json[i].id]['observationList'] = [];

					parse[json[i].id]['observationList'].push(lastElementVisit);
				}
			}
		}

		var result = Object.keys(parse).map(function(key) {
			let aux = parse[key];
			return aux;
		});

		return result;
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
						AsyncStorage.removeItem('morbidityComorbityList');
						AsyncStorage.removeItem('hospitalList');
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

										AsyncStorage.getItem('hospitalizationList', (err, res) => {

											let obj = [];

											if (res != null) {

												let hospitalizationList = JSON.parse(res);

												for (var i = 0; i < hospitalizationList.length; i++) {

													let array = {};
													array['id'] = hospitalizationList[i].idPatient;
													array[hospitalizationList[i].key] = hospitalizationList[i].value;

													obj.push(array);
												}
											}

											let parseObj = this.parseObject(obj);

											let data = { "hospitalizationList": parseObj };
											
											Share.share({
												message: data,
										    }).then(response => {

										    }).catch(error => {

										    });

										    AsyncStorage.removeItem('hospitalizationList');
										    this.props.navigation.navigate("SignIn");

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
						<Text style={{ fontSize: 15, bottom: 20, textAlign: 'right', color: '#FFF', fontWeight: "bold"}}> Versão 1.0.2 [ { this.renderIconTrash() } ]</Text>
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
