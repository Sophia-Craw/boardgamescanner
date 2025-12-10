<script lang="ts">
    import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";
	import { collectionList, wishlistList } from "$lib/stores.js";
	import type { GameObject } from "$lib/types";
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";
    import ScanIcon from "$lib/assets/scan.png";

	let { children, data } = $props();

	let collectionArray: Array<GameObject> = $state([]);

	onMount(() => {
		if (localStorage) {
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
				<p>Games: {collectionArray.length}</p>
			</div>
		{/if}
		{@render children()}
	</div>
{/key}

{#if data.url === "/"}
	<div class="bottom-nav" data-sveltekit-noscroll>
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
	:root {
		background-color: rgb(0, 0, 0);
		overflow: hidden;
	}

	.tab-nav {
		top: 0;
		left: 0;
		right: 0;
		position: sticky;
		padding: 20px;
		border-bottom-style: solid;
		border-width: 1px;
		border-color: rgba(255, 255, 255, 0.09);
		background-color: rgba(29, 29, 29, 0.342);
		backdrop-filter: blur(20px);
	}

	h2 {
		margin: 0;
		font-size: 1.5rem;
		color: white;
		font-weight: 900;
		font-family: sans-serif;
	}

	p {
		margin: 0;
		color: rgba(255, 255, 255, 0.344);
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
        background-color: rgb(255, 255, 255);
        transition: 0.04s;
        display: flex;
        gap: 15px;
        color: black;
    }

    .btn-scan:active {
        scale: 95%;
        background-color: rgb(189, 189, 189);
    }

    .label-scan {
        margin: 0;
        font-size: 1rem;
        padding: 5px;
        padding-left: 0px;
        font-weight: 800;
		color: black;
    }
</style>
