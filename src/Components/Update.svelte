<script lang="ts">
    import { onMount } from "svelte";
    import { Updater } from "../Lib/Updater";

    let showPopup: boolean = false;
    let updateInfo: Updater.UpdateReturn;

    onMount(async () => {
        updateInfo = await Updater.CheckForUpdate();
        showPopup = updateInfo.updateAvailable;
    });

</script>

<main>
    {#if showPopup}
        <div class="popup">
            <div class="popup-content">
                <h1>Update Available</h1>

                <p>An update is available! Would you like to update now?</p>
                <p><i>New Version: {updateInfo.remoteVersion} (Current: {updateInfo.localVersion})</i></p>

                <div class="buttons">
                    <button on:click={Updater.DownloadUpdate}>Yes</button>
                    <button on:click={() => { showPopup = false }}>No</button>
                </div>
            </div>
        </div>
    {/if}
</main>

<style lang="scss">
    @use '../scss/Colors';

    .popup {
        position: fixed;

        top: 0;
        left: 0;

        width: 100vw;
        height: 100vh;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgba(0, 0, 0, 0.5);

        color: Colors.$TextColor;
    }

    .popup-content {
        width: 30rem;
        height: 20rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: Colors.$ColumnColor;

        border-radius: 1rem;
    }

    .buttons {
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        width: 100%;
    }

    button {
        padding: 0.5rem 1rem;

        border-radius: 0.5rem;
        border: solid 0.2rem darken(Colors.$ModuleColor, 5%);
        
        outline: none;

        background-color: Colors.$ModuleColor;

        color: white;
        font-size: 1.5rem;

        cursor: pointer;

        &:hover {
            background-color: darken(Colors.$ColumnColor, 3%);
        }

        transition: background-color 0.2s;
    }
</style>