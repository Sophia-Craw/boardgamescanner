<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";
	import { collectionList, wishlistList } from "$lib/stores.js";
	import type { GameObject } from "$lib/types";
	import { fly } from "svelte/transition";
	import ScanIcon from "$lib/assets/scan.png";
	import ExportIcon from "$lib/assets/upload.png";
	// import { FileTransfer } from "@capacitor/file-transfer";
	import { Filesystem, Directory, Encoding } from "@capacitor/filesystem"
	import { Share } from "@capacitor/share";

	let { children, data } = $props();

	let collectionArray: Array<GameObject> = $state([]);
	let saveDialog = $state(false);

	const downloadData = async (pathName: string, mode: number) => {
		const status = await Filesystem.requestPermissions();

		if (status.publicStorage === "granted") {
			const result = await Filesystem.writeFile({
				data: mode === 1 ? localStorage.getItem("wishlist") || "[]" : localStorage.getItem("collection") || "[]",
				path: `${pathName}`,
				directory: Directory.Cache,
				encoding: Encoding.UTF8,
				recursive: true
			})

			await Share.share({
				title: "Exported data",
				url: result.uri,
				dialogTitle: "Save Data"
			})
		}
	}

	$effect(() => {
		if (
			localStorage.getItem("wishlist") &&
			localStorage.getItem("collection")
		) {
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

{#if saveDialog}
	<div
		class="dialog"
		in:fly={{ y: 200, duration: 200 }}
		out:fly={{ y: 200, duration: 200 }}
	>
		<!-- <GameList games={data.bgg_info.length > 0 ? data.bgg_info : []} controls={false} />   -->
		<div class="dialog-heading">
			<h3>Data export</h3>
		</div>
		<div class="dialog-content">
			<h3>Your data is ready!</h3>
			<p>Tap the save button below to save your data</p>
			<div class="save-options">
				<button class="save-button" onclick={() => {downloadData("collection.json", 0)}}>
					Save Collection
				</button>
				<button class="save-button" onclick={() => {downloadData("wishlist.json", 1)}}>
					Save Wishlist
				</button>
			</div>
		</div>
		<div class="dialog-action">
			<button
				class="general-button"
				onclick={() => {
					saveDialog = false;
				}}
			>
				Close
			</button>
		</div>
	</div>
{/if}

{#key data.url}
	<div
		in:fly={{ x: data.url === "/" ? -100 : 100, duration: 200, delay: 200 }}
		out:fly={{ x: data.url === "/" ? 100 : -100, duration: 200 }}
	>
		{#if page.url.pathname === "/"}
			<div class="tab-nav">
				<div class="top-info">
					<h2>Your Collection</h2>
					<p>Games Owned: {collectionArray.length}</p>
				</div>
				<div class="top-actions">
					<button onclick={() => {
						saveDialog = true
					}}>
						<img class="icon" src={ExportIcon} alt="" />
					</button>
				</div>
			</div>
		{/if}
		{@render children()}
	</div>
{/key}

{#if data.url === "/"}
	<div
		class="bottom-nav"
		in:fly={{ y: 200, duration: 200 }}
		out:fly={{ y: 200, duration: 200 }}
		data-sveltekit-noscroll
	>
		<button
			data-sveltekit-noscroll
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
			--color-primary: #ffffff;
			--color-mid: rgba(238, 236, 236, 0.8);
			--color-accent: rgb(0, 0, 0);
			--color-sub: rgba(25, 25, 25, 0.344);
			--color-innertext: rgb(0, 0, 0);
			--invert-value: 0;
			--scan-button: rgba(225, 223, 223, 0.8);
			--color-buttons: rgb(236, 236, 236);
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
		display: flex;
		justify-content: space-between;
	}

	.icon {
		width: 30px;
		filter: invert();
		transition: 0.08s;
	}

	.icon:active {
		scale: 95%;
	}

	@media (prefers-color-scheme: light) {
		.icon {
			filter: invert(0);
		}
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

	button {
		border: none;
		background-color: transparent;
	}

	.save-button {
		padding: 12px;
		background-color: var(--color-buttons);
		color: var(--color-innertext);
		font-weight: 800;
		transition: 0.08s;
		font-size: 1rem;
		border-radius: 12px;
		width: 100%;
	}

	.save-button:active {
		scale: 95%;
		opacity: 60%;
	}

	.general-button {
		padding: 12px;
		background-color: var(--color-buttons);
		color: var(--color-innertext);
		font-weight: 800;
		transition: 0.08s;
		font-size: 1rem;
		border-radius: 12px;
		width: 100%;
	}

	.general-button:active {
		scale: 95%;
		opacity: 60%;
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
		color: var(--color-accent);
		font-family: sans-serif;
	}

	.dialog-content {
		padding: 40px;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 20px;
		justify-content: center;
	}

	h3 {
		margin: 0;
		color: var(--color-accent);
		font-family: sans-serif;
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

	.save-options {
		display: flex;
		gap: 12px;
		justify-content: center;
	}

	.dialog {
		background-color: var(--color-primary);
		outline: none;
		border-radius: 20px;
		z-index: 7;
		/* overflow: scroll; */
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
</style>
