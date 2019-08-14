import moment from 'moment';
import uuid from 'uuid/v4';

import Patient from '../src/model/Patient';
import { IconEyeEnum, FinalizationErrorEnum, HospitalizationTypeEnum, AttendanceTypeEnum, HospitalizationStatusEnum, StatusVisitEnum } from '../src/model/Patient';


let patientJSON = null;

describe('Class Patients', () => {

    beforeEach(() => {

    });
    
    afterEach(() => {
    
    });
    
    beforeAll(() => {
    
    });
      
    afterAll(() => {
    
    });


    describe('Smoke Tests', () => {

        it('Deve criar um paciente conforme JSON passado', () => {
            const patient = new Patient(patientJSON);
            expect(patient.json).toEqual(patientJSON);
        });

    });


    describe('getIconNumber', () => {
        
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

        it('Deve retornar enum IconEyeEnum.OLHO_CINZA_COM_EXCLAMACAO (PACIENTE COM VISITA, SINALIZADO COM ALERTA E SEM ALTA)', () => {
            let patient = new Patient(patientJSON);
            patient.json.observationList.push({
                observationDate: new moment(),
                alert: true,
                observation: 'Observacao',
                uuid: uuid(),
            });

            expect(patient.getIconNumber()).toEqual(IconEyeEnum.OLHO_CINZA_COM_EXCLAMACAO);
        });

        it('Deve retornar enum IconEyeEnum.OLHO_AZUL (PACIENTE NÃO TEVE VISITA E SEM ALTA)', () => {
            let patient = new Patient(patientJSON);
            expect(patient.getIconNumber()).toEqual(IconEyeEnum.OLHO_AZUL);
        });

        it('Deve retornar enum IconEyeEnum.CASA_AZUL (PACIENTE COM ALTA)', () => {
            let patient = new Patient(patientJSON);
            patient.json.exitDate = new moment();
            expect(patient.getIconNumber()).toEqual(IconEyeEnum.CASA_AZUL);
        });

        it('Deve retornar enum IconEyeEnum.OLHO_CINZA_COM_CHECK (PACIENTE VISITADO HOJE E SEM ALTA)', () => {
            let patient = new Patient(patientJSON);
            patient.json.observationList.push({
                observationDate: new moment(),
                alert: false,
                observation: 'Observacao',
                uuid: uuid(),
            });

            expect(patient.getIconNumber()).toEqual(IconEyeEnum.OLHO_CINZA_COM_CHECK);
        });
    });

    describe('getIcon', () => {

        it('Deve retornar icone OLHO_CINZA_COM_CHECK', () => {
            expect(new Patient().getIcon(IconEyeEnum.OLHO_CINZA_COM_CHECK).testUri).toEqual('../../../src/images/_OLHO_CINZA_COM_CHECK.png');
        });

        it('Deve retornar icone OLHO_AZUL', () => {
            expect(new Patient().getIcon(IconEyeEnum.OLHO_AZUL).testUri).toEqual('../../../src/images/_OLHO_AZUL.png');
        });

        it('Deve retornar icone CASA_AZUL', () => {
            expect(new Patient().getIcon(IconEyeEnum.CASA_AZUL).testUri).toEqual('../../../src/images/_CASA_AZUL.png');
        });

        it('Deve retornar icone OLHO_CINZA_COM_EXCLAMACAO', () => {
            expect(new Patient().getIcon(IconEyeEnum.OLHO_CINZA_COM_EXCLAMACAO).testUri).toEqual('../../../src/images/_OLHO_CINZA_COM_EXCLAMACAO.jpg');
        });

        it('Deve retornar icone OLHO_AZUL_COM_EXCLAMACAO', () => {
            expect(new Patient().getIcon(IconEyeEnum.OLHO_AZUL_COM_EXCLAMACAO).testUri).toEqual('../../../src/images/_OLHO_AZUL_COM_EXCLAMACAO.png');
        });
    });
    
    describe('validateFinalization', () => {

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

        it('Deve criticar os campos obrigatórios (Altura e Peso, quando nulo)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = null;
            patient.json.patientWeight = null;
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = HospitalizationTypeEnum.Clinical;
            patient.json.diagnosticHypothesisList.push({'item': 1});

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.HeightAndWeightMissing);
        });

        it('Deve criticar os campos obrigatórios (Altura e Peso, quando vazio)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = '';
            patient.json.patientWeight = '';
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = HospitalizationTypeEnum.Clinical;
            patient.json.diagnosticHypothesisList.push({'item': 1});

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.HeightAndWeightMissing);
        });

        it('Deve criticar os campos obrigatórios (Altura e Peso, quando espaço em branco)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = '   ';
            patient.json.patientWeight = '       ';
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = HospitalizationTypeEnum.Clinical;
            patient.json.diagnosticHypothesisList.push({'item': 1});

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.HeightAndWeightMissing);
        });

        it('Deve criticar os campos obrigatórios (Tipo Atendimento, quando nulo)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.hospitalizationType = HospitalizationTypeEnum.Clinical;
            patient.json.attendanceType = null;
            patient.json.diagnosticHypothesisList.push({'item': 1});

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.AttendanceTypeMissing);
        });

        it('Deve criticar os campos obrigatórios (Tipo Atendimento, quando vazio)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.attendanceType = '';
            patient.json.hospitalizationType = HospitalizationTypeEnum.Clinical;
            patient.json.diagnosticHypothesisList.push({'item': 1});

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.AttendanceTypeMissing);
        });

        it('Deve criticar os campos obrigatórios (Tipo Atendimento, quando espaço em branco)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.attendanceType = '      ';
            patient.json.hospitalizationType = HospitalizationTypeEnum.Clinical;
            patient.json.diagnosticHypothesisList.push({'item': 1});

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.AttendanceTypeMissing);
        });

        it('Deve criticar os campos obrigatórios (Tipo Hospitalizacao, quando null)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = '1.80';
            patient.json.patientWeight = '98';
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = null;
            patient.json.diagnosticHypothesisList.push({'item': 1});

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.HospitalizationTypeMissing);
        });

        it('Deve criticar os campos obrigatórios (Tipo Hospitalizacao, quando vazio)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = '';
            patient.json.diagnosticHypothesisList.push({'item': 1});

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.HospitalizationTypeMissing);
        });

        it('Deve criticar os campos obrigatórios (Tipo Hospitalizacao, quando espaço em branco)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = '              ';
            patient.json.diagnosticHypothesisList.push({'item': 1});

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.HospitalizationTypeMissing);
        });

        it('Deve criticar os campos obrigatórios (CID Primário, quando null)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = HospitalizationTypeEnum.Clinical;
            patient.json.diagnosticHypothesisList = null;

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.PrimaryCidMissing);
        });

        it('Deve criticar os campos obrigatórios (CID Primário, quando campo vazio)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = HospitalizationTypeEnum.Clinical;
            patient.json.diagnosticHypothesisList = '';

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.PrimaryCidMissing);
        });

        it('Deve criticar os campos obrigatórios (CID Primário, quando array vazio)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = HospitalizationTypeEnum.Clinical;
            patient.json.diagnosticHypothesisList.push({});

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.PrimaryCidMissing);
        });

        it('Deve criticar os campos obrigatórios (CRM, quando nul)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = HospitalizationTypeEnum.Surgical;
            patient.json.diagnosticHypothesisList.push({'item': 1});
            patient.json.mainProcedureCRM = null;

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.CrmMissing);
        });

        it('Deve criticar os campos obrigatórios (CRM, quando vazio)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = HospitalizationTypeEnum.Surgical;
            patient.json.diagnosticHypothesisList.push({'item': 1});
            patient.json.mainProcedureCRM = '';

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.CrmMissing);
        });

        it('Deve criticar os campos obrigatórios (CRM, quando espaços em branco)', () => {
            let patient = new Patient(patientJSON);
            patient.json.patientHeight = 1.80;
            patient.json.patientWeight = 98;
            patient.json.attendanceType = AttendanceTypeEnum.Elective;
            patient.json.hospitalizationType = HospitalizationTypeEnum.Surgical;
            patient.json.diagnosticHypothesisList.push({'item': 1});
            patient.json.mainProcedureCRM = '    ';

            let errors = patient.validateFinalization();

            expect(errors.length).toBe(1);
            expect(errors).toContain(FinalizationErrorEnum.CrmMissing);
        });

    });

    describe('getLastObservation', () => {

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

        it('Deve retornar última observacao', () => {
            let patient = new Patient(patientJSON);
            let observation = {
                "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                "observationDate":"2019-03-22T15:25:14+0000",
                "alert":false,
                "medicalRelease":false,
                "endTracking":false,
                "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                "removedAt":null
            };
            
            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate":"2019-03-21T12:36:22+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.getLastObservation().json).toEqual(observation);
        });

        it('Deve retornar null', () => {
            let patient = new Patient(patientJSON);
            patient.json.observationList = null;
            
            expect(patient.getLastObservation()).toBeUndefined();
        });

    });

    describe('getLastTracking', () => {

        beforeEach(() => {
            patientJSON = {
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
                "orderField":"12Ana Julia Carvalho de Serro Azul Dias",
            }
        });

        it('Deve retornar último trackingList', () => {
            let patient = new Patient(patientJSON);
            let tracking = {
                "endDate":"2019-05-28T14:10:00+0000",
                "startDate":"2019-05-28T03:10:00+0000",
                "trackingId":7265,
                "hospitalizationId":6812,
                "startMode":"HOSPITALIZATIION_ENTRANCE",
                "endMode":"ADMIN_DISCHARGE_EXIT"
            };
            
            patient.json.trackingList = [
                {
                    "endDate":"2019-02-19T17:50:00+0000",
                    "startDate":null,
                    "trackingId":6668,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-02-19T17:50:00+0000",
                    "startDate":"2019-02-18T17:40:00+0000",
                    "trackingId":6668,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-05-28T14:10:00+0000",
                    "startDate":"2019-05-28T03:10:00+0000",
                    "trackingId":7265,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-05-28T01:10:00+0000",
                    "startDate":"2019-05-23T01:10:00+0000",
                    "trackingId":7264,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                }
            ];

            expect(patient.getLastTracking().json).toEqual(tracking);
        });

        it('Deve retornar null', () => {
            let patient = new Patient(patientJSON);
            patient.json.trackingList = null;
            
            expect(patient.getLastTracking()).toBeUndefined();
        });

    });

    describe('getHospitalizationStatusEnum', () => {
        beforeEach(() => {
            patientJSON = {
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
                "orderField":"12Ana Julia Carvalho de Serro Azul Dias",
            }
        });

        it('Deve retornar enum HospitalizationStatusEnum.Open', () => {
            let patient = new Patient(patientJSON);
            
            patient.json.trackingList = [
                {
                    "endDate":"2019-02-19T17:50:00+0000",
                    "startDate":null,
                    "trackingId":6668,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-02-19T17:50:00+0000",
                    "startDate":"2019-02-18T17:40:00+0000",
                    "trackingId":6668,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":null,
                    "startDate":"2019-05-28T03:10:00+0000",
                    "trackingId":7265,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-05-28T01:10:00+0000",
                    "startDate":"2019-05-23T01:10:00+0000",
                    "trackingId":7264,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                }
            ];

            expect(patient.getHospitalizationStatusEnum()).toEqual(HospitalizationStatusEnum.Open);
        });

        it('Deve retornar enum HospitalizationStatusEnum.Closed (MedicalRelease true)', () => {
            let patient = new Patient(patientJSON);
            
            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate":"2019-03-21T12:36:22+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":false,
                    "medicalRelease":true,
                    "endTracking":false,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.getHospitalizationStatusEnum()).toEqual(HospitalizationStatusEnum.Closed);
        });

        it('Deve retornar enum HospitalizationStatusEnum.Closed (EndTracking true)', () => {
            let patient = new Patient(patientJSON);
            
            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate":"2019-03-21T12:36:22+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":true,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.getHospitalizationStatusEnum()).toEqual(HospitalizationStatusEnum.Closed);
        });

        it('Deve retornar enum HospitalizationStatusEnum.CanBeClosed (Com observação sem EndTracking e MedicalRelease)', () => {
            let patient = new Patient(patientJSON);
            
            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate":"2019-03-21T12:36:22+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.getHospitalizationStatusEnum()).toEqual(HospitalizationStatusEnum.CanBeClosed);
        });

        it('Deve retornar enum HospitalizationStatusEnum.CanBeClosed (Sem observação)', () => {
            let patient = new Patient(patientJSON);

            expect(patient.getHospitalizationStatusEnum()).toEqual(HospitalizationStatusEnum.CanBeClosed);
        });
    });

    describe('isHospitalizationActive', () => {
        beforeEach(() => {
            patientJSON = {
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
                "orderField":"12Ana Julia Carvalho de Serro Azul Dias",
            }
        });

        it('Deve retornar hospitalização ativa', () => {
            let patient = new Patient(patientJSON);

            expect(patient.isHospitalizationActive()).toBeTruthy();
        });

        it('Deve retornar hospitalização inativa (Por exitDate preenchido)', () => {
            let patient = new Patient(patientJSON);
            
            patient.json.exitDate = new moment();

            expect(patient.isHospitalizationActive()).toBeFalsy();
        });

        it('Deve retornar hospitalização inativa (Por último TrackingList com endDate preenchido)', () => {
            let patient = new Patient(patientJSON);
            
            patient.json.trackingList = [
                {
                    "endDate":"2019-02-19T17:50:00+0000",
                    "startDate":null,
                    "trackingId":6668,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-02-19T17:50:00+0000",
                    "startDate":"2019-02-18T17:40:00+0000",
                    "trackingId":6668,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-05-28T14:10:00+0000",
                    "startDate":"2019-05-28T03:10:00+0000",
                    "trackingId":7265,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-05-28T01:10:00+0000",
                    "startDate":"2019-05-23T01:10:00+0000",
                    "trackingId":7264,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                }
            ];

            expect(patient.isHospitalizationActive()).toBeFalsy();
        });

    });

    describe('hasObservationToday', () => {
        beforeEach(() => {
            patientJSON = {
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
                "orderField":"12Ana Julia Carvalho de Serro Azul Dias",
            }
        });

        it('Deve retornar TRUE para observação na data corrente', () => {
            let patient = new Patient(patientJSON);

            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate": new moment(),
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.hasObservationToday()).toBeTruthy();
        });

        it('Deve retornar FALSE para observação na data corrente (com observações)', () => {
            let patient = new Patient(patientJSON);
            
            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate":"2019-03-21T12:36:22+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.hasObservationToday()).toBeFalsy();
        });

        it('Deve retornar FALSE para observação na data corrente (sem observações)', () => {
            let patient = new Patient(patientJSON);

            expect(patient.hasObservationToday()).toBeFalsy();
        });

    });

    describe('getStatusVisitEnum', () => {
        beforeEach(() => {
            patientJSON = {
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
                "orderField":"12Ana Julia Carvalho de Serro Azul Dias",
            }
        });

        it('Deve retornar enum StatusVisitEnum.Visited', () => {
            let patient = new Patient(patientJSON);

            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate": new moment(),
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.getStatusVisitEnum()).toEqual(StatusVisitEnum.Visited);
        });

        it('Deve retornar enum StatusVisitEnum.NotVisited', () => {
            let patient = new Patient(patientJSON);

            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate":"2019-03-21T12:36:22+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.getStatusVisitEnum()).toEqual(StatusVisitEnum.NotVisited);
        });

        it('Deve retornar enum StatusVisitEnum.NotVisitedAlert', () => {
            let patient = new Patient(patientJSON);

            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate":"2019-03-21T12:36:22+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":true,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.getStatusVisitEnum()).toEqual(StatusVisitEnum.NotVisitedAlert);
        });

        it('Deve retornar enum StatusVisitEnum.VisitedDischarged', () => {
            let patient = new Patient(patientJSON);

            patient.json.exitDate = new moment();
            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate":"2019-03-21T12:36:22+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":false,
                    "medicalRelease":true,
                    "endTracking":false,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.getStatusVisitEnum()).toEqual(StatusVisitEnum.VisitedDischarged);
        });

        it('Deve retornar enum StatusVisitEnum.VisitedEndTracking', () => {
            let patient = new Patient(patientJSON);

            patient.json.exitDate = new moment();
            patient.json.observationList = [
                {
                    "uuid":"3DB352D7-E4DB-4C1C-BCC9-6F7E2D76F5F3",
                    "observationDate":"2019-03-21T12:36:22+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com melhora importante da dor , ligaremos para o Dr. Aulus agora e provavelmente liberaremos PCR 3,4 .",
                    "removedAt":null
                },
                {
                    "uuid":"D4DDF6C3-7465-45ED-887F-477B50688766",
                    "observationDate":"2019-03-22T15:25:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":true,
                    "observation":"Paciente ainda não liberado e aparentemente sem balizamento técnico para permanência. Avaliarei  detalhadamente a permanência nas últimas 24 horas ",
                    "removedAt":null
                },
                {
                    "uuid":"6602EA1E-C2F9-46B0-BCB8-D8BA6437C6C1",
                    "observationDate":"2019-03-20T16:31:14+0000",
                    "alert":false,
                    "medicalRelease":false,
                    "endTracking":false,
                    "observation":"Paciente com artrodese coluna L5-S1 há 48h no caxias D’Or procurou hospital com dor intensa. Em uso de analgésico e opióides em casa chegou no setor de emergência “ chorando de dor. Internação devido a pela intensidade da dor.",
                    "removedAt":null
                }
            ];

            expect(patient.getStatusVisitEnum()).toEqual(StatusVisitEnum.VisitedEndTracking);
        });

        it('Deve retornar enum StatusVisitEnum.NotVisitedDischarged', () => {
            let patient = new Patient(patientJSON);

            patient.json.exitDate = new moment();
            patient.json.trackingList = [
                {
                    "endDate":"2019-02-19T17:50:00+0000",
                    "startDate":null,
                    "trackingId":6668,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-02-19T17:50:00+0000",
                    "startDate":"2019-02-18T17:40:00+0000",
                    "trackingId":6668,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-05-28T14:10:00+0000",
                    "startDate":"2019-05-28T03:10:00+0000",
                    "trackingId":7265,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-05-28T01:10:00+0000",
                    "startDate":"2019-05-23T01:10:00+0000",
                    "trackingId":7264,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                }
            ];

            expect(patient.getStatusVisitEnum()).toEqual(StatusVisitEnum.NotVisitedDischarged);
        });

        it('Deve retornar enum StatusVisitEnum.NotVisitedEndTracking', () => {
            let patient = new Patient(patientJSON);

            patient.json.exitDate = new moment();
            patient.json.trackingList = [
                {
                    "endDate":"2019-02-19T17:50:00+0000",
                    "startDate":null,
                    "trackingId":6668,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-02-19T17:50:00+0000",
                    "startDate":"2019-02-18T17:40:00+0000",
                    "trackingId":6668,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                },
                {
                    "endDate":"2019-05-28T14:10:00+0000",
                    "startDate":"2019-05-28T03:10:00+0000",
                    "trackingId":7265,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"CHANGE_INSURANCE_EXIT"
                },
                {
                    "endDate":"2019-05-28T01:10:00+0000",
                    "startDate":"2019-05-23T01:10:00+0000",
                    "trackingId":7264,
                    "hospitalizationId":6812,
                    "startMode":"HOSPITALIZATIION_ENTRANCE",
                    "endMode":"ADMIN_DISCHARGE_EXIT"
                }
            ];

            expect(patient.getStatusVisitEnum()).toEqual(StatusVisitEnum.NotVisitedEndTracking);
        });

        it('Deve retornar enum StatusVisitEnum.Unexpected', () => {
            let patient = new Patient(patientJSON);

            patient.json.exitDate = new moment();

            expect(patient.getStatusVisitEnum()).toEqual(StatusVisitEnum.Unexpected);
        });

    });
});