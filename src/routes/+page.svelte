<script lang="ts">
    import GameList from "$lib/components/GameList.svelte";
    import { collectionList, displayStyle } from "$lib/stores";
    import type { GameObject } from "$lib/types";

    let collectionArray: Array<GameObject> = $state([])
    let dispStyle: number = $state(0)

    collectionList.subscribe((list) => {
        collectionArray = list
    })

    displayStyle.subscribe((n) => {
        dispStyle = n
    })
</script>

<main>
	<div class="game-list">
		<GameList games={collectionArray} controls={true} />
	</div>
</main>

<style>
	.game-list {
		display: flex;
		flex-direction: column;
	}
</style>