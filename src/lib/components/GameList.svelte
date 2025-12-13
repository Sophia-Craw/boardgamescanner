<script lang="ts">
    const { games, controls } = $props();

    import RightArrow from "$lib/assets/right-arrow.png";
    import { wishlistList } from "$lib/stores";
    import type { GameObject } from "$lib/types";
    import SearchIcon from "$lib/assets/magnifying-glass.png";
    import { page } from "$app/state";

    let wishlist: Array<GameObject> = $state([]);
    let searchTerm: string = $state("");

    $effect(() => {
        wishlistList.subscribe((list) => {
            wishlist = list;
        });
    });

    let view: string = $state("collection");
</script>

<main>
    {#if controls}
        <div class="control-group">
            <div class="search-bar">
                <img class="search-icon" src={SearchIcon} alt="" />
                <input
                    type="text"
                    class="txt-search"
                    placeholder="Search..."
                    bind:value={searchTerm}
                />
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
    {/if}
    {#each view === "collection" ? games : wishlist as game, index}
        {#if game.name === searchTerm || game.name.includes(searchTerm) || game.published === parseInt(searchTerm)}
            <a href={`/result?upc=${!controls ? page.url.searchParams.get("upc") : game.upc}&index=${!controls ? index : game.index}`}>
                <!-- <p>{game}</p> -->
                <div class="game">
                    <div class="info-wrapper">
                        <div class="thumbnail-wrapper">
                            <img
                                class="thumbnail"
                                src={game.image_url}
                                alt=""
                            />
                        </div>
                        <div class="game-info">
                            <p class="title">{game.name}</p>
                            <p class="year">
                                {game.published}
                            </p>
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
        border-color: var(--color-mid);
        transition: 0.08s;
        color: var(--color-accent);
    }

    .search-bar {
        display: flex;
        gap: 12px;
        padding: 10px;
        background-color: var(--color-mid);
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
        background-color: var(--color-mid);
        color: var(--color-accent);
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
        background-color: var(--color-accent);
        color: var(--color-primary);
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
        opacity: 60%;
    }

    .info-wrapper {
        display: flex;
        gap: 12px;
        color: var(--color-accent);
    }

    .game-info {
        display: flex;
        flex-direction: column;
        padding: 4px;
        text-align: left;
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
        color: var(--color-accent);
        font-family: sans-serif;
        font-size: 1rem;
        font-weight: 800;
    }

    .year {
        color: var(--color-sub);
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

    @media (prefers-color-scheme: light) {
        .search-icon {
            filter: invert(0);
        }
    }

    .txt-search {
        background-color: transparent;
        border: none;
        outline: none;
        color: var(--color-accent);
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
