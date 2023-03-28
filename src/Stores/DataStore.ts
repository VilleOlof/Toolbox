/**
 * A record of all the data stores that have been created.
 */
let _DataStores: Record<string, DataStore> = {};

/**
 * Whether or not to use JSON to save the data.
 */
const UseJSON: boolean = true;

/**
 * The CallbackFunction type for the _Subcribers record value.
 */
type CallbackFunction = (value: any) => void;

/**
 * A simple data store that can be used to store and retrieve various data for a component.
 * Saved in local storage.
 */
class DataStore {

    /**
     * Creates a new data store for a component.
     * 
     * @constructor
     * @param componentID The ID of the component that the data is for.
     * @param loadUponStart Whether or not to load the data upon creation of the store.
     * 
     * @example
     * ```ts
     * const DataStore = new DataStore("ComponentID");
     * ```
     */
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

    private _JSONSavePath: string = "../../Data.json";

    /**
     * Notifies all subscribers of a data change.
     * 
     * @param key The key of the data that has changed.
     * @param value The new value of the data.
     * 
     * @private
     * 
     * @example
     * ```ts
     * this.Notify("Key", "Value");
     * ```
     */
    private Notify(key: string, value: any): void {
        if (this._Subscribers[key]) {
            this._Subscribers[key].forEach((callback) => callback(value));
        }
    }

    private SaveToJSON(jsonString: string): void {
        const fs = require("fs");
        fs.writeFile(__dirname + this._JSONSavePath, jsonString, (err) => {
            if (err) {
                console.log(err);
            }
        });
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
     * 
     * @example
     * ```ts
     * this.Set("Key", "Value");
     * ```
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
     * 
     * @example
     * ```ts
     * const Value: T = this.Get<T>("Key");
     * ```
     */
    public Get<T>(key: string, defaultValue?: T): T {
        return this._Data[key] || defaultValue;
    };

    /**
     * Loads the data from local storage.
     * 
     * @example
     * ```ts
     * this.Load();
     * ```
     */
    public Load(): void {
        if (UseJSON) {
            const settings = require(__dirname + this._JSONSavePath);
            this._Data = settings[this._ComponentID];
            return;
        }

        const settings = localStorage.getItem(this._ComponentID);
        if (settings) {
            this._Data = JSON.parse(settings);
        }
    };

    /**
     * Saves the data to local storage.
     * 
     * @example
     * ```ts
     * this.Save();
     * ```
     */
    public Save(): void {
        if (UseJSON) {
            const json: string = JSON.stringify({[this.GetComponentID()]: this._Data}, null, 4);
            this.SaveToJSON(json);
            return;
        }

        localStorage.setItem(this._ComponentID, JSON.stringify(this._Data));
    }

    /**
     * Deletes the data for a key and removes it from local storage.
     * 
     * @param key The key of the data to delete.
     * @param notify Whether or not to notify subscribers of the change.
     * 
     * @example
     * ```ts
     * this.Delete("Key");
     * ```
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
     * 
     * @example
     * ```ts
     * this.Subscribe<T>("Key", (value: T) => {
     *    // Do something with the value.
     * });
     */
    public Subscribe<T>(key: string, callback: (value: T) => void) {
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
     * 
     * @example
     * ```ts
     * this.Unsubscribe<T>("Key", (value: T) => {
     *   // Do something with the value.
     * });
     */
    public Unsubscribe(key: string, callback: (value: any) => void) {
        if (this._Subscribers[key]) {
            this._Subscribers[key] = this._Subscribers[key].filter((cb) => cb !== callback);
        }
    }

    /**
     * Gets the ID of the component that the data is for.
     * 
     * @example
     * ```ts
     * const ComponentID: string = this.GetComponentID();
     * ```
     */
    public GetComponentID(): string {
        return this._ComponentID;
    }

    /**
     * Gets the data store for a component ID.
     * 
     * @param componentID The ID of the component to get the data store for.
     * 
     * @example
     * ```ts
     * const dataStore: DataStore = DataStore.GetDataStoreByID("ComponentID");
     * ```
     */
    public static GetDataStoreByID(componentID: string): DataStore {
        return _DataStores[componentID];
    }

    /**
     * Gets all the data stores.
     * 
     * @example
     * ```ts
     * const dataStores: Record<string, DataStore> = DataStore.GetAllDataStores();
     * ```
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
     * 
     * @example
     * ```ts
     * DataStore.DeleteDataStore("ComponentID");
     * // OR
     * DataStore.DeleteDataStore(dataStore);
     * ```
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