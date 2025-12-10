<script lang="ts">
    import { goto } from "$app/navigation";
    import { navigating, page } from "$app/state";
    import GameList from "$lib/components/GameList.svelte";
    import { collectionList } from "$lib/stores";
    import type { GameObject } from "$lib/types";

    let collectionArray: Array<GameObject> = [];

    collectionList.subscribe((list) => {
        collectionArray = list;
    });
</script>

<main>
    <div class="game-list">
        <GameList games={collectionArray} />
    </div>
</main>

<style>
    .game-list {
        display: flex;
        flex-direction: column;
    }
</style>
