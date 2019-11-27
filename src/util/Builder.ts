import JsonEntity	from '../util/JsonEntity';
import Observation	from './Observation';
import Tracking, { TrackingEndModeEnum } from './Tracking';
import _ from 'lodash';
import moment from 'moment';

export default class Builder extends JsonEntity<Patient> {

    public getPatientFromHospitals(id, hospitals)
    {
    	if (hospitals) {

			for (var h = 0; h < hospitals.length; h++) {		

				for (var i = 0; i < hospitals[h].hospitalizationList.length; i++) {
					
					let p = hospitals[h].hospitalizationList[i];

					if(id == p.id)
					{   

                        hospitals[h].hospitalizationList[i].hospitalId = hospitals[h].id;

						return hospitals[h].hospitalizationList[i];
					}
				}
			}
		}
		else
		{
			return null;
		}
    }

    public validateToSync(res, hospitals) {

        let json = [];

        if (res != null) {

            let hospitalizationList = JSON.parse(res);

            for (var i = 0; i < hospitalizationList.length; i++) {

                let array = {};
                array['id'] = hospitalizationList[i].idPatient;
                array[hospitalizationList[i].key] = hospitalizationList[i].value;

                json.push(array);
            }
        }
        
        let parse = {};

        let error = [];

        for (var i = 0; i < json.length; i++) {

            for (var attrname in json[i])
            {
                if (attrname == 'id') continue;

                let patient = this.getPatientFromHospitals(json[i].id, hospitals);

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

                if (parse[json[i].id].hasOwnProperty('patientHeight') && parse[json[i].id].patientHeight != null) {
                    parse[json[i].id]['patientHeight'] = parse[json[i].id]['patientHeight'].toString().replace(',', '.').replace(/,/g, '');
                }

                if (parse[json[i].id].hasOwnProperty('patientWeight') && parse[json[i].id].patientWeight != null) {
                    parse[json[i].id]['patientWeight'] = parse[json[i].id]['patientWeight'].toString().replace(',', '.').replace(/,/g, '');
                }

                if (parse[json[i].id].hasOwnProperty('complementaryInfoHospitalizationAPI') && parse[json[i].id].complementaryInfoHospitalizationAPI != null) {
                    
                    if (parse[json[i].id].complementaryInfoHospitalizationAPI.hemoglobin != null) {
                        parse[json[i].id]['complementaryInfoHospitalizationAPI']['hemoglobin'] = parse[json[i].id]['complementaryInfoHospitalizationAPI']['hemoglobin'].toString().replace(',', '.').replace(/,/g, '');
                    }

                    if (parse[json[i].id].complementaryInfoHospitalizationAPI.serumSodium != null) {
                        parse[json[i].id]['complementaryInfoHospitalizationAPI']['serumSodium'] = parse[json[i].id]['complementaryInfoHospitalizationAPI']['serumSodium'].toString().replace(',', '.').replace(/,/g, '');
                    }
                }

                if (parse[json[i].id].hasOwnProperty('observationList')) {

                    let listOfOrderedPatientObservations = _.orderBy(parse[json[i].id]['observationList'], ['observationDate'], ['desc']);

                    let lastElementVisit = listOfOrderedPatientObservations[0];

                    parse[json[i].id]['observationList'] = [];

                    parse[json[i].id]['observationList'].push(lastElementVisit);
                }

                if (parse[json[i].id].patientHeight >= 10) {

                    error['hospitalId'] = patient.hospitalId;
                    error['patientId'] = patient.id;
                    error['patient'] = patient;
                    error['error'] = 'Altura ' + parse[json[i].id].patientHeight + 'm informada para o(a) paciente ' + patient.patientName + ' é inválida';

                    return error;
                }

                if (parse[json[i].id].patientWeight >= 1000) {

                    error['hospitalId'] = patient.hospitalId;
                    error['patientId'] = patient.id;
                    error['patient'] = patient;
                    error['error'] = 'Peso ' + parse[json[i].id].patientWeight + 'kg informado para o(a) paciente ' + patient.patientName + ' é inválido';

                    return error;
                }
            }
        }

        return false;
    }

    public parseToSync(res, hospitals) {

        let json = [];

        if (res != null) {

            let hospitalizationList = JSON.parse(res);

            for (var i = 0; i < hospitalizationList.length; i++) {

                let array = {};
                array['id'] = hospitalizationList[i].idPatient;
                array[hospitalizationList[i].key] = hospitalizationList[i].value;

                json.push(array);
            }
        }
        
        let parse = {};

        for (var i = 0; i < json.length; i++) {

            for (var attrname in json[i])
            {
                if (attrname == 'id') continue;

                let patient = this.getPatientFromHospitals(json[i].id, hospitals);

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

                if (parse[json[i].id].hasOwnProperty('patientHeight') && parse[json[i].id].patientHeight != null) {
                    parse[json[i].id]['patientHeight'] = parse[json[i].id]['patientHeight'].toString().replace(',', '.').replace(/,/g, '');
                }

                if (parse[json[i].id].hasOwnProperty('patientWeight') && parse[json[i].id].patientWeight != null) {
                    parse[json[i].id]['patientWeight'] = parse[json[i].id]['patientWeight'].toString().replace(',', '.').replace(/,/g, '');
                }

                if (parse[json[i].id].hasOwnProperty('complementaryInfoHospitalizationAPI') && parse[json[i].id].complementaryInfoHospitalizationAPI != null) {
                    
                    if (parse[json[i].id].complementaryInfoHospitalizationAPI.hemoglobin != null) {
                        parse[json[i].id]['complementaryInfoHospitalizationAPI']['hemoglobin'] = parse[json[i].id]['complementaryInfoHospitalizationAPI']['hemoglobin'].toString().replace(',', '.').replace(/,/g, '');
                    }

                    if (parse[json[i].id].complementaryInfoHospitalizationAPI.serumSodium != null) {
                        parse[json[i].id]['complementaryInfoHospitalizationAPI']['serumSodium'] = parse[json[i].id]['complementaryInfoHospitalizationAPI']['serumSodium'].toString().replace(',', '.').replace(/,/g, '');
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
}
