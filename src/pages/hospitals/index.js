import React, { Component } from "react";
import { Container, Content, Text, Card, CardItem } from 'native-base';
import { Alert, View, FlatList, TouchableOpacity, Image, BackHandler, Picker, Platform, StyleSheet } from "react-native";
import { Searchbar, List } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import qs from "qs";
import _ from 'lodash';
import { RdRootHeader } from "../../components/rededor-base";
import api from '../../services/api';
import Line from '../../components/Line'
import Timer from '../../components/Timer'
import Session from '../../Session';
import TextValue from '../../components/TextValue';
import baseStyles from '../../styles';
import styles from './style';
import Patient from '../../model/Patient';
import Builder from '../../util/Builder';
import RNPickerSelect, { inputIOS } from 'react-native-picker-select';
import { Sync, setRequireSyncTimer, getDateSync } from '../Sync';

export default class Hospital extends Component {

	constructor(props) {
		
		super(props);

		this.state = {
			infos: {},
			hospitals: null,
			filteredHospitals: null,
			dateSync: null,
			page: 1,
			isEditable: Session.current.user.profile != 'ADMIN',
			loading: false,
			timerTextColor: "#005cd1",
			timerBackgroundColor: "#fff",
			allPatients: [],
			patientsFiltered: [],
			patientQuery: null,
			ICON: {
                OLHO_CINZA_COM_CHECK: 4,
                OLHO_AZUL: 1,
                OLHO_CINZA_COM_EXCLAMACAO: 3,
                OLHO_AZUL_COM_EXCLAMACAO: 0,
                CASA_AZUL: 2
            },
			REGIONAL_RJ: [101, 1, 2, 3, 4, 5, 6, 7, 8, 61, 9, 41, 21, 224],
			REGIONAL_SP: [161, 162, 163, 164, 182, 181, 221, 222, 223],
			REGIONAL_PE: [142, 141, 143, 144],
			REGIONAL_DF: [201, 202, 203],
			selectedRegionalHospital: '',
			regions: [
				{
				  label: 'Rio de Janeiro',
				  value: 'RJ',
				},
				{
				  label: 'Pernambuco',
				  value: 'PE',
				},
				{
				  label: 'São Paulo',
				  value: 'SP',
				},
				{
				  label: 'Brasília',
				  value: 'DF',
				},
			]
		}
	}

	updateState = (obj) => {
	    this.setState(obj);
	}

