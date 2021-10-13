<script>
    export let block_type = 'default';
</script>

<main>
    {#if block_type=='default'}
        <div class='half2'>

        </div>
        <div class='half1'>

        </div>
    {:else if block_type=='resume'}
        <div class='half1'>

        </div>
        <div class='half2'>
            <slot></slot>
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
        overflow-y: scroll;
    }
    /* Hide scrollbar in section */
    .half2::-webkit-scrollbar {
        display: none;
    }
</style>