<script lang="ts">
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";
	import { collectionList, wishlistList } from "$lib/stores.js";
	import type { GameObject } from "$lib/types";
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";

	let { children, data } = $props();

	let collectionArray: Array<GameObject> = $state([]);

	onMount(() => {
		if (localStorage) {
			collectionList.set(
				JSON.parse(localStorage.getItem("collection") || "[]") || [],
			);
			wishlistList.set(
				JSON.parse(localStorage.getItem("wishlist") || "[]") || [],
			);
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
		in:fly={{ x: data.url === "/" ? -100 : 100, duration: 100, delay: 100 }}
		out:fly={{ x: data.url === "/" ? 100 : -100, duration: 100 }}
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


<style>
	:root {
		background-color: rgb(0, 0, 0);
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
</style>
