<template>
    <v-app id="app">
      <v-navigation-drawer v-model="drawer" app absolute temporary>
        <v-list nav dense>
          <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
            <v-list-item>
              <v-list-item-title>Foo</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Bar</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Fizz</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Buzz</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar color="deep-purple accent-4" app dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>My files</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-filter</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main>
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/page2">Page 2</router-link> |
          <router-link to="/about">About</router-link>
        </div>
        <router-view/>
      </v-main>

      <v-footer app dark>
        Footer
      </v-footer>
      <!--
      <v-bottom-navigation v-model="BottomNav" background-color="teal" shift app>
        <v-btn value="recent">
          <span>Recent</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>

        <v-btn value="favorites">
          <span>Favorites</span>
          <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn value="nearby">
          <span>Nearby</span>
          <v-icon>mdi-map-marker</v-icon>
        </v-btn>
      </v-bottom-navigation>
      -->
    </v-app>
</template>

<script>
  export default {
    name: 'App',
    data: () => ({
      drawer: false,
      BottomNav: 'favorites',
    }),
  }
</script>
