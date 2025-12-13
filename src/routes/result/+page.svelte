<script lang="ts">
    import { goto } from "$app/navigation";

    let data: GameObject = $state({
        name: "",
        published: 0,
        upc: 0,
        index: 0,
        bgg_info: [
            {
                name: "",
                published: 0,
                id: 0,
                image_url: "",
                index: 0,
                upc: 0,
            },
        ],
    });

    import HeartIcon from "$lib/assets/heart.png";
    import HeartIconOutline from "$lib/assets/heart_outline.png";
    import AddIcon from "$lib/assets/plus.png";
    import ScanIcon from "$lib/assets/scan.png";
    import CheckIcon from "$lib/assets/check.png";
    import type { GameObject, SingleGame } from "$lib/types.js";
    import { collectionList, wishlistList } from "$lib/stores.js";
    import { page } from "$app/state";
    import GameList from "$lib/components/GameList.svelte";
    import { fly } from "svelte/transition";

    let isOwned: boolean = $state(false);
    let isWishlist: boolean = $state(false);

    let loadingDisable: boolean = $state(true);
    let index: number = $state(0);

    let dialogOpen = $state(false);


    $effect(() => {

        if (data.bgg_info[0].image_url === "") {
            fetch(
                "https://api.gameupc.com/test/upc/" +
                    page.url.searchParams.get("upc"),
                {
                    headers: {
                        "X-Api-Key": "test_test_test_test_test",
                    },
                },
            ).then((resp) => {
                const gameData = resp.json();

                gameData.then((g) => {
                    data = g as GameObject;
                });
            });
        }

        if (!data || data.bgg_info[0].image_url === "") {
            return;
        }

        isOwned = false;
        isWishlist = false;
        dialogOpen = false;

        index = parseInt(page.url.searchParams.get("index")!) || 0;

        let storage: Array<SingleGame> =
            JSON.parse(localStorage.getItem("collection") || "[]") || [];
        let wishlistStorage: Array<SingleGame> =
            JSON.parse(localStorage.getItem("wishlist") || "[]") || [];

        if (localStorage) {
            wishlistStorage.forEach((game) => {
                if (game.id === data.bgg_info[index].id) {
                    isWishlist = true;
                }
            });

            storage.forEach((game) => {
                if (game.id === data.bgg_info[index].id) {
                    isOwned = true;
                    loadingDisable = false;
                }
                loadingDisable = false;
            });
            loadingDisable = false;
        }
    });

    const own = () => {
        if (!isOwned) {
            if (!localStorage.getItem("collection"))
                localStorage.setItem("collection", JSON.stringify([]));

            let storage: Array<SingleGame> =
                JSON.parse(localStorage.getItem("collection") || "[]") || [];

            let gameObject = data.bgg_info[index];
            gameObject.index = index;
            gameObject.upc = data.upc;
            storage.push(gameObject);

            localStorage.setItem("collection", JSON.stringify(storage));

            let wishStorage: Array<SingleGame> =
                JSON.parse(localStorage.getItem("wishlist") || "[]") || [];

            let filteredStorage = wishStorage.filter((game) => {
                return game.id !== data.bgg_info[index].id ? game : null;
            });

            localStorage.setItem("wishlist", JSON.stringify(filteredStorage));
            wishlistList.set(
                JSON.parse(localStorage.getItem("wishlist") || "[]"),
            );
            isWishlist = false;
            collectionList.set(
                JSON.parse(localStorage.getItem("collection") || "[]"),
            );
            isOwned = true;
        } else {
            if (localStorage.getItem("collection")) {
                let storage: Array<SingleGame> =
                    JSON.parse(localStorage.getItem("collection") || "[]") ||
                    [];

                let filteredStorage = storage.filter((game) => {
                    return game.id !== data.bgg_info[index].id ? game : null;
                });

                localStorage.setItem(
                    "collection",
                    JSON.stringify(filteredStorage),
                );
                collectionList.set(
                    JSON.parse(localStorage.getItem("collection") || "[]"),
                );
                isOwned = false;
            }
        }
    };

    const wishlist = () => {
        if (!isWishlist) {
            if (!localStorage.getItem("wishlist"))
                localStorage.setItem("wishlist", JSON.stringify([]));

            let storage: Array<SingleGame> =
                JSON.parse(localStorage.getItem("wishlist") || "[]") || [];

            let gameObject = data.bgg_info[index];
            gameObject.index = index;
            gameObject.upc = data.upc;
            storage.push(gameObject);

            localStorage.setItem("wishlist", JSON.stringify(storage));
            wishlistList.set(
                JSON.parse(localStorage.getItem("wishlist") || "[]"),
            );
            isWishlist = true;
        } else {
            if (localStorage.getItem("wishlist")) {
                let storage: Array<SingleGame> =
                    JSON.parse(localStorage.getItem("wishlist") || "[]") || [];

                let filteredStorage = storage.filter((game) => {
                    return game.id !== data.bgg_info[index].id ? game : null;
                });

                localStorage.setItem(
                    "wishlist",
                    JSON.stringify(filteredStorage),
                );
                wishlistList.set(
                    JSON.parse(localStorage.getItem("wishlist") || "[]"),
                );
                isWishlist = false;
            }
        }
    };
