import React, { Component } from "react";
import { Container, Content, Text, Card, CardItem } from 'native-base';
import { Alert, View, FlatList, TouchableOpacity, Image, BackHandler, Picker, Platform, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Timer from '../../components/Timer';
import moment from 'moment';
import Session from '../Session';
import Patient from '../model/Patient';
import Builder from '../util/Builder';
import api from '../services/api';
import qs from "qs";
import _ from 'lodash';

let instance = null;

let instanceType = null;

let allPatients = [];

export function setUserData() {

	AsyncStorage.getItem('userData', (err, res) => {
		if(res) {
			let parse = JSON.parse(res);
			Session.current.user = parse;
		}
	});	
}

export function getDateSync(instance) {

	AsyncStorage.getItem('dateSync', (err, res) => {
            
        res = JSON.parse(res);

        if (res !== null) {

            let today =  moment().format('DD/MM/YYYY');

            let dateSync = res.substring(0, 10);

            if (today > dateSync) {
                instance.updateState({ timerTextColor: "#721c24", timerBackgroundColor: "#f8d7da" });
            }                
        }

        instance.updateState({dateSync: res});
    });

    AsyncStorage.getItem('require_sync_at', (err, res) => {
		if (res != null) {
			setRequireSyncTimer(res);
		} else {
			setRequireSyncTimer(null);
		}
	});
}

export function getLogomarca(hospital) {

	if(hospital.id === 61) {
		return require('../images/logo_hospital/rj/realDor.png');
	} 
	else if(hospital.id === 4) {
		return require('../images/logo_hospital/rj/copaDor.png');
    }  
    else if(hospital.id === 5) {
		return require('../images/logo_hospital/rj/niteroiDor.png');
    }  
    else if(hospital.id === 1) {
		return require('../images/logo_hospital/rj/bangu.png');
    }  
    else if(hospital.id === 7) {
		return require('../images/logo_hospital/rj/oesteDor.png');
    }  
    else if(hospital.id === 2) {
		return require('../images/logo_hospital/rj/barraDor.png');
    }  
    else if(hospital.id === 9) {
		return require('../images/logo_hospital/rj/riosDor.png');
    }  
    else if(hospital.id === 101) {
		return require('../images/logo_hospital/rj/badim.png');
    }  
    else if(hospital.id === 6) {
		return require('../images/logo_hospital/rj/norteDor.png');
	} 
	else if(hospital.id === 3) {
		return require('../images/logo_hospital/rj/caxiasDor.png');
    }  
    else if(hospital.id === 8) {
		return require('../images/logo_hospital/rj/quintaDor.png');
    } 
    else if(hospital.id === 144) {
		return require('../images/logo_hospital/pe/saoMarcos.png');
    } 
    else if(hospital.id === 143) {
		return require('../images/logo_hospital/pe/saoJose.png');
    } 
    else if(hospital.id === 142) {
		return require('../images/logo_hospital/pe/esperancaOlinda.png');
    } 
    else if(hospital.id === 141) {
		return require('../images/logo_hospital/pe/esperancaRecife.png');
    }
    else if(hospital.id === 161) {
		return require('../images/logo_hospital/sp/saoLuizItaim.png');
    }
    else if(hospital.id === 162) {
		return require('../images/logo_hospital/sp/brasil.png');
    }
    else if(hospital.id === 163) {
		return require('../images/logo_hospital/sp/assuncao.png');
    }
    else if(hospital.id === 164) {
		return require('../images/logo_hospital/sp/saoLuizMorumbi.png');
    }
    else if(hospital.id === 181) {
        return require('../images/logo_hospital/sp/daCrianca.png');
    }
    else if(hospital.id === 182) {
		return require('../images/logo_hospital/sp/saoLuizJabaquara.png');
	}
    else if(hospital.id === 201) {
        return require('../images/logo_hospital/df/santaLuzia.png');
    }
    else if(hospital.id === 202) {
        return require('../images/logo_hospital/df/doCoracao.png');
    }
    else if(hospital.id === 203) {
        return require('../images/logo_hospital/df/santaHelena.png');
    }

    else if(hospital.id === 221) {
        return require('../images/logo_hospital/sp/saoLuizAnaliaFranco.png');
    }

    else if(hospital.id === 222) {
        return require('../images/logo_hospital/sp/saoLuizSaoCaetano.png');
    }

    else if(hospital.id === 223) {
        return require('../images/logo_hospital/sp/villaLobos.png');
    }

    else if(hospital.id === 224) {
        return require('../images/logo_hospital/rj/rioMar.png');
    }

	return null;
}

export function countTotalPatientsVisited(patients) {

	let totalPatientsVisited = 0;

	patients.forEach(patient => {
       
        let lastVisit = null;
		
		let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc'])

		let listOfOrderedPatientTrackingList = _.orderBy(patient.trackingList, ['startDate'], ['desc']);
		
		if(listOfOrderedPatientTrackingList.length == 0 || (!listOfOrderedPatientTrackingList[0].endMode || listOfOrderedPatientTrackingList[0].endMode != 'CHANGE_INSURANCE_EXIT') ) {
			
			if((listOfOrderedPatientObservations.length > 0) && (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)) {
				
				const today = moment();
            
	            if (listOfOrderedPatientObservations[0].observationDate != null) {

		            lastVisit = moment(moment(listOfOrderedPatientObservations[0].observationDate).format('YYYY-MM-DD'));

		            lastVisit = today.diff(lastVisit, 'days');
		        }
			}

			if (lastVisit == 0) {
				++totalPatientsVisited;
			}
		}			
	});

	return totalPatientsVisited;
}

export function countTotalPatients(patients, hospital) {

	let rooms = [];
	
	let totalPatients = patients.reduce((totalPatients, patient) => {
		
		patient.hospitalName = hospital.name;

		patient.hospitalId = hospital.id;

		allPatients.push(patient);
		
		const patientClass = new Patient(patient);

		let iconNumber = patientClass.getIconNumber();

		let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);
		let listOfOrderedPatientTrackingList = _.orderBy(patient.trackingList, ['startDate'], ['desc']);

		if(listOfOrderedPatientTrackingList.length == 0 || (!listOfOrderedPatientTrackingList[0].endMode || listOfOrderedPatientTrackingList[0].endMode != 'CHANGE_INSURANCE_EXIT') ) {
			if ( (listOfOrderedPatientObservations.length == 0) || (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)) {

				if (iconNumber == instance.state.ICON.OLHO_CINZA_COM_EXCLAMACAO ||
					iconNumber == instance.state.ICON.OLHO_AZUL_COM_EXCLAMACAO ||
					iconNumber == instance.state.ICON.OLHO_AZUL ||
					iconNumber == instance.state.ICON.OLHO_CINZA_COM_CHECK) {

					if(!rooms.includes(patient.locationBed))
					{
						rooms.push(patient.locationBed);

						return totalPatients + 1;
					}
					else
					{
						return totalPatients;
					}

				} else {
					return totalPatients;
				}
			} else {
				return totalPatients;
			}
		} else {
			return totalPatients;
		}
	}, 0);

	instance.updateState({ allPatients: allPatients });

	rooms = [];

	return totalPatients;
}

