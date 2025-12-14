<script lang="ts">
    const { games, controls } = $props();

    import RightArrow from "$lib/assets/right-arrow.png";
    import { displayStyle, wishlistList } from "$lib/stores";
    import type { GameObject } from "$lib/types";
    import SearchIcon from "$lib/assets/magnifying-glass.png";
    import { page } from "$app/state";
    import ListIcon from "$lib/assets/view-list.png";
    import IconsIcon from "$lib/assets/menu.png";
    

    let wishlist: Array<GameObject> = $state([]);
    let searchTerm: string = $state("");

    let dispStyle: number = $state(0);

    $effect(() => {
        wishlistList.subscribe((list) => {
            wishlist = list;
        });

        displayStyle.subscribe((n) => {
            dispStyle = n;
        });

        if (localStorage) {
            displayStyle.set(parseInt(localStorage.getItem("lastView") || "0"))
        }
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
                <div class="category-tab-group">
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
                <div class="displayview-tab-group">
                    <button
                        aria-label="list"
                        class={dispStyle === 0 ? "tab-select" : "tab"}
                        onclick={() => {
                            displayStyle.set(0);
                            if (localStorage) {
                                localStorage.setItem("lastView", "0")
                            }
                        }}
                    >
                        <img
                            class={dispStyle === 0
                                ? "view-icon-select"
                                : "view-icon"}
                            src={ListIcon}
                            alt=""
                        />
                    </button>
                    <button
                        aria-label="icons"
                        class={dispStyle === 1 ? "tab-select" : "tab"}
                        onclick={() => {
                            displayStyle.set(1);
                            if (localStorage) {
                                localStorage.setItem("lastView", "1")
                            }
                        }}
                    >
                        <img
                            class={dispStyle === 1
                                ? "view-icon-select"
                                : "view-icon"}
                            src={IconsIcon}
                            alt=""
                        />
                    </button>
                </div>
            </div>
        </div>
    {/if}
    <div class={controls && dispStyle === 1 ? "games-large" : "games"}>
        
        {#each view === "collection" ? games : wishlist as game, index}
            {#if game.name === searchTerm || game.name.includes(searchTerm) || game.published === parseInt(searchTerm)}
                <a
                    href={`/result?upc=${!controls ? page.url.searchParams.get("upc") : game.upc}&index=${!controls ? index : game.index}`}
                >
                    <!-- <p>{game}</p> -->
                    <div class={controls && dispStyle === 1 ? "game-big" : "game"}>
                        <div class="info-wrapper">
                            <div class="thumbnail-wrapper">
                                <img
                                    class={controls && dispStyle === 1
                                        ? "thumbnail-big"
                                        : "thumbnail"}
                                    src={game.image_url}
                                    alt=""
                                />
                            </div>
                            <div
                                class={controls && dispStyle === 1
                                    ? "game-info-hidden"
                                    : "game-info"}
                            >
                                <p class="title">{game.name}</p>
                                <p class="year">
                                    {game.published}
                                </p>
                            </div>
                        </div>
                        <div
                            class={controls && dispStyle === 1
                                ? "arrow-wrapper-hidden"
                                : "arrow-wrapper"}
                        >
                            <img class="icon" src={RightArrow} alt="" />
                        </div>
                    </div>
                </a>
            {/if}
        {/each}
    </div>
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
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
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

    .game-big {
        display: flex;
    }

    .games {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        max-height: 58dvh;
        padding-bottom: 200px;
        mask: linear-gradient(white, white, white, white, transparent);
    }

    .games-large {
        display: flex;
        gap: 12px;
        padding: 12px;
        flex-wrap: wrap;
        overflow-y: scroll;
        max-height: 58dvh;
        padding-bottom: 200px;
        mask: linear-gradient(white, white, white, white, transparent);
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
        justify-content: space-between;
    }

    .category-tab-group {
        display: flex;
        gap: 12px;
    }

    .displayview-tab-group {
        display: flex;
        gap: 5px;
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

    .game-info-hidden {
        display: none;
    }

    .arrow-wrapper-hidden {
        display: none;
    }

    .thumbnail {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        border-radius: 12px;
    }

    .thumbnail-big {
        width: 45dvw;
        height: 45dvw;
        border-radius: 12px;
        border-radius: 12px;
        transition: 0.08s;
    }

    .thumbnail-big:active {
        scale: 95%;
        opacity: 60%;
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

    .view-icon {
        width: 16px;
        height: 16px;
        filter: invert();
        position: relative;
    }

    .view-icon-select {
        width: 16px;
        height: 16px;
        filter: invert(0);
        position: relative;
    }

    @media (prefers-color-scheme: light) {
        .view-icon {
            filter: invert(0);
        }
        
        .view-icon-select {
            filter: invert();
        }
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
