<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item
        v-if="isLoggedIn && user"
        prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
        :title="user.name"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list v-if="isLoggedIn" density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Home"
          value="home"
          to="/"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-face-recognition"
          title="Add face"
          value="addFace"
          to="/add-face"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          value="logout"
          @click="logout"
        ></v-list-item>
      </v-list>

      <v-list v-if="!isLoggedIn" density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Home"
          value="home"
          to="/"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-login"
          title="Login"
          value="login"
          to="/login"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-plus"
          title="Register"
          value="register"
          to="/register"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :elevation="0">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Swift Shop GenAI</v-app-bar-title>

      <template v-slot:append>
        <v-btn stacked>
          <v-badge color="error" dot>
            <v-icon icon="mdi-newspaper-variant-outline"></v-icon>
          </v-badge>
        </v-btn>

        <v-btn stacked>
          <v-badge color="error" dot>
            <v-icon icon="mdi-post"></v-icon>
          </v-badge>
        </v-btn>

        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height" fluid>
        <slot />
      </v-container>
    </v-main>
    <v-bottom-navigation v-if="isLoggedIn">
      <v-btn value="recent">
        <v-icon>mdi-history</v-icon>

        <span>Recent</span>
      </v-btn>
      <v-btn value="home" to="/">
        <v-icon>mdi-view-dashboard</v-icon>

        <span>Home</span>
      </v-btn>

      <v-btn value="nearby">
        <v-icon>mdi-map-marker</v-icon>

        <span>Nearby</span>
      </v-btn>
    </v-bottom-navigation>
    <v-bottom-navigation v-else>
      <v-btn value="login" to="/login">
        <v-icon>mdi-login</v-icon>

        <span>Login</span>
      </v-btn>
      <v-btn value="favorites" to="/">
        <v-icon>mdi-face-recognition</v-icon>

        <span>Face Recognition</span>
      </v-btn>
      <v-btn value="register" to="/register">
        <v-icon>mdi-account-plus</v-icon>

        <span>Register</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useUserStore } from "../stores/user";
export default {
  data() {
    return {
      drawer: null,
    };
  },
  computed: {
    ...mapState(useUserStore, {
      user: (state) => state.userData,
      isLoggedIn: (state) => state.isLoggedIn,
    }),
  },
  methods: {
    ...mapActions(useUserStore, ["doLogout"]),
    logout() {
      this.doLogout();
      this.$router.push("/login");
    },
  },
  mounted() {
    console.log("App mounted");
  },
};
</script>