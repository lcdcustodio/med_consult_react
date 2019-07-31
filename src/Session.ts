import User from "./model/User";
import Enviroment from "./model/Enviroment";

export default class Session {

	private static _current: Session = new Session();

	private _user: User;
	private _enviroment: Enviroment;

	private constructor() {
		this._user = null;
		this._enviroment = null;
	}

	public static get current(): Session {
		return Session._current;
	}

	public get user(): User {
		return this._user;
	}

	public set user(value: User) {
		this._user = value;
	}

	public get enviroment(): Enviroment {
		return this._enviroment;
	}

	public set enviroment(value: Enviroment) {
		this._enviroment = value;
	}
}
