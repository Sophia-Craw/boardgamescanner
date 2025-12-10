<script lang="ts">
    const { games } = $props();

    import RightArrow from "$lib/assets/right-arrow.png";
    import { wishlistList } from "$lib/stores";
    import type { GameObject } from "$lib/types";
    import { onMount } from "svelte";

    let wishlist: Array<GameObject> = $state([]);

    $effect(() => {
        wishlistList.subscribe((list) => {
            wishlist = list
        })
    })

    let view: string = $state("collection");
</script>

<main>
    <div class="tabs">
        <button
            class={view == "collection" ? "tab-select" : "tab"}
            onclick={() => {
                view = "collection";
            }}>Collection</button
        >
        <button
            class={view == "wishlist" ? "tab-select" : "tab"}
            onclick={() => {
                view = "wishlist";
            }}>Wishlist</button
        >
    </div>
    {#each view === "collection" ? games : wishlist as game}
        <a href="/result/{game.upc}">
            <div class="game">
                <div class="info-wrapper">
                    <div class="thumbnail-wrapper">
                        <img
                            class="thumbnail"
                            src={game.bgg_info[0].image_url}
                            alt=""
                        />
                    </div>
                    <div class="game-info">
                        <p class="title">{game.name}</p>
                        <p class="year">{game.bgg_info[0].published}</p>
                    </div>
                </div>
                <div class="arrow-wrapper">
                    <img class="icon" src={RightArrow} alt="" />
                </div>
            </div>
        </a>
    {/each}
    {#if games.length > 0}{:else}
        <p>No games yet.</p>
    {/if}
</main>

<style>
    .game {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 12px;
        border-bottom-style: solid;
        border-width: 1px;
        border-color: rgba(255, 255, 255, 0.088);
        transition: 0.08s;
    }

    .tabs {
        display: flex;
        gap: 12px;
        padding: 10px;
    }

    .tab {
        padding: 10px;
        padding-left: 10px;
        padding-right: 10px;
        border: none;
        border-radius: 12px;
        background-color: rgb(24, 24, 24);
        color: white;
        font-family: sans-serif;
        font-weight: 800;
    }

    .tab-select {
        padding: 5px;
        padding-left: 10px;
        padding-right: 10px;
        border: none;
        border-radius: 12px;
        background-color: rgb(255, 255, 255);
        color: rgb(0, 0, 0);
        font-family: sans-serif;
        font-weight: 800;
    }

    .tab:active {
        scale: 95%;
    }

    .game:active {
        background-color: rgb(37, 37, 37);
    }

    .info-wrapper {
        display: flex;
        gap: 12px;
    }

    .game-info {
        display: flex;
        flex-direction: column;
        padding: 4px;
    }

    .thumbnail {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        border-radius: 12px;
    }

    p {
        margin: 0;
    }

    .title {
        color: white;
        font-family: sans-serif;
        font-size: 1rem;
        font-weight: 800;
    }

    .year {
        color: rgba(255, 255, 255, 0.27);
        font-family: sans-serif;
        font-size: 1rem;
    }

    .icon {
        width: 12px;
        height: 12px;
        filter: invert() opacity(50%);
        position: relative;
        top: 14px;
    }

    a {
        text-decoration: none;
    }
</style>
