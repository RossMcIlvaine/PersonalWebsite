<script>
    import * as animateScroll from "svelte-scrollto";
</script>

<div id='top-button'>
    <a on:click={() => animateScroll.scrollToTop()}><p>To Top &#129130</p></a>
</div>

<style>
    #top-button {
        transform: rotate(270deg);
        z-index: 69420;
        cursor: pointer;
    }
    a {
        text-decoration: none;
    }
    p {
        color: var(--mdc-theme-primary);
    }

    /*
    @media (max-width: $phone-max-width) {
        p {
            font-size: 10px;
        }
    } */
</style>