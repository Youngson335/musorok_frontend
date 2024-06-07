<template>
  <nav v-if="clientFlag" class="menu">
    <div class="menu__link" @click="clickActiveLink(0)">
      <router-link to="/delivery">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-ea893728=""
          >
            <path
              fill="currentColor"
              d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
            ></path>
          </svg>
        </span>
      </router-link>
      <p>Доставка</p>
    </div>
    <div
      class="menu__link"
      @click="clickActiveLink(1)"
      :class="{ active: activeLink === 1 }"
    >
      <router-link to="/">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-ea893728=""
          >
            <path
              fill="currentColor"
              d="M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384m0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512m320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0"
            ></path>
          </svg>
        </span>
        <p>Профиль</p>
      </router-link>
    </div>
    <div class="menu__link" @click="clickActiveLink(2)">
      <router-link to="/settings">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-ea893728=""
          >
            <path
              fill="currentColor"
              d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256"
            ></path>
          </svg>
        </span>
        <p>Настройки</p>
      </router-link>
    </div>
  </nav>

  <nav v-else class="menu">
    <div class="menu__link" @click="clickActiveLink(0)">
      <router-link to="/courier/calendar">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-ea893728=""
          >
            <path
              fill="currentColor"
              d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
            ></path>
          </svg>
        </span>
        <p>График</p>
      </router-link>
    </div>

    <div class="menu__link" @click="clickActiveLink(1)">
      <router-link to="/maps">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416M512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544"
            ></path>
            <path
              fill="currentColor"
              d="M512 512a96 96 0 1 0 0-192 96 96 0 0 0 0 192m0 64a160 160 0 1 1 0-320 160 160 0 0 1 0 320"
            ></path>
          </svg>
        </span>
        <p>Картa</p>
      </router-link>
    </div>

    <div
      class="menu__link"
      @click="clickActiveLink(2)"
      :class="{ active: activeLink === 2 }"
    >
      <router-link to="/">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M704 192h160v736H160V192h160v64h384zM288 512h448v-64H288zm0 256h448v-64H288zm96-576V96h256v96z"
            ></path>
          </svg>
        </span>
        <p>Активности</p>
      </router-link>
    </div>
    <div class="menu__link" @click="clickActiveLink(3)">
      <router-link to="/more">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="M352 480h320a32 32 0 1 1 0 64H352a32 32 0 0 1 0-64"
          ></path>
          <path
            fill="currentColor"
            d="M480 672V352a32 32 0 1 1 64 0v320a32 32 0 0 1-64 0"
          ></path>
          <path
            fill="currentColor"
            d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
          ></path>
        </svg>
        <p>Еще</p>
      </router-link>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      client: null,
      activeLink: 2,
    };
  },
  computed: {
    ...mapGetters(["getUserId", "getClientFlag"]),
    clientFlag() {
      return this.getClientFlag;
    },
  },
  methods: {
    ...mapActions(["getStateNav"]),
    downloadNavbar() {
      this.getStateNav();
    },
    clickActiveLink(index) {
      const links = document.querySelectorAll(".menu__link");
      links.forEach((link, i) => {
        if (i === index) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    },
  },
  created() {
    this.downloadNavbar;
  },
};
</script>
<style lang="css">
.menu {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 20px;
  border: 1px solid #a19595;
  margin: 3px;
  background: #fcfcfc;
  animation: 1s showNav ease;
  z-index: 20;
}
.menu__link {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.menu__link svg {
  width: 30px;
  color: #a19595;
}
.menu__link span {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu__link a {
  text-decoration: none;
}
.menu__link p {
  color: #a19595;
  font-size: 12px;
}
.active p {
  color: #66a0d4;
}
.active svg {
  color: #66a0d4;
}
@keyframes showNav {
  0% {
    opacity: 0;
    transform: translateY(70px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
