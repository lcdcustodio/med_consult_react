import moment from 'moment'
import uuid from 'uuid/v4'

import Patient from '../src/model/Patient'
import { IconEyeEnum } from '../src/model/Patient'

let patientJSON = null;

describe('Class Patients', () => {

    beforeEach(() => {
        patientJSON = {
            "trackingList":[{"endDate":null,"startDate":"2019-07-26T14:07:36+0000","trackingId":7286,"hospitalizationId":7450,"startMode":"HOSPITALIZATIION_ENTRANCE","endMode":null}],
            "recommendationClinicalIndication":null,
            "recommendationWelcomeHomeIndication":null,
            "recommendationMedicineReintegration":null,
            "previousHospitalizations":[],
            "id":7450,
            "patientName":"Ana Julia Carvalho de Serro Azul Dias",
            "patientBornDate":"1981-08-17",
            "patientHeight":null,
            "patientWeight":null,
            "admissionDate":"2019-07-26T14:07:02+0000",
            "exitDate":null,
            "death":false,
            "barCode":"15368882",
            "externalPatient":false,
            "medicalExitDate":null,
            "exitDescription":null,
            "plane":"",
            "agreement":"",
            "locationType":"NORMAL",
            "locationSession":"Ap Hosp",
            "locationBed":"1110",
            "locationDateFrom":null,
            "attendanceType":null,
            "hospitalizationType":null,
            "medicalRecordsNumber":"2269576",
            "mainProcedureTUSSId":null,
            "mainProcedureTUSSDisplayName":null,
            "mainProcedureCRM":null,
            "diagnosticHypothesisList":[],
            "secondaryCIDList":[],
            "observationList":[],
            "examRequestList":[],
            "furtherOpinionList":[],
            "medicalProceduresList":[],
            "medicineUsageList":[],
            "timeDependentMedicineUsageList":[],
            "morbidityComorbityList":[],
            "clinicalIndication":null,
            "medicineReintegration":null,
            "welcomeHomeIndication":null,
            "complementaryInfoHospitalizationAPI":{"id":3471,"hemoglobin":null,"isNotHemoglobin":false,"isNotSerumSodium":false,"serumSodium":null,"isPancreateColectomyHepatic":false,"isUrgentEmergHospitatization":false,"isHospitatizationFiveDays":false,"hospitalizationsInTwelveMonths":null,"isHighOncologicalServiceOrProcedure":false,"result":null},
            "lastLocalModification":null,
            "removedItemList":null,
            "hospitalName":"HOSPITAL ITAIM",
            "hospitalId":142,
            "totalDaysOfHospitalization":5,
            "colorNumber":2,
            "colorName":"black",
            "backgroundColor":"#fff",
            "lastVisit":"S/ visita",
            "iconNumber":1,
            "icon":18,
            "orderField":"12Ana Julia Carvalho de Serro Azul Dias"
        }
    });
    
    afterEach(() => {
    
    });
    
    beforeAll(() => {
    
    });
      
    afterAll(() => {
    
    });


    describe('Class Patients - smoke tests', () => {

        it('Deve criar um paciente conforme JSON passado', () => {
            const patient = new Patient(patientJSON)
            expect(patient.json).toEqual(patientJSON)
        });

    });


    describe('Patients - getIconNumber', () => {

        it('Deve retornar icone olho cinza com exclamação (TEVE VISITA E COM ALERTA E NÃO TEVE ALTA)', () => {
            const patient = new Patient(patientJSON)
            patient.json.observationList.push({
                observationDate: new moment(),
                alert: true,
                observation: 'Observacao',
                uuid: uuid(),
            })

            expect(patient.getIconNumber()).toEqual(IconEyeEnum.OLHO_CINZA_COM_EXCLAMACAO)
        });

        it('Deve retornar icone olho azul (NÃO TEVE VISITA E NÃO TEVE ALTA)', () => {
            const patient = new Patient(patientJSON)
            expect(patient.getIconNumber()).toEqual(IconEyeEnum.OLHO_AZUL)
        });

        it('Deve retornar icone casa azul (TEVE ALTA)', () => {
            const patient = new Patient(patientJSON)
            patient.json.exitDate = new moment()
            expect(patient.getIconNumber()).toEqual(IconEyeEnum.CASA_AZUL)
        });

        it('Deve retornar icone olho cinza com check (VISITADO HOJE E NÃO TEVE ALTA)', () => {
            const patient = new Patient(patientJSON)
            patient.json.observationList.push({
                observationDate: new moment(),
                alert: false,
                observation: 'Observacao',
                uuid: uuid(),
            })

            expect(patient.getIconNumber()).toEqual(IconEyeEnum.OLHO_CINZA_COM_CHECK)
        });
    });

});