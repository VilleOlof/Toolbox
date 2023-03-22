/**
 * A record of all the data stores that have been created.
 */
let _DataStores: Record<string, DataStore> = {};

/**
 * The CallbackFunction type for the _Subcribers record value.
 */
type CallbackFunction = (value: any) => void;

/**
 * A simple data store that can be used to store and retrieve data for a component.
 * 
 * @param componentID The ID of the component that the data is for.
 * @param loadUponStart Whether or not to load the data upon creation of the store.
 */
class DataStore {

    constructor(componentID: string, loadUponStart: boolean = true) {
        this._ComponentID = componentID;

        if (loadUponStart) {
            this.Load();
        }

        _DataStores[componentID] = this;

        return this;
    }

    /**
     * The ID of the component that the data is for.
     */
    private _ComponentID: string;

    /**
     * The data that is stored.
     */
    private _Data: Record<string, any> = {};

    /**
     * The subscribers that are subscribed to the data.
     */
    private _Subscribers: Record<string, CallbackFunction[]> = {};

    /**
     * Notifies all subscribers of a data change.
     * 
     * @param key The key of the data that has changed.
     * @param value The new value of the data.
     */
    private Notify(key: string, value: any): void {
        if (this._Subscribers[key]) {
            this._Subscribers[key].forEach((callback) => callback(value));
        }
    }

    /**
     * Whether or not to save the data upon change.
     */
    public SaveUponChange: boolean = true;

    /**
     * Sets the data for a key.
     * 
     * @param key The key of the data to set.
     * @param value The value of the data to set.
     * @param notify Whether or not to notify subscribers of the change.
     * @param save Whether or not to save the data. If SaveUponChange is true, this will be ignored.
     */
    public Set(key: string, value: any = undefined, notify: boolean = true, save: boolean = true): void {
        this._Data[key] = value;
        if (notify) this.Notify(key, value);
        if (this.SaveUponChange || save) this.Save();
    };

    /**
     * Gets the data for a key.
     * 
     * @param key The key of the data to get.
     * @param defaultValue The default value to return if the key does not exist.
     */
    public Get<T>(key: string, defaultValue: any = undefined): T {
        return this._Data[key] || defaultValue;
    };

    /**
     * Loads the data from local storage.
     */
    public Load(): void {
        const settings = localStorage.getItem(this._ComponentID);
        if (settings) {
            this._Data = JSON.parse(settings);
        }
    };

    /**
     * Saves the data to local storage.
     */
    public Save(): void {
        localStorage.setItem(this._ComponentID, JSON.stringify(this._Data));
    }

    /**
     * Deletes the data for a key and removes it from local storage.
     * 
     * @param key The key of the data to delete.
     * @param notify Whether or not to notify subscribers of the change.
     */
    public Delete(key: string, notify: boolean = false) {
        localStorage.removeItem(this._ComponentID);
        delete this._Data[key];

        if (notify) {
            this.Notify(key, undefined);
        }
    };

    /**
     * Subscribes to a key.
     * 
     * @param key The key to subscribe to.
     * @param callback The callback to call when the data changes.
     */
    public Subscribe(key: string, callback: (value: any) => void) {
        if (!this._Subscribers[key]) {
            this._Subscribers[key] = [];
        }
        this._Subscribers[key].push(callback);
    }

    /**
     * Unsubscribes from a key.
     * 
     * @param key The key to unsubscribe from.
     * @param callback The callback to unsubscribe.
     */
    public Unsubscribe(key: string, callback: (value: any) => void) {
        if (this._Subscribers[key]) {
            this._Subscribers[key] = this._Subscribers[key].filter((cb) => cb !== callback);
        }
    }

    /**
     * Gets the ID of the component that the data is for.
     */
    public GetComponentID(): string {
        return this._ComponentID;
    }

    /**
     * Gets the data store for a component ID.
     * 
     * @param componentID The ID of the component to get the data store for.
     */
    public static GetDataStoreByID(componentID: string): DataStore {
        return _DataStores[componentID];
    }

    /**
     * Gets all the data stores.
     */
    public static GetAllDataStores(): Record<string, DataStore> {
        return _DataStores;
    }

    /**
     * Deletes the data store by the component ID / DataStoreInstance.
     * 
     * @param componentID The ID of the component to delete the data store for.
     * @param DataStoreInstance The data store to delete.
     * @param input The input to delete the data store for.
     */
    public static DeleteDataStore(componentID: string): void
    public static DeleteDataStore(DataStoreInstance: DataStore): void
    public static DeleteDataStore(input?: string | DataStore): void {
        if (typeof input === "string") {
            delete _DataStores[input];
        }
        else if (input instanceof DataStore) {
            delete _DataStores[input.GetComponentID()];
        }
    }
}

export default DataStore;