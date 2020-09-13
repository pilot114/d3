<template>
  <div id="grid">
      <div>
        <Graph
          :nodes="new Array(100).fill(0).map((x, i) => {
              return {
                  id: i,
                  group: 1,//Math.round(Math.random()*9),
                  name: 'test',
                }
            })"
          :links="new Array(100).fill(0).map(() => {
              return {
                source: Math.round(Math.random()*49),
                target: Math.round(Math.random()*49),
              }
            })"
          :h="500"
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