import { writable } from "svelte/store";
import type { GameObject } from "./types";

export let collectionList = writable<Array<GameObject>>([])
export let wishlistList = writable<Array<GameObject>>([])
export let displayStyle = writable<number>(0)