<script>

</script>

<main>
    <div class='icon'>
        <slot name='icon'></slot>
    </div>
    <div class='text'>
        <slot name='desc'></slot>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
    }
</style>