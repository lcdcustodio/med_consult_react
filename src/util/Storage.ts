import JsonEntity	from '../util/JsonEntity';
import AsyncStorage from '@react-native-community/async-storage';

export default class Storage extends JsonEntity<Patient> {

    public clearPartialData()
    {
        console.log('OK');
    }
}
