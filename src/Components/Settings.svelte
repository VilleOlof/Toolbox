<script lang="ts">
    import { onMount } from "svelte";
    import { GlobalSettings, SettingTypes, Settings } from "../Lib/Settings";

    let InputComponents: Record<string, Function> = {};

    for (const type of Object.keys(SettingTypes.Type).filter((v) => !isNaN(Number(v)))) {
        const name: string = SettingTypes.Type[type];
        InputComponents[name] = async function () {
            return (await import(/* @vite-ignore*/ `./SettingInputComponents/${name}.svelte`));
        };
    }

    //Too many arguments passing around, need to refactor this
    async function GenerateSettingComponents(Settings: Record<string, Settings>): Promise<void> {
        const settingsContainer = document.getElementById('autoGenSettings') as HTMLDivElement;

        for (const [componentID, settingInstance] of Object.entries(Settings)) {
            const componentContainer: HTMLDivElement = document.createElement('div');
            componentContainer.id = componentID;

            componentContainer.appendChild(document.createElement('h2')).innerText = componentID;

            await LoopOverSettings(componentID, settingInstance, componentContainer);

            settingsContainer.appendChild(componentContainer);
        }
    }

    async function LoopOverSettings(componentID: string, settingInstance: Settings,componentContainer: HTMLDivElement): Promise<void> {
        for (const [settingName, settingInfo] of Object.entries(settingInstance.GetAllComponentSettings())) {
                const settingContainer: HTMLDivElement = document.createElement('div');
                settingContainer.id = settingName;
                
                settingContainer.appendChild(document.createElement('h3')).innerText = settingName;
                settingContainer.appendChild(document.createElement('p')).innerText = settingInfo.Description;

                AddNewSettingInput(settingInfo, settingContainer, componentID, settingName);

                componentContainer.appendChild(settingContainer);
        }
    }

    async function AddNewSettingInput(settingInfo: SettingTypes.Info, settingContainer: HTMLDivElement, componentID: string, settingName: string): Promise<void> {
        const EnumName: string = SettingTypes.Type[settingInfo.Type];
        const input = await InputComponents[EnumName]();
        
        new input.default({
            target: settingContainer,
            props: {
                componentID: componentID,
                settingName: settingName,
                settingInfo: settingInfo,
            }
        });
    }

    onMount(async () => {
        await GenerateSettingComponents(GlobalSettings._ComponentSettings);
    });

</script>

<div id="settingsContainer">

    <h1>Settings</h1>

    <div id="autoGenSettings"></div>

</div>

<style lang="scss">

    #settingsContainer {
        margin: 1rem;
    }

</style>