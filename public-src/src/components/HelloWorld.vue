<template>
  <div>
    <v-container class="pa-0 ma-0" fluid>
      <v-row>
        <v-col cols="12" md="2">
          xx
        </v-col>

        <v-col cols="12" md="7">
          <DeviceList/>
        </v-col>

        <v-col cols="12" md="3">
          xx
        </v-col>
      </v-row>
      </v-container>
  </div>
</template>

<script>
import DeviceList from '@/components/DeviceList.vue'

  export default {
    name: 'HelloWorld',
    components: {
      DeviceList
    },
    data: () => ({
    }),
    computed: {
    },
    methods: {
    }
  }
</script>
