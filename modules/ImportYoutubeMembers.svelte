<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';
    import { slide } from "svelte/transition";

    const componentID: string = "ImportYoutubeMembers";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large);

        UpdateInputsLookups();
    });

    const _Datastore = new DataStore(componentID);

    let TeirListData: {[key: string]: string} = _Datastore.Get('TeirListData', {});
    $: _Datastore.Set('TeirListData', TeirListData);
    const UpdateDataStore = () => TeirListData = TeirListData;

    const _Settings = GlobalSettings.GetInstance(componentID);
    const SpecificSeparator = _Settings.RegisterSetting(
        'Specific Separator',
        'The separator to use when copying a specific teir\nThe text where other teirs would be normally',
        '',
        SettingTypes.Type.Text
    );

    type YoutubeMember = {
        "Member": string;
        "Link to profile": string;
        "Current level": string;
        "Total time on level (months)": string;
        "Total time as member (months)": string;
        "Last update": string;
        "Last update timestamp": string;
    }

    const InfoText: string =
`How to format the incoming data:
{Member}
{Link to profile}
{Current level}
{Total time on level (months)}
{Total time as member (months)}
{Last update}
{Last update timestamp}

Example:
{Member} Has been a member for {Total time as member (months)} months`;

    function ConvertCSVToObject(CSVInput: string): YoutubeMember[] {
        const Lines = CSVInput.split('\n');     

        let members: YoutubeMember[] = [];
        const headers: string[] = Lines[0].split(',');

        for (var i = 1; i < Lines.length; i++) {
            const data = Lines[i].split(',');

            let member: any = {};

            for (var j = 0; j < data.length; j++) {
                member[headers[j].trim()] = data[j].trim();
            }

            if (!member["Member"]) continue;

            members.push(member);
        }

        return members;
    }

    function FormatString(template: string, Member: YoutubeMember): string {
        for (const [key, value] of Object.entries(Member)) {
            template = template.replace(`{${key}}`, value);
        }
        return template;
    }

    function GetYoutubeMebers(): YoutubeMember[] {
        const CSVFiles = Common.IO.Dialog({
            title: "Select CSV file", 
            defaultPath: process.env.USERPROFILE + "/Downloads",
            filters: [
                { name: 'CSV', extensions: ['csv'] }
            ],
            properties: ['openFile']
        });

        if (CSVFiles.length <= 0) return;

        const CSVFileData: string = Common.IO.ReadFile(CSVFiles[0]);
        const CSVData: YoutubeMember[] = ConvertCSVToObject(CSVFileData);

        return CSVData;
    }

    function CopyToClipboard(text: string) {
        console.log(text);
        const Clipboard = Common.Electron.GetClipboard();
        Clipboard.writeText(text);
    }

    function CSVButton() {
        const CSVData = GetYoutubeMebers();

        let output: string = "";
        CSVData.forEach((member: YoutubeMember) => {
            const teir = TeirListData[member["Current level"]];
            if (!teir) return;

            output += `${FormatString(teir, member)}\n`;
        });
        
        CopyToClipboard(output)
    }

    function CopySpecificTeir(teirName: string) {
        const CSVData = GetYoutubeMebers();

        let output: string = "";
        CSVData.forEach((member: YoutubeMember) => {
            const teir = TeirListData[member["Current level"]];
            if (!teir) return;

            if (member["Current level"] == teirName) {
                output += `${FormatString(teir, member)}\n`;
            } else {
                output += `${SpecificSeparator}\n`;
            }
        });

        CopyToClipboard(output)
    }

    function AddNewTeir() {
        TeirListData[""] = "";
        UpdateDataStore();
    }

    function RemoveTeir(teirName: string) {
        delete TeirListData[teirName];
        UpdateDataStore();
    }

    let TeirTemplateElements: {[key: string]: HTMLInputElement} = {};
    function UpdateTeirTemplate(teirName: string) {
        TeirListData[teirName] = TeirTemplateElements[teirName].value;
        UpdateDataStore();
    }

    let TeirNameElements: {[key: string]: HTMLInputElement} = {};
    function UpdateTeirName(teirName: string) {
        TeirListData[TeirNameElements[teirName].value] = TeirListData[teirName];
        delete TeirListData[teirName];

        TeirTemplateElements[TeirNameElements[teirName].value] = TeirTemplateElements[teirName];
        delete TeirTemplateElements[teirName];

        UpdateDataStore();
    }

    function UpdateInputsLookups() {
        for (const [teirName, teirTemplate] of Object.entries(TeirListData)) {
            TeirTemplateElements[teirName].value = teirTemplate;
        }

        for (const [teirName, _teirTemplate] of Object.entries(TeirListData)) {
            TeirNameElements[teirName].value = teirName;
        }
    }

</script>


<main id={componentID}>
    <h1>Import YT Members</h1>
    <div class="mainHeader">
        <button on:click={CSVButton}>Copy To Clipboard</button>
        <button on:click={AddNewTeir}>+ Add New Teir</button>

        <img src="../src/assets/Info.svg" alt="Info" id=infoImg
            on:mouseenter={() => {document.getElementById("infoText").style.display = "block"}}
            on:mouseleave={() => {document.getElementById("infoText").style.display = "none"}}
        >
        <p id=infoText>{InfoText}</p>
    </div>

    <div class="teirList">
        {#each Object.entries(TeirListData) as [teirName, _teirTemplate]}
            <div class="teir" transition:slide|local>

                <div class="teirHeader">
                    <input type="text" bind:this={TeirNameElements[teirName]} on:change={() => {UpdateTeirName(teirName)}} class=nameInput placeholder="Teir Name">
                    <div>
                        <button on:click={() => {CopySpecificTeir(teirName)}}>Copy</button>
                        <button on:click={() => {RemoveTeir(teirName)}}>Remove</button>
                    </div>
                </div>

                <div class="teirBody">
                    <input type="text" bind:this={TeirTemplateElements[teirName]} on:change={() => {UpdateTeirTemplate(teirName)}} class=templateInput placeholder="Template String">
                </div>
            </div>

            <div class="SplitWrapper">
                <div class="split"></div>
            </div>
        {/each}
    </div>
</main>


<style lang="scss">
    @use '../src/scss/Colors';

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
    }

    h1 {
        margin: 0.3rem;
        opacity: 0.5;

        font-size: 1.5rem;
    }

    .mainHeader {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;

        & > * {
            margin-left: 0.5rem;
        }

        margin-bottom: 0.5rem;
    }

    #infoImg {
        width: 1.5rem;
        height: 1.5rem;

        cursor: pointer;
            
        filter: invert(Colors.$IconInvertPercentage);

        &:hover {
            filter: invert(Colors.$IconInvertPercentage - 50%);
        }

        transition: filter 0.2s;
    }

    #infoText {
        display: none;

        position: absolute;
        top: 3rem;
        left: -1rem;

        width: 20rem;
        height: 13rem;

        padding: 1rem;

        background-color: Colors.$BackgroundColor;

        border-radius: 0.25rem;

        filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.188));

        font-size: 1rem;
        white-space: pre-line;
    }

    .teirList {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        width: 95%;
        border-radius: 0.4rem;

        & > * {
            margin: 0.25rem;
        }
        margin-bottom: 0.5rem;

        background-color: Colors.$BackgroundColor;
    }

    .teir {
        width: 95%;
    }

    .teirHeader {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        margin-bottom: 0.25rem;
    }

    .nameInput {
        max-width: 6rem;
    }

    .templateInput {
        width: 90%;
    }

    input {
        margin-left: 0.5rem;

        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.5rem;

        transition: background-color 0.1s ease-in-out;

        &:focus, &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }

    button {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.5rem;

        min-width: 3rem;

        cursor: pointer;

        transition: background-color 0.1s ease-in-out;

        &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }

    .SplitWrapper {
        width: 95%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .split {
        width: 95%;
        height: 0.25rem;
        border-radius: 0.1rem;

        background-color: Colors.$ColumnColor;
    }
</style>