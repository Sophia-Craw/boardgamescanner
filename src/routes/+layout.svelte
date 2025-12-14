<script lang="ts">
    import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";
	import { collectionList, wishlistList } from "$lib/stores.js";
	import type { GameObject } from "$lib/types";
	import { fly } from "svelte/transition";
    import ScanIcon from "$lib/assets/scan.png";

	let { children, data } = $props();

	let collectionArray: Array<GameObject> = $state([]);
	
	$effect(() => {
		if (localStorage.getItem("wishlist") && localStorage.getItem("collection")) {
			let colList: Array<GameObject> =
				JSON.parse(localStorage.getItem("collection") || "[]") || [];
			let wisList: Array<GameObject> =
				JSON.parse(localStorage.getItem("wishlist") || "[]") || [];

			colList.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				}
				if (a.name > b.name) {
					return 1;
				}
				return 0;
			});

			wisList.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				}
				if (a.name > b.name) {
					return 1;
				}
				return 0;
			});

			collectionList.set(colList);
			wishlistList.set(wisList);
		}

		collectionList.subscribe((list) => {
			collectionArray = list;
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#key data.url}
	<div
		in:fly={{ x: data.url === "/" ? -100 : 100, duration: 200, delay: 200 }}
		out:fly={{ x: data.url === "/" ? 100 : -100, duration: 200 }}
	>
		{#if page.url.pathname === "/"}
			<div class="tab-nav">
				<h2>Your Collection</h2>
				<p>Games Owned: {collectionArray.length}</p>
			</div>
		{/if}
		{@render children()}
	</div>
{/key}

{#if data.url === "/"}
	<div class="bottom-nav" in:fly={{y: 200, duration: 200}} out:fly={{y: 200, duration: 200}} data-sveltekit-noscroll>
		<button data-sveltekit-noscroll
			class="btn-scan"
			onclick={() => {
				goto("/scanner");
			}}
		>
			<img class="icon-scan" src={ScanIcon} alt="" />
			<p class="label-scan">Scan Game</p>
		</button>
	</div>	
{/if}

<style>
	:global(:root) {
		--color-primary: #000000;
		--color-mid: rgba(51, 51, 51, 0.342);
		--color-accent: white;
		--color-sub: rgba(255, 255, 255, 0.344);
		--color-innertext: black;
		--invert-value: 1;
		--scan-button: white;
		--color-buttons: white;

		background-color: var(--color-primary);
	}

	@media (prefers-color-scheme: light) {
		:global(:root) {
			--color-primary: #FFFFFF;
			--color-mid: rgba(238, 236, 236, 0.8);
			--color-accent: rgb(0, 0, 0);
			--color-sub: rgba(25, 25, 25, 0.344);
			--color-innertext: rgb(0, 0, 0);
			--invert-value: 0;
			--scan-button: rgba(225, 223, 223, 0.8);
			--color-buttons: rgb(236, 236, 236)
		}
	}

	.tab-nav {
		top: 0;
		left: 0;
		right: 0;
		position: sticky;
		padding: 20px;
		padding-top: 60px;
		border-bottom-style: solid;
		border-width: 1px;
		border-color: rgba(255, 255, 255, 0.09);
		background-color: var(--color-mid);
		backdrop-filter: blur(20px);
	}

	h2 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--color-accent);
		font-weight: 900;
		font-family: sans-serif;
	}

	p {
		margin: 0;
		color: var(--color-sub);
		font-family: sans-serif;
		font-weight: 800;
	}

    .bottom-nav {
        display: flex;
        justify-content: center;
        padding: 40px;
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
        background-color: var(--color-accent);
        transition: 0.04s;
        display: flex;
        gap: 15px;
        color: var(--color-primary);
    }

    .btn-scan:active {
        scale: 95%;
        opacity: 60%;
    }

    .label-scan {
        margin: 0;
        font-size: 1rem;
        padding: 5px;
        padding-left: 0px;
        font-weight: 800;
		color: var(--color-innertext);
    }

    .bottom-nav {
        display: flex;
        justify-content: center;
        padding: 40px;
        position: absolute;
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
        background-color: var(--scan-button);
        transition: 0.04s;
        display: flex;
        gap: 15px;
        color: black;
    }

    .btn-scan:active {
        scale: 95%;
       	opacity: 60%;
    }

    .label-scan {
        margin: 0;
        font-size: 1rem;
        padding: 5px;
        padding-left: 0px;
        font-weight: 800;
    }
</style>
