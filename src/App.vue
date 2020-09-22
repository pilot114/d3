<template>
    <div id="grid">
        <div>
            <Graph
                :isDirected="false"
                :nodes="new Array(100).fill(0).map((x, i) => {
                    return {
                        id: i,
                        group: Math.round(Math.random()*9),
                        name: i,
                    }
                })"
                :links="new Array(100).fill(0).map((x, i) => {
                    return {
                        source: i,
                        target: i > 50 ? i-1 : i+1,
                        weight: Math.round(Math.random()*10)
                    }
                })"
                :h="800"
            />
        </div>
    </div>
</template>

<script>
import Graph from './components/Graph'

export default {
    name: 'App',
    components: {
        Graph
    },
}
</script>
<style>
#grid {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
}

#grid div {
    border: 1px solid;
}
</style>