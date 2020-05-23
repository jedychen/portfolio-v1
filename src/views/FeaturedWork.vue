<template>
  <div 
    :class="theme_class">
    <div id="threejs-container"></div>
    <v-container class="loading__container">
      <v-row
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
            class="subtitle-1 text-center loading__text"
            cols="12"
          >
          Loading assets...
        </v-col>
        <v-col cols="3">
          <v-progress-linear
            v-bind:value="loadingProgress"
            background-color="grey darken-3"
            color="grey lighten-5"
            >
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.feature-work__container {
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;

  &.loading--completed {
    .loading__container {
      visibility: hidden;
      
      .loading__text {
        opacity: 0;
      }
    }

    #threejs-container {
      opacity: 1;
    }
  }
}

#threejs-container {
  opacity: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  transition: all 1s ease;
  transition-delay: 0.5s;
}

.loading__container {
  position: fixed;

  .loading__text {
    opacity: 1;
    color: white;
    transition: all 0.5s ease;
  }
}


</style>

<script>
export default {
  name: 'FeaturedWork',

  data() {
    return {
      theme_class: "feature-work__container",
    }
  },

  mounted() {
    this.detectWebGL()
    this.$store.commit("initFlipCard", document.querySelector('#threejs-container'))
  },

  methods: {
    detectWebGL() {
      /* https://threejs.org/examples/js/Detector.js */
      var Detector={canvas:!!window.CanvasRenderingContext2D,webgl:function(){try{var e=document.createElement("canvas");return!!window.WebGLRenderingContext&&(e.getContext("webgl")||e.getContext("experimental-webgl"))}catch(t){return false}}(),workers:!!window.Worker,fileapi:window.File&&window.FileReader&&window.FileList&&window.Blob,getWebGLErrorMessage:function(){var e=document.createElement("div");e.id="webgl-error-message";e.style.fontFamily="monospace";e.style.fontSize="13px";e.style.fontWeight="normal";e.style.textAlign="center";e.style.background="#fff";e.style.color="#000";e.style.padding="1.5em";e.style.width="400px";e.style.margin="5em auto 0";if(!this.webgl){e.innerHTML=window.WebGLRenderingContext?['Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />','Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join("\n"):['Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>','Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join("\n")}return e},addGetWebGLMessage:function(e){var t,n,r;e=e||{};t=e.parent!==undefined?e.parent:document.body;n=e.id!==undefined?e.id:"oldie";r=Detector.getWebGLErrorMessage();r.id=n;t.appendChild(r)}};
      var script=document.createElement('script');
      if (!Detector.webgl) Detector.addGetWebGLMessage()
    }
  },

  computed: {
    loadingProgress() {
      return this.$store.getters.getLoadingProgress
    }
  },

  watch: {
    loadingProgress(value) {
      if (value >= 99.9) {
        this.theme_class = "feature-work__container loading--completed"
      } else {
        this.theme_class = "feature-work__container"
      }
    }
  }

};
</script>