	didFocus = this.props.navigation.addListener('didFocus', (payload) => {

		this.setState({
			patientQuery: null,
			patientsFiltered: [],
		});

		if (this.state.selectedRegionalHospital) {
			this.filterHospitals(this.state.selectedRegionalHospital);
		}
		else
		{
			Sync(this, false, 'hospitals');

			getDateSync(this);
		}

		AsyncStorage.getItem('require_sync_at', (err, res) => {
			if (res != null) {
				setRequireSyncTimer(res);
			} else {
				setRequireSyncTimer(null);
			}
		});

		BackHandler.removeEventListener ('hardwareBackPress', () => {});
        
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Hospitals');
            return true;
        });

	});

	renderImageOrName(item) {

		if ( item.logomarca ) {
			return <Image source={item.logomarca} style={{width: 140, height: 60 }}/>;
		}
		else
		{
			return <Text style={[styles.niceBlue, {paddingLeft: 10}]}>{item.name}</Text>;
		}
	}

	renderItem = ({ item }) => (
		
		<TouchableOpacity
			onPress={() => {

				if(item.totalPatients === 0 && item.totalPatientsMedialRelease === 0) {

					Alert.alert(
						item.name,
						'Não há pacientes neste hospital',
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
					this.props.navigation.navigate("Patients", {hospitalId: item.id});

					this.setState({
						patientQuery: null,
						patientsFiltered: []
					});
				}
			}}>
			
            <View style={{ width: '100%', paddingTop: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: baseStyles.container.backgroundColor}}>
                
                <Card>

                    <View style={{alignItems: 'center', textAlign: "center", justifyContent: 'center', height: 80}}>
                    	{ this.renderImageOrName(item) }
                    </View>
                    
                    <CardItem footer bordered style={{ justifyContent: 'center', height: 50, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0}}>                            
                        
                        <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}> Última visita </Text>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'bold'}}> {item.lastVisit} </Text>
                        </View>
                        
                        <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}> Internados </Text>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'bold'}}> {item.totalPatients} </Text>
                        </View>
                        
                        <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'normal'}}> Visitados </Text>
                            <Text style={{fontSize: 14, color: '#666', fontWeight:'bold'}}> {item.totalPatientsVisitedToday} </Text>
                        </View>
                        
                    
                    </CardItem>
                </Card>
            </View>
			
		</TouchableOpacity>
	);

	

	renderTimer(){
		return <Timer dateSync={this.state.dateSync} timerTextColor={this.state.timerTextColor} timerBackgroundColor={this.state.timerBackgroundColor}/>;
	}

	filterPatients = (patientQuery) => {

		const str = patientQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

		if(str !== '') {

			console.log(this.state.allPatients);

			const patientsFilteredNew = this.state.allPatients.filter(item => {
				return (
					item.patientName.toUpperCase().includes(str)
				)
			});
	
			this.setState({
				patientsFiltered: _.uniqBy(patientsFilteredNew, 'id'),
				patientQuery
			});

		} else {
			this.setState({ 
				patientsFiltered: [],
				patientQuery: null
			});
		}
	}

	renderItemPatient = (element) => {

		return (
			<TouchableOpacity onPress={() => {
				this.goToProfilePage(element.item) 
			}}>
				<List.Item title={`${element.item.patientName}`} />
				<TextValue color={'#999'} size={13} marginLeft={4} marginTop={-6} value={element.item.hospitalName} />
			</TouchableOpacity>
		);
	}

	goToProfilePage(patient) {

		this.setState({
			patientQuery: null,
			patientsFiltered: []
		});
	
		this.props.navigation.navigate("PatientDetail", { hospitalId: patient.hospitalId, patientId: patient.id, patient: patient, isEditable: this.state.isEditable});

	}

	filterHospitals(regionalHospital) {
		
		let hospitals = [];

		if(this.state.hospitals)
		{
			this.state.hospitals.map(item => {
				if (regionalHospital === 'ALL' || regionalHospital === item.regional) {
					hospitals.push(item)
				}
			});

			this.setState({
				selectedRegionalHospital: regionalHospital,
				filteredHospitals: hospitals
			});
		}
		
	}

	renderFilterHospital() {
		const pickerStyle = {
			inputIOS: {
				paddingTop: 15,
				paddingHorizontal: 10,
				paddingBottom: 15,
			},
			underline: { borderTopWidth: 0 }
		};

		//if (Session.current.user && Session.current.user.profile !== 'CONSULTANT') {
			return (
				<RNPickerSelect
					items={this.state.regions}
					doneText="OK"
					InputAccessoryView={() => null}
					placeholder={{label: 'Todas as Regionais', value: 'ALL'}}
					onValueChange={regional => { this.filterHospitals(regional) }}
					value={this.state.selectedRegionalHospital}
					style={pickerStyle}
				/>
			);
		//}
	}

	render(){
		return (
			<Container>

				<Spinner
		            visible={this.state.loading}
		            textContent={this.state.textContent}
		            textStyle={styles.spinnerTextStyle} />

				<RdRootHeader
					title='Hospitais'
					menu={ () => this.props.navigation.openDrawer() }
					sync={ () => Sync(this, true, 'hospitals') }/>

				{ this.renderTimer() }			

				<Line size={1} />

				<Searchbar placeholder="Buscar paciente" onChangeText={patientQuery => { this.filterPatients(patientQuery) }} value={this.state.patientQuery} />
				
					<List.Section style={styles.listItemPatient}>
						<FlatList
							data={this.state.patientsFiltered}
							keyExtractor={element => `${element.id}`}
							renderItem={this.renderItemPatient} 
							keyboardShouldPersistTaps="always" /> 
					</List.Section>
				
				<Line size={1} />

				{ this.renderFilterHospital() }

				<Content>
					<View style={styles.container}>

						<FlatList
							contentContainerStyle={baseStyles.container}
							data={this.state.filteredHospitals}
							keyExtractor={item => item.id + '_'}
							renderItem={this.renderItem} />
					</View>
				</Content>
			</Container>
		);
	}
}	