export function countTotalPatientsMedialRelease(patients, hospital){
	
	let totalPatientsMedialRelease = patients.reduce((totalPatientsMedialRelease, patient) => {
		
		patient.hospitalName = hospital.name;

		patient.hospitalId = hospital.id;

		const patientClass = new Patient(patient);

		let iconNumber = patientClass.getIconNumber();

		let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);
		let listOfOrderedPatientTrackingList = _.orderBy(patient.trackingList, ['startDate'], ['desc']);

		if(listOfOrderedPatientTrackingList.length == 0 || (!listOfOrderedPatientTrackingList[0].endMode || listOfOrderedPatientTrackingList[0].endMode != 'CHANGE_INSURANCE_EXIT') ) {
			if ( (listOfOrderedPatientObservations.length == 0) || (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)) {

				if (iconNumber == instance.state.ICON.CASA_AZUL) {

					return totalPatientsMedialRelease + 1;
				} else {
					return totalPatientsMedialRelease;
				}
			} else {
				return totalPatientsMedialRelease;
			}
		} else {
			return totalPatientsMedialRelease;
		}
	}, 0);

	return totalPatientsMedialRelease;
}

export function setLastVisit(patients){
	
	let lastVisit = null;
	
	patients.forEach(patient => {

		let listOfOrderedPatientObservations = _.orderBy(patient.observationList, ['observationDate'], ['desc']);
		let listOfOrderedPatientTrackingList = _.orderBy(patient.trackingList, ['startDate'], ['desc']);

		if(listOfOrderedPatientTrackingList.length == 0 || (!listOfOrderedPatientTrackingList[0].endMode || listOfOrderedPatientTrackingList[0].endMode != 'CHANGE_INSURANCE_EXIT') ) {

			if((listOfOrderedPatientObservations.length > 0) && (!listOfOrderedPatientObservations[0].endTracking && !listOfOrderedPatientObservations[0].medicalRelease)) {

				patient.observationList.forEach( item => {

					if (item.observationDate != null) {

	            		let visit = moment(item.observationDate).format('YYYY-MM-DD');

	            		if (lastVisit != null) {

	            			if(lastVisit < visit){
								lastVisit = visit;
							}

	            		}
	            		else
	            		{
	            			lastVisit = visit;
	            		}
					}
				});
			}
		}
	});

	if (lastVisit == null) {
		lastVisit = 'Sem visita';
	}
	else
	{
		lastVisit = moment(lastVisit).format('DD/MM/YYYY');
	}
	
	return lastVisit;
}

export function setRegional(hospitalId) {
	
	if (instance.state.REGIONAL_RJ.includes(hospitalId)) {
		return 'RJ'
	}

	if (instance.state.REGIONAL_SP.includes(hospitalId)) {
		return 'SP'
	}

	if (instance.state.REGIONAL_PE.includes(hospitalId)) {
		return 'PE'
	}

	if (instance.state.REGIONAL_DF.includes(hospitalId)) {
		return 'DF'
	}
}

export async function getInformationHospital(listHospital){

	if(instanceType == 'hospitals'){

		allPatients = [];

		listHospital.forEach( hospital => {
			hospital.logomarca = getLogomarca(hospital)
			hospital.totalPatientsVisitedToday = countTotalPatientsVisited(hospital.hospitalizationList)
			hospital.totalPatients = countTotalPatients(hospital.hospitalizationList, hospital)
			hospital.totalPatientsMedialRelease = countTotalPatientsMedialRelease(hospital.hospitalizationList, hospital)
			hospital.lastVisit = setLastVisit(hospital.hospitalizationList)
			hospital.regional = setRegional(hospital.id)
		}); 
	}

	if(instanceType == 'report'){
		instance.report(listHospital);
	}

	instance.updateState({
		hospitals: [ ...listHospital], 
		filteredHospitals: [ ...listHospital]
	});
}

export async function loadHospitalsStorage(){

	AsyncStorage.getItem('hospitalList', (err, res) => {

		if (res == null) {

			Alert.alert(
				'Erro ao carregar informações',
				'Desculpe, não foi possível prosseguir offline, é necessário uma primeira sincronização conectado a internet!',
				[
					{
						text: 'OK', onPress: () => {
							instance.props.navigation.navigate("SignIn");
						}
					},
				],
				{
					cancelable: false
				},
			);
		} 
		else 
		{
			let hospitalList = JSON.parse(res);

			getInformationHospital(hospitalList);
		}
	});
}

export function setRequireSyncTimer(timer){

	let today =  moment().format('YYYY-MM-DD');

	if (timer == null) 
	{
		AsyncStorage.removeItem('require_sync_at');

		instance.updateState({ timerTextColor: "#005cd1", timerBackgroundColor: "#fff" });
	}
	else
	{
		let require_sync_at = JSON.parse(timer);
		
		if (require_sync_at == today) {
			instance.updateState({ timerTextColor: "#856404", timerBackgroundColor: "#fff3cd" });
		}

		if (require_sync_at < today) {
			instance.updateState({ timerTextColor: "#721c24", timerBackgroundColor: "#f8d7da" });
		}
	}
}

export function  clearPartialData() {
	AsyncStorage.removeItem('userData');
	AsyncStorage.removeItem('auth');
}

export function  isTheSameHospital(hospital, userData){

	let hasHospitality = false

	userData.hospitals.forEach(element => {
		if(hospital.id === element.id) {
			hasHospitality = true
		}
	});

	return hasHospitality;
}

