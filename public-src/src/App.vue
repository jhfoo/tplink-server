<template>
    <v-app id="app">
      <v-navigation-drawer v-model="drawer" app absolute temporary>
        <v-list nav dense>
          <v-list-item-group v-model="SelectedSidebarList" active-class="deep-purple--text text--accent-4">
            <v-list-item v-for="item in MainMenu" @click="$router.replace(item.to)" v-bind:key="item.name">
              <v-list-item-title>{{item.name}}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar color="deep-purple accent-4" app dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>TP-Link Smart Home Dashboard</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn v-for="item in MainMenu" @click="$router.replace(item.to)" v-bind:key="item.name">{{item.name}}</v-btn>
        </v-toolbar-items>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main>
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
      SelectedSidebarList: 0,
      BottomNav: 'favorites',
      MainMenu: [
        { name: 'Home', to: '/'},
        { name: 'Page 2', to: '/page2'},
        { name: 'About', to: '/about'},
      ]
    }),
  }
</script>