</script>

<main>
    {#if dialogOpen}
        <div
            class="dialog"
            in:fly={{ y: 200, duration: 200 }}
            out:fly={{ y: 200, duration: 200 }}
        >
            {#if data.name && data.bgg_info[index].image_url !== ""}
                <!-- <GameList games={data.bgg_info.length > 0 ? data.bgg_info : []} controls={false} />   -->
                <div class="dialog-heading">
                    <h3>Select your game</h3>
                </div>
                <GameList games={data.bgg_info} controls={false} />
                <div class="dialog-action">
                    <button
                        onclick={() => {
                            dialogOpen = false;
                        }}
                    >
                        Close
                    </button>
                </div>
            {/if}
        </div>
    {/if}

    {#if data.bgg_info[index].image_url  === ""}
        <div class="skeleton"></div>
    {:else}
        <img class="game-image" src={data.bgg_info[index].image_url || ""} alt="" />
    {/if}

    <h2><b>{data.bgg_info[index].name || ""}</b></h2>
    <p>
        <b
            >{data.bgg_info[index].published == 0
                ? "--"
                : data.bgg_info[index].published || 0}</b
        >
    </p>
    <div class="options">
        <button
            disabled={loadingDisable}
            class={isOwned ? "btn-owned" : ""}
            onclick={own}
        >
            <img class="icon" src={isOwned ? CheckIcon : AddIcon} alt="" />
            I Own This
        </button>
        <button
            disabled={loadingDisable || isOwned ? true : false}
            class={isWishlist ? "btn-wishlist" : ""}
            onclick={wishlist}
        >
            <img
                class="icon"
                src={isWishlist ? HeartIcon : HeartIconOutline}
                alt=""
            />
            I Want This
        </button>
    </div>
    <button
        class="btn-alt"
        onclick={() => {
            goto("/scanner");
        }}
    >
        <img class="icon-alt" src={ScanIcon} alt="" />
        Rescan
    </button>
    <button
        onclick={() => {
            goto("/");
        }}
    >
        <img class="icon" src={CheckIcon} alt="" />
        Done
    </button>
    <button
        class="btn-alt"
        onclick={() => {
            dialogOpen = true;
        }}
    >
        Not the right game?
    </button>
</main>

<style>
    main {
        padding: 40px;
        padding-top: 60px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }

    .game-image {
        max-width: 81dvw;
        max-height: 40dvh;
        border-radius: 20px;
        margin-left: auto;
        margin-right: auto;
    }

    h2 {
        font-family: sans-serif;
        color: var(--color-accent);
        margin: 0;
        font-size: 2rem;
    }

    h3 {
        font-family: sans-serif;
        color: var(--color-accent);
        margin: 0;
        font-size: 1.3rem;
        text-align: left;
    }

    p {
        margin: 0;
        font-family: sans-serif;
        color: rgb(143, 143, 143);
        font-size: 1.5rem;
        font-weight: 800;
    }

    .options {
        display: flex;
        gap: 12px;
        margin-top: 50px;
        justify-content: center;
    }

    button {
        display: flex;
        justify-content: center;
        border: none;
        background-color: var(--color-buttons);
        font-weight: 700;
        border-radius: 17px;
        transition: 0.08s;
        width: 100%;
        padding: 15px;
        font-size: 1rem;
        gap: 12px;
    }

    button:active {
        scale: 95%;
        opacity: 60%;
    }

    button:disabled {
        opacity: 50%;
    }

    .btn-owned {
        background-color: #38cd25;
        color: white;
    }

    .btn-owned .icon {
        filter: invert();
    }

    .btn-wishlist {
        background-color: #e93440;
        color: white;
    }

    .btn-wishlist .icon {
        filter: invert();
    }

    .icon {
        width: 1.1rem;
        height: 1.1rem;
        vertical-align: middle;
        position: relative;
    }

    .icon-alt {
        width: 1.1rem;
        height: 1.1rem;
        vertical-align: middle;
        position: relative;
        filter: invert();
    }

    .btn-alt {
        color: white;
        background-color: rgb(32, 32, 32);
    }

    .btn-alt:active {
        color: white;
        background-color: rgb(32, 32, 32);
    }

    .skeleton {
        background-color: var(--color-mid);
        width: 81dvw;
        height: 40dvh;
        border-radius: 12px;

        animation-name: fadeInOut;
        animation-duration: 1s;
        animation-direction: alternate;
        animation-iteration-count: infinite;
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
        background-color: var(--color-primary);
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
        border-bottom-style: solid;
        border-width: 1px;
        border-color: var(--color-sub);
        background-color: var(--color-primary);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: 9;
    }

    .dialog {
        background-color: var(--color-primary);
        outline: none;
        border-radius: 20px;
        z-index: 7;
        overflow: scroll;
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

    @keyframes fadeInOut {
        0% {
            opacity: 100%;
        }

        50% {
            opacity: 40%;
        }

        100% {
            opacity: 100%;
        }
    }
</style>