export async function loadHospitals(){
		
	try {

		let conn = await NetInfo.fetch().then(state => {
			return state.isConnected;
		});
		
		if (!conn) {
			
			Alert.alert(
				'Sua conexão parece estar inativa',
				'Por favor verifique sua conexão e tente novamente',
				[
					{
						text: 'OK', onPress: () => {}
					},
				],
				{
					cancelable: false
				},
			);

			return false;
		}

		instance.updateState({ textContent: 'Aguarde...' });

		instance.updateState({ loading: true });

		let timer = setTimeout(() => {

			if (instance.state.loading) {

				instance.updateState({loading: false}, function(){

					setTimeout(() => {

						Alert.alert(
							'Problema com a conexão',
							'A sua conexão pode ter falhado ou o servidor não respondeu dentro do período de 30 segundos, por favor tente novamente ou entre em contato com o suporte.',
							[
								{
									text: 'OK', onPress: () => {}
								},
							],
							{
								cancelable: false
							},
						);

					}, 100);

					clearTimeout(timer);

				});

				return false;
				
			}

	    }, 30000);

		AsyncStorage.getItem('userData', (err, res) => {

			if (res == null) 
			{
				instance.updateState({loading: false});

				instance.props.navigation.navigate("SignIn");
			}
			else
			{

	            let parse = JSON.parse(res);

	            Session.current.user = parse;

	            instance.state.token = parse.token;

	            AsyncStorage.getItem('hospitalizationList', (err, res) => {
							
					let builder = new Builder();

					let validator = new Builder();

					validatorFailed = builder.validateToSync(res, instance.state.hospitals);

					if (validatorFailed) {
						
						instance.updateState({loading: false});

						setTimeout(() => {

	                        Alert.alert(
	                            'Erro de validação',
	                            validatorFailed['error'],
	                            [
	                            	{ text: 'Fechar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
	                                {
	                                    text: 'Ir para o(a) paciente', onPress: () => {
	                                    	instance.props.navigation.navigate("PatientDetail", { hospitalId: validatorFailed['hospitalId'], patientId: validatorFailed['patientId'], patient: validatorFailed['patient']});
	                                    }
	                                },
	                            ],
	                            {
	                                cancelable: false
	                            },
	                        );

	                    }, 100);

						return false;
					}

					builder = builder.parseToSync(res, instance.state.hospitals);

					let data = { "hospitalizationList": builder };

					instance.updateState({ textContent: 'Salvando as informações...' });

					console.log(data);

					api.post('/v3.0/save', data, 
					{
						headers: {
							"Content-Type": "application/json",
						  	"Accept": "application/json",
						  	"Token": instance.state.token, 
						}

					}).then(response => {

						console.log(response);

						if(!response.data.body.success)
						{
							instance.updateState({loading: false});

							setTimeout(() => {

								Alert.alert(
									'Erro ao carregar informações',
									response.data.body.responseError.msg,
									[
										{ text: 'Fechar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
										{
											text: 'Fazer login', onPress: () => {
												clearPartialData();
												instance.props.navigation.navigate("SignIn");
											}
										},
									],
									{
										cancelable: false
									},
								);

							}, 100);

							return false;
						}

						instance.updateState({ textContent: 'Carregando as informações...' });

						api.post('/v3.0/load', {}, 
						{
							headers: {
								"Content-Type": "application/json",
							  	"Accept": "application/json",
							  	"Token": instance.state.token, 
							}

						}).then(response => {

							console.log(response);

							if(!response.data.body.success)
							{
								instance.updateState({loading: false});

								setTimeout(() => {

									Alert.alert(
										'Erro ao carregar informações',
										response.data.body.responseError.msg,
										[
											{ text: 'Fechar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
											{
												text: 'Fazer login', onPress: () => {
													clearPartialData();
													instance.props.navigation.navigate("SignIn");
												}
											},
										],
										{
											cancelable: false
										},
									);

								}, 100);

								return false;
							}

							clearTimeout(timer);

							instance.updateState({loading: false});
							
							if(response && response.status === 200) {

								setRequireSyncTimer(null);

								AsyncStorage.setItem('hospitalizationList', JSON.stringify([]));

								let hospitalListOrdered = _.orderBy(response.data.body.content.hospitalList, ['name'], ['asc']);
									
								let user = Session.current.user;

								let listHospital = [];

								if (user.profile == 'CONSULTANT') {

									hospitalListOrdered.forEach( hospital => {
										if(isTheSameHospital(hospital, parse)){
											listHospital.push(hospital)
										}
									});
								
								} 
								else
								{
									listHospital = hospitalListOrdered;
								}

								getInformationHospital(listHospital).then(response => {

									instance.updateState({loading: false});
									
									const dateSync = moment().format('DD/MM/YYYY [às] HH:mm:ss');

									instance.updateState({dateSync: dateSync});

									AsyncStorage.setItem('dateSync', JSON.stringify(dateSync));

									AsyncStorage.removeItem('hospitalList', (err, res) => {

										AsyncStorage.setItem('hospitalList', JSON.stringify(listHospital), () => {

											if(instanceType == 'patients'){
												instance.loadHospitalData();
											}

											if(instanceType == 'patient'){
												instance.loadPatientData();
											}

											if(instanceType == 'report'){
												instance.report(listHospital);
											}

											if (instance.state.selectedRegionalHospital) {
												instance.filterHospitals(instance.state.selectedRegionalHospital);
											}

										});

							        });

								});
							
							} else {

								setTimeout(() => {

									Alert.alert(
										'Erro ao carregar informações',
										response.data.body.responseError.msg,
										[
											{ text: 'Fechar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
											{
												text: 'Fazer login', onPress: () => {
													clearPartialData();
													instance.props.navigation.navigate("SignIn");
												}
											},
										],
										{
											cancelable: false
										},
									);

								}, 100);

								return false;
							}

						}).catch(error => {

							console.log(error);

							instance.updateState({loading: false}, function(){

								setTimeout(() => {

									if (error.code === 'ECONNABORTED')
									{
										Alert.alert(
											'Problema com a conexão',
											'A sua conexão pode ter falhado, por favor tente novamente ou entre em contato com o suporte.',
											[
												{
													text: 'OK', onPress: () => {}
												},
											],
											{
												cancelable: false
											},
										);

									}
									else
									{
										Alert.alert(
											'Erro ao carregar informações',
											error.message,
											[
												{ text: 'Fechar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
												{
													text: 'Fazer login', onPress: () => {
														clearPartialData();
														instance.props.navigation.navigate("SignIn");
													}
												},
											],
											{
												cancelable: false
											},
										);
										
									}

								}, 100);

								clearTimeout(timer);

							});

							return false;
						});
						
					}).catch(error => {

						console.log(error);

						instance.updateState({loading: false}, function(){

							setTimeout(() => {

								if (error.code === 'ECONNABORTED')
								{
									Alert.alert(
										'Problema com a conexão',
										'A sua conexão pode ter falhado, por favor tente novamente ou entre em contato com o suporte.',
										[
											{
												text: 'OK', onPress: () => {}
											},
										],
										{
											cancelable: false
										},
									);

								}
								else
								{
									Alert.alert(
										'Erro ao carregar informações',
										error.message,
										[
											{ text: 'Fechar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
											{
												text: 'Fazer login', onPress: () => {
													clearPartialData();
													instance.props.navigation.navigate("SignIn");
												}
											},
										],
										{
											cancelable: false
										},
									);
									
								}


							}, 100);

							clearTimeout(timer);

						});

						return false;
					});

				});
			}
		});

    }catch(error) {

    	instance.updateState({loading: false}, function(){

			setTimeout(() => {

				Alert.alert(
					'Erro ao carregar informações',
					error,
					[
						{ text: 'Fechar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
						{
							text: 'Fazer login', onPress: () => {
								clearPartialData();
								instance.props.navigation.navigate("SignIn");
							}
						},
					],
					{
						cancelable: false
					},
				);

			}, 100);

			clearTimeout(timer);

		});

		return false;
    }     		
};

export async function Sync(cls, fromServer, type, background) {

	instance = cls;

	instanceType = type;

	let conn = await NetInfo.fetch().then(state => {
		return state.isConnected;
	});

	if (fromServer) {

		if (conn) 
		{
			loadHospitals();
		}
		else
		{
			if (!background) {
				
				Alert.alert(
					'Sua conexão parece estar inativa',
					'Por favor verifique sua conexão e tente novamente',
					[
						{
							text: 'OK', onPress: () => {}
						},
					],
					{
						cancelable: false
					},
				);
			}
		}
	}
	else
	{
		if (conn) {

			AsyncStorage.getItem('hospitalList', (err, res) => {
				
				if (res == null) {
					Sync(instance, true, type);
				}
				else
				{
					loadHospitalsStorage();
				}
			});
		}
		else
		{
			loadHospitalsStorage();
		}
	}
}