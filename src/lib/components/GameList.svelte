<script lang="ts">
    const { games, controls } = $props();

    import RightArrow from "$lib/assets/right-arrow.png";
    import { displayStyle, wishlistList } from "$lib/stores";
    import type { GameObject } from "$lib/types";
    import SearchIcon from "$lib/assets/magnifying-glass.png";
    import { page } from "$app/state";
    import ListIcon from "$lib/assets/view-list.png";
    import IconsIcon from "$lib/assets/menu.png";
    import FilterIcon from "$lib/assets/filter.png";
    import StarIcon from "$lib/assets/star.png";
    import { fly } from "svelte/transition";

    let wishlist: Array<GameObject> = $state([]);
    let searchTerm: string = $state("");

    let dispStyle: number = $state(0);
    let filterApplied: boolean = $state(false);
    let filterPickerOpen: boolean = $state(false);
    let starsFiltered = $state(0);

    let view: string = $state("collection");

    $effect(() => {
        wishlistList.subscribe((list) => {
            wishlist = list;
        });

        displayStyle.subscribe((n) => {
            dispStyle = n;
        });

        if (localStorage) {
            displayStyle.set(parseInt(localStorage.getItem("lastView") || "0"));
            starsFiltered = parseInt(localStorage.getItem("starFilter") || "0");
            view = localStorage.getItem("view") || "collection"
        }

        if (starsFiltered > 0) {
            filterApplied = true
        }
    });
</script>

{#if filterPickerOpen}
    <div
        class="dialog"
        in:fly={{ y: 200, duration: 200 }}
        out:fly={{ y: 200, duration: 200 }}
    >
        <div class="dialog-heading">
            <h3 class="filter-head">Filter</h3>
        </div>
        <div class="filter-items">
            <h2 class="filter-sect-head">Filter by stars:</h2>
        </div>
        <div class="stars-wrapper">
            {#each [0, 1, 2, 3, 4, 5] as num, index}
                {#if index !== 0}
                    <button
                        class={starsFiltered === num
                            ? "stars-selected"
                            : "stars"}
                        onclick={() => {
                            if (starsFiltered == num) {
                                starsFiltered = 0;
                                filterApplied = false;
                                if (localStorage) {
                                    localStorage.setItem("starFilter", "0")
                                }
                                return;
                            }
                            starsFiltered = num;
                            filterApplied = false;
                            if (localStorage) {
                                localStorage.setItem("starFilter", starsFiltered.toString())
                            }
                        }}
                    >
                        {#each Array(index) as _, idx}
                            <img class={starsFiltered === num ? "star-icon" : "star-icon-passive"} src={StarIcon} alt="" />
                        {/each}
                    </button>
                {/if}
            {/each}
        </div>
        <div class="dialog-action">
            <button
                class="btn-dialog-close"
                onclick={() => {
                    filterPickerOpen = false;
                }}
            >
                Close
            </button>
        </div>
    </div>
{/if}

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
                            localStorage.setItem("view", "collection")
                        }}>Collection</button
                    >
                    <button
                        class={view == "wishlist" ? "tab-select" : "tab"}
                        onclick={() => {
                            view = "wishlist";
                            localStorage.setItem("view", "wishlist")
                        }}>Wishlist</button
                    >
                </div>
                <div class="displayview-tab-group">
                    <button
                        aria-label="filter"
                        class={filterApplied ? "tab-select" : "tab"}
                        onclick={() => {
                            filterPickerOpen = true;
                        }}
                    >
                        <img
                            class={filterApplied
                                ? "view-icon-select"
                                : "view-icon"}
                            src={FilterIcon}
                            alt=""
                        />
                    </button>
                    <button
                        aria-label="list"
                        class={dispStyle === 0 ? "tab-select" : "tab"}
                        onclick={() => {
                            displayStyle.set(0);
                            if (localStorage) {
                                localStorage.setItem("lastView", "0");
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
                                localStorage.setItem("lastView", "1");
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
            {#if game.name === searchTerm || game.name.includes(searchTerm)}
                {#if starsFiltered > 0 && game.stars && game.stars === starsFiltered || starsFiltered === 0}
                    <a
                        href={`/result?upc=${!controls ? page.url.searchParams.get("upc") : game.upc}&index=${!controls ? index : game.index}`}
                    >
                        <div
                            class={controls && dispStyle === 1
                                ? "game-big"
                                : "game"}
                        >
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
                                        {game.published == 0
                                            ? "No Year"
                                            : game.published}
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
            {/if}
        {/each}
    </div>
</main>

<style>
    main {
        padding-bottom: 40px;
    }

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
        object-fit: cover;
        object-position: top;
    }

    .thumbnail-big {
        width: 45dvw;
        height: 45dvw;
        border-radius: 12px;
        border-radius: 12px;
        transition: 0.08s;
        object-fit: cover;
        object-position: top;
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
        -webkit-tap-highlight-color: transparent;
    }

    .dialog-heading {
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        padding: 20px;
        padding-left: 12px;
        border-bottom-style: solid;
        border-width: 1px;
        border-color: var(--color-sub);
        background-color: var(--color-mid);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: 9;
    }

    .dialog-action {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px;
        padding-left: 12px;
        border-top-style: solid;
        border-width: 1px;
        border-color: var(--color-sub);
        background-color: var(--color-midy);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: 9;
    }

    .dialog {
        background-color: var(--color-primary);
        outline: none;
        border-radius: 20px;
        z-index: 8;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60dvh;
        padding: 0;
        padding-bottom: 70px;
    }

    .dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.209);
    }

    .btn-dialog-close {
        text-align: center;
        width: 100%;
        font-size: 1rem;
        padding: 12px;
        border: none;
        border-radius: 12px;
        font-weight: 800;
        transition: 0.08s;
    }

    .btn-dialog-close:active {
        scale: 95%;
        opacity: 60%;
    }

    .filter-items {
        display: flex;
        flex-direction: column;
        padding: 12px;
    }

    .filter-head {
        color: var(--color-accent);
        font-family: sans-serif;
        font-weight: 800;
        font-size: 1.6rem;
        margin: 0;
    }

    .filter-sect-head {
        font-size: 1.2rem;
        color: var(--color-accent);
        font-family: sans-serif;
        margin: 0;
    }

    .stars-wrapper {
        display: flex;
        flex-direction: column;
    }

    .stars {
        display: flex;
        gap: 5px;
        padding: 5px;
        border: none;
        background-color: transparent;
        transition: 0.08s;
        padding: 12px;
    }

    .stars:active {
        background-color: var(--color-sub);
    }

    .stars-selected {
        display: flex;
        gap: 5px;
        padding: 5px;
        border: none;
        background-color: var(--color-mid);
        transition: 0.08s;
        padding: 12px;
    }

    .star-icon {
        width: 30px;
        height: 30px;
        filter: invert();
    }

    .star-icon-passive {
        width: 30px;
        height: 30px;
        filter: invert() opacity(60%);
    }

    @media (prefers-color-scheme: light) {
        .star-icon {
            filter: invert(0);
        }

        .star-icon-passive {
            filter: invert(0) opacity(60%);
        }
    }
</style>
