<script lang="ts">
    import { goto } from "$app/navigation";

    let data: GameObject = $state({
        name: "",
        published: 0,
        upc: 0,
        bgg_info: [
            {
                name: "",
                published: 0,
                id: 0,
                image_url: ""
            }
        ]
    });

    import HeartIcon from "$lib/assets/heart.png";
    import HeartIconOutline from "$lib/assets/heart_outline.png"
    import AddIcon from "$lib/assets/plus.png";
    import ScanIcon from "$lib/assets/scan.png";
    import CheckIcon from "$lib/assets/check.png"
    import type { GameObject } from "$lib/types.js";
    import { onMount } from "svelte";
    import { collectionList, wishlistList } from "$lib/stores.js";
    import { page } from "$app/state";

    let isOwned: boolean = $state(false)
    let isWishlist: boolean = $state(false)

    let loadingDisable = $state(true)

    onMount(() => {

        fetch("https://api.gameupc.com/test/upc/" + page.url.searchParams.get("upc"), {
            headers: {
                "X-Api-Key": "test_test_test_test_test"
            }
        }).then((resp) => {
            const gameData = resp.json()

            gameData.then((g) => {
                data = g as GameObject
            })
        })

        if (localStorage) {
            let storage: Array<GameObject> = JSON.parse(localStorage.getItem("collection") || "[]") || []
            let wishlistStorage: Array<GameObject> = JSON.parse(localStorage.getItem("wishlist") || "[]") || []

            wishlistStorage.forEach(game => {
                if (game.bgg_info[0].id === data.bgg_info[0].id) {
                    isWishlist = true
                }
            })
            
            storage.forEach(game => {
                if (game.bgg_info[0].id === data.bgg_info[0].id) {
                    isOwned = true
                    loadingDisable = false
                }
                loadingDisable = false    
            })
            loadingDisable = false
        }
    })

    const own = () => {
        if (!isOwned) {
            if (!localStorage.getItem("collection"))
                localStorage.setItem("collection", JSON.stringify([]))

            let storage: Array<GameObject> = JSON.parse(localStorage.getItem("collection") || "[]") || []

            let gameObject = data
            storage.push(gameObject);

            localStorage.setItem("collection", JSON.stringify(storage))

            let wishStorage: Array<GameObject> = JSON.parse(localStorage.getItem("wishlist") || "[]") || []

            let filteredStorage = wishStorage.filter(game => {
                return game.bgg_info[0].id !== data.bgg_info[0].id ? game : null
            })

            localStorage.setItem("wishlist", JSON.stringify(filteredStorage))
            wishlistList.set(JSON.parse(localStorage.getItem("wishlist") || "[]"))
            isWishlist = false
            collectionList.set(JSON.parse(localStorage.getItem("collection") || "[]"))
            isOwned = true
        } else {
            if (localStorage.getItem("collection")) {
                let storage: Array<GameObject> = JSON.parse(localStorage.getItem("collection") || "[]") || []

                let filteredStorage = storage.filter(game => {
                    return game.bgg_info[0].id !== data.bgg_info[0].id ? game : null
                })

                localStorage.setItem("collection", JSON.stringify(filteredStorage))
                collectionList.set(JSON.parse(localStorage.getItem("collection") || "[]"))
                isOwned = false
            }
        }
    }

    const wishlist = () => {
        if (!isWishlist) {
            if (!localStorage.getItem("wishlist"))
                localStorage.setItem("wishlist", JSON.stringify([]))

            let storage: Array<GameObject> = JSON.parse(localStorage.getItem("wishlist") || "[]") || []

            let gameObject = data
            storage.push(gameObject);

            localStorage.setItem("wishlist", JSON.stringify(storage))
            wishlistList.set(JSON.parse(localStorage.getItem("wishlist") || "[]"))
            isWishlist = true
        } else {
            if (localStorage.getItem("wishlist")) {
                let storage: Array<GameObject> = JSON.parse(localStorage.getItem("wishlist") || "[]") || []

                let filteredStorage = storage.filter(game => {
                    return game.bgg_info[0].id !== data.bgg_info[0].id ? game : null
                })

                localStorage.setItem("wishlist", JSON.stringify(filteredStorage))
                wishlistList.set(JSON.parse(localStorage.getItem("wishlist") || "[]"))
                isWishlist = false
            }
        }
    }
</script>

<main>
    {#if data.name === data.bgg_info[0].name}
        <img class="game-image" src={data.bgg_info[0].image_url} alt="" />
        <h2><b>{data.name}</b></h2>
        <p><b>{data.bgg_info[0].published}</b></p>
        <div class="options">
            <button disabled={loadingDisable} class={isOwned ? "btn-owned" : ""} onclick={own}>
                <img class="icon" src={isOwned ? CheckIcon : AddIcon} alt="" />
                I Own This
            </button>
            <button disabled={loadingDisable || isOwned ? true : false} class={isWishlist ? "btn-wishlist" : ""} onclick={wishlist}>
                <img class="icon" src={isWishlist ? HeartIcon : HeartIconOutline} alt="" />
                I Want This
            </button>
        </div>
        <button class="btn-alt" onclick={() => {
            goto("/scanner")
        }}>
            <img class="icon-alt" src={ScanIcon} alt="" />
            Rescan
        </button>
        <button onclick={() => {
            goto("/")
        }}>
            <img class="icon" src={CheckIcon} alt="" />
            Done
        </button>
        <a href="/">Not the right game?</a>
    {/if}
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
        color: white;
        margin: 0;
        font-size: 2rem;
    }

    p {
        margin: 0;
        font-family: sans-serif;
        color: rgb(143, 143, 143);
        font-size: 1.5rem;
        font-weight: 800;
    }

    a {
        margin: 0;
        font-family: sans-serif;
        color: rgb(143, 143, 143);
        font-size: 1rem;
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
        background-color: white;
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
        background-color: rgb(208, 208, 208);
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
</style>
