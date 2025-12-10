<script lang="ts">
    const { games } = $props();

    import RightArrow from "$lib/assets/right-arrow.png";
    import { wishlistList } from "$lib/stores";
    import type { GameObject } from "$lib/types";
    import SearchIcon from "$lib/assets/magnifying-glass.png"

    let wishlist: Array<GameObject> = $state([]);
    let searchTerm: string = $state("");

    $effect(() => {
        wishlistList.subscribe((list) => {
            wishlist = list
        })
    })

    let view: string = $state("collection");
</script>

<main>
    <div class="control-group">
        <div class="search-bar">
            <img class="search-icon" src={SearchIcon} alt="">
            <input type="text" class="txt-search" placeholder="Search..." bind:value={searchTerm}>
        </div>
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
    </div>
    {#each view === "collection" ? games : wishlist as game}
        {#if game.name.includes(searchTerm) || game.published.toString() === searchTerm || game.name === searchTerm}
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
        {/if}
    {/each}
    {#if games.length > 0}{:else}
        <p>No games yet.</p>
    {/if}
</main>

<style>
    .control-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
    }

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

    .search-bar {
        display: flex;
        gap: 12px;
        padding: 10px;
        background-color: rgb(27, 27, 27);
        border-radius: 12px;
    }

    .tabs {
        display: flex;
        gap: 12px;
    }

    .tab {
        padding: 10px;
        padding-left: 16px;
        padding-right: 16px;
        border: none;
        border-radius: 12px;
        background-color: rgb(27, 27, 27);
        color: white;
        font-family: sans-serif;
        font-weight: 800;
        transition: 0.08s;
    }

    .tab:active {
        scale: 95%;
        opacity: 60%;
    }

    .tab-select {
        padding: 10px;
        padding-left: 16px;
        padding-right: 16px;
        border: none;
        border-radius: 12px;
        background-color: rgb(255, 255, 255);
        color: rgb(0, 0, 0);
        font-family: sans-serif;
        font-weight: 800;
        transition: 0.08s;
    }

    .tab-select:active {
        scale: 95%;
        opacity: 60%;
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

    .search-icon {
        width: 12px;
        height: 12px;
        filter: invert() opacity(50%);
        position: relative;
        top: 3px;
        transition: 0.08s;
    }

    .txt-search {
        background-color: transparent;
        border: none;
        outline: none;
        color: white;
        width: 100%;
    }

    .search-bar {
        transition: 0.08s;
    }

    .search-bar:has(.txt-search:focus) {
        outline-style: solid;
        outline-width: 4px;
        outline-color: rgba(138, 189, 255, 0.473);
    }

    a {
        text-decoration: none;
    }
</style>
