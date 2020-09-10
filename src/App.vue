<template>
  <div id="grid">
      <div>
        <Graph/>
      </div>
      <!-- <div>
        <Graph/>
      </div>
      <div>
        <Graph/>
      </div>
      <div>
        <Graph/>
      </div> -->
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