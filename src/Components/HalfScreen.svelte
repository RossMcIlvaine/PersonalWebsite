<script>
    export let flipped = false;
</script>

<main>
    {#if flipped}
        <div class='half2'>

        </div>
        <div class='half1'>

        </div>
    {:else}
        <div class='half1'>

        </div>
        <div class='half2'>

        </div>
    {/if}
</main>

<style>
    main {
        width: 100%;
        height: 100vh;
        display: flex;
    }

    .half1 {
        height: 100%;
        width: 50%;
        background-color: rgb(48, 58, 150);
    }

    .half2 {
        height: 100%;
        width: 50%;
        background-color: white;
    }
</style>