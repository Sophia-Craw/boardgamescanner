<script lang="ts">
    const { games } = $props();

    import RightArrow from "$lib/assets/right-arrow.png";
</script>

<main>
    {#if games.length > 0}
        {#each games as game}
            <a href="/result/{game.upc}">
                <div class="game">
                    <div class="info-wrapper">
                        <div class="thumbnail-wrapper">
                            <img
                                class="thumbnail"
                                src={game.bgg_info[0].image_url}
                                alt=""
                            />
                        </div>
                        <div class="game-info">
                            <p class="title">{game.name}</p>
                            <p class="year">{game.bgg_info[0].published}</p>
                        </div>
                    </div>
                    <div class="arrow-wrapper">
                        <img class="icon" src={RightArrow} alt="" />
                    </div>
                </div>
            </a>
        {/each}
    {:else}
        <p>No games yet.</p>
    {/if}
</main>

<style>
    .game {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 12px;
        border-bottom-style: solid;
        border-width: 1px;
        border-color: rgba(255, 255, 255, 0.088);
        transition: 0.08s;
    }

    .game:active {
        background-color: rgb(37, 37, 37);
    }

    .info-wrapper {
        display: flex;
        gap: 12px;
    }

    .game-info {
        display: flex;
        flex-direction: column;
        padding: 4px;
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
        color: white;
        font-family: sans-serif;
        font-size: 1rem;
        font-weight: 800;
    }

    .year {
        color: rgba(255, 255, 255, 0.27);
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

    a {
        text-decoration: none;
    }
</style>
