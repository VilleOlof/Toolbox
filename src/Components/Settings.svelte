<script lang="ts">
  import { onMount } from "svelte";
    import { GlobalSettings, SettingTypes } from "../Lib/Settings";

    let InputComponents: Record<string, Function> = {};

    for (const type of Object.keys(SettingTypes.Type).filter((v) => !isNaN(Number(v)))) {
        const name: string = SettingTypes.Type[type];
        InputComponents[name] = async function () {
            return (await import(/* @vite-ignore*/ `../../src/Components/SettingInputComponents/${name}.svelte`));
        };
    }

    async function GenerateSettingComponents(Settings: Record<string, Record<string, SettingTypes.Info>>): Promise<void> {
        const settingsContainer = document.getElementById('autoGenSettings') as HTMLDivElement;

        for (const [componentID, settings] of Object.entries(Settings)) {
            const componentContainer: HTMLDivElement = document.createElement('div');
            componentContainer.id = componentID;

            componentContainer.appendChild(document.createElement('h2')).innerText = componentID;

            for (const [settingName, settingInfo] of Object.entries(settings)) {
                const settingContainer: HTMLDivElement = document.createElement('div');
                settingContainer.id = settingName;

                settingContainer.appendChild(document.createElement('h3')).innerText = settingName;
                settingContainer.appendChild(document.createElement('p')).innerText = settingInfo.Description;

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

                componentContainer.appendChild(settingContainer);
            }

            settingsContainer.appendChild(componentContainer);
        }
    }

    onMount(async () => {
        await GenerateSettingComponents(GlobalSettings._Settings);
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

    #autoGenSettings {

        //componentContainers
        & > * {

        }
    }

</style>