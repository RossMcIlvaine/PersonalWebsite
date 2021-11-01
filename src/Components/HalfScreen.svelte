<script>
    export let block_type = 'default';
</script>

<main class={block_type}>
    {#if block_type=='default'}
        <div class='half2'>
            <slot name='info'></slot>
        </div>
        <div class='half1'>
            <slot name='section-title'></slot>
        </div>
    {:else if block_type=='resume' || block_type=='contact'}
        <div class='half1 {block_type}' >
            <slot name='section-title'></slot>
            <slot name='photo'></slot>
        </div>
        <div class='half2'>
            <slot name='info'></slot>
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
    
    .contact {
        height: 50vh;
    }

    .half1 {
        height: 100%;
        width: 50%;
        background-color: rgb(48, 58, 150);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .half1.resume {
        flex-direction: column;
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