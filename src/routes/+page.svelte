<script lang="ts">
    import { goto } from "$app/navigation";
    import ScanIcon from "$lib/assets/scan.png";
    import GameList from "$lib/components/GameList.svelte";
    import { collectionList } from "$lib/stores";
    import type { GameObject } from "$lib/types";

    let collectionArray: Array<GameObject> = []

    collectionList.subscribe((list) => {
        collectionArray = list
    })
</script>

<main>
	<div class="game-list">
		<GameList games={collectionArray} />
	</div>
    <div class="bottom-nav">
        <button class="btn-scan" onclick={() => {
            goto("/scanner")
        }}>
            <img class="icon-scan" src={ScanIcon} alt="">
            <p class="label-scan">Scan Game</p>
        </button>
    </div>
</main>

<style>
    .bottom-nav {
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
        padding: 20px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .icon-scan {
        width: 30px;
        height: 30px;
        object-fit: contain;
        vertical-align: middle;
    }

    .btn-scan {
        padding: 12px;
        /* padding-left: 16px;
        padding-right: 16px; */
        border: none;
        border-radius: 20px;
        background-color: rgb(255, 255, 255);
        transition: 0.04s;
        display: flex;
        gap: 15px;
        color: black;
    }

    .btn-scan:active {
        scale: 95%;
        background-color: rgb(189, 189, 189);
    }

    .label-scan {
        margin: 0;
        font-size: 1rem;
        padding: 5px;
        padding-left: 0px;
        font-weight: 800;
    }

	.game-list {
		display: flex;
		flex-direction: column;
	}
</style>