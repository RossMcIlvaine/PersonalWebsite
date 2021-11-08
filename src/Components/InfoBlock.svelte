<script>
    export let title, location, date, items, alt, src;
    export let items_present = true;
</script>

<main>
    <div class='text'>
        <h3>{title}</h3> 
        <ul>
            {#if items_present}
                {#each items as item}
                    <li>{item}</li>
                {/each}
            {/if}
        </ul>
    </div>
    <div class='info'>
        <img {alt} {src}>
        <h4>{location}</h4>
        <h4>{date}</h4>
    </div>
</main>

<style>
    main {
        padding: 10px 30px;
        border-radius: 10px; 
        margin-bottom: 5%;
        display: flex;
        justify-content: space-between;
        transition: box-shadow 0.5s, border 0.5s, border-left 0.5s;
    }

    .text {
        width: 70%;
    }

    .info {
        width: 20%;
        display: flex;
        flex-direction: column;
        text-align: right;
    }

    h3 {
		text-align: left;
        color: black;
        transition: color 0.5s;
	}

    h4 {
        color: black;
        transition: color 0.5s;
        margin: 2%;
	}

    img {
        height: 60px;
        width: 60px;
        align-self: flex-end;
    }

    li {
		text-align: left;
        color: black; 
        transition: color 0.5s;
	}
</style>