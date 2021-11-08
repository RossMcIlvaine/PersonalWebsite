<script>
    export let list_items, skill='default';
</script>

<main class='{skill}'>
    <div class='icon'>
        <slot name='icon'></slot>
    </div>
    <div class='text'>
        <slot name='desc'></slot>
    </div>
    {#if skill=='programming'}
        <ul>
            {#each list_items as item}
                <li>{item}</li>
            {/each}
        </ul>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        width: 45%;
    }

    .programming {
        width: 70%;
    }

    .icon {
        display: flex;
        justify-content: center;
    }

    .text {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0 0 10%;
    }

    li {
        width: 25%;
    }
</style>