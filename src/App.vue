<script>
import draggable from "vuedraggable"
export default {
  components: {
    draggable,
  },
  beforeMount() {
    if (localStorage.length > 0) {
      this.GetWoche()
    }
  },

  mounted() {},

  updated() {
    this.$nextTick(() => {
      this.SaveWoche()
      this.GetWoche()
    })
  },

  unmounted() {},

  data() {
    return {
      WochenDays: [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
      ],

      Tage: new Map([
        ["Montag", []],
        ["Dinstag", []],
        ["Mittwoch", []],
        ["Donnerstag", []],
        ["Freitag", []],
        ["Samstag", []],
      ]),
      currentTermin: undefined,
      CurrentTag: {
        Day: "Sonntag",
        Termine: Array(
          {
            eintag: "",
            activ: false,
          },
          {
            eintag: "",
            activ: false,
          },
          {
            eintag: "",
            activ: false,
          },
          {
            eintag: "",
            activ: false,
          }
        ),
      },

      TerminBearbeitenValue: undefined,
      WochenTage: true,
      Terminliste: false,
      TerminBearbeiten: false,
      aside: false,
      TagSotiren: false,
      TerminOptionen: false,
    }
  },

  methods: {
    SaveWoche() {
      this.SavDay()
      localStorage.setItem(
        "Woche",
        JSON.stringify(Array.from(this.Tage.entries()))
      )
    },
    GetWoche() {
      this.Tage = new Map(JSON.parse(localStorage.getItem("Woche")))
    },
    GetDay(Tag) {
      this.WochenTage = false
      this.Terminliste = true
      this.aside = false
      this.CurrentTag = {
        Day: Tag,
        Termine: this.Tage.get(Tag),
      }
    },
    SavDay() {
      this.Tage.set(this.CurrentTag.Day, this.CurrentTag.Termine)
      console.log(this.CurrentTag.Day)
    },
    TerminBearbeitenAufrufen() {
      this.WochenTage = false
      this.Terminliste = false
      this.TerminBearbeiten = true
      this.TerminOptionen = false

      this.TerminBearbeitenValue =
        this.CurrentTag.Termine[this.currentTermin].eintag
    },
    TerminBearbeitenV() {
      this.CurrentTag.Termine[this.currentTermin].eintag =
        this.TerminBearbeitenValue
      this.SaveWoche()
    },
    NavigatWoche() {
      this.WochenTage = true
      this.Terminliste = false
      this.TerminBearbeiten = false
    },
    NavigatTermine() {
      this.WochenTage = false
      this.TerminOptionen = false
      this.Terminliste = true
      this.TerminBearbeiten = false
      this.TagSotiren = false
    },
    NavigatTagSotiren() {
      this.TerminOptionen = false
      this.Terminliste = false
      this.TagSotiren = true
    },
    NavigatTerminOptionen(i) {
      if (this.TerminOptionen == true) {
        this.TerminOptionen = false
      } else {
        this.TerminOptionen = true
        this.currentTermin = i
      }
    },

    AddTermin() {
      this.CurrentTag.Termine.push({
        eintag: "",
        activ: false,
      })
      this.TerminBearbeitenAufrufen(this.CurrentTag.Termine.length - 1)
      this.SaveWoche()
    },

    getDimensions() {
      this.height = document.documentElement.clientHeight
    },
    TerminLöschhen() {
      this.TerminOptionen = false
      this.CurrentTag.Termine.splice(this.currentTermin, 1)
      this.SaveWoche()
    },
    check(i) {
      if (this.CurrentTag.Termine[i].activ === true) {
        this.CurrentTag.Termine[i].activ = false
        this.SaveWoche()
      } else {
        this.CurrentTag.Termine[i].activ = true
        this.SaveWoche()
      }
    },

    AsideNav() {
      if (this.aside == true) {
        this.aside = false
      } else {
        this.aside = true
      }
    },

    scrollTop() {
      const container = this.$el.querySelector("#app")
      container.scrollTop = container.scrollHeight
    },
  },
}
</script>

<template>
  <aside :class="aside ? '' : 'hidden'">
    <div
      class="asideItem"
      v-for="Ta in WochenDays"
      @click="GetDay(Ta)">
      <p class="Day">{{ Ta[0] + Ta[1] }}</p>
    </div>
  </aside>

  <div :class="WochenTage ? 'ListeTage' : 'hidden'">
    <p
      class="Tage"
      v-for="Tag in WochenDays"
      @click="GetDay(Tag)">
      {{ Tag }}
    </p>
  </div>
  <!-- TerminOptionen  -->
  <aside :class="TerminOptionen ? 'TerminOptionen' : 'hidden'">
    <button @click="TerminLöschhen()">
      <ion-icon name="trash"></ion-icon>
    </button>
    <button @click="TerminBearbeitenAufrufen()">
      <ion-icon name="pencil"></ion-icon>
    </button>
  </aside>

  <div :class="Terminliste ? 'ListeTermineRapper' : 'hidden'">
    <!-- TerminListe Nav -->

    <nav class="ListeTermineNav">
      <button @click="AsideNav">
        <ion-icon name="list-outline"></ion-icon>
      </button>
      <p
        class="Day"
        @click="NavigatTagSotiren">
        {{ CurrentTag.Day }}
      </p>
      <button @click="AddTermin">
        <ion-icon name="add-outline"></ion-icon>
      </button>
    </nav>

    <!-- Termin Liste -->
    <div :class="Terminliste ? 'ListeTermine' : 'hidden'">
      <div
        :class="Termin.activ ? 'TermineC' : 'Termine'"
        v-for="(Termin, i) in CurrentTag.Termine"
        :key="i">
        <p
          style="margin-right: auto"
          @click="check(i)">
          {{ Termin.eintag }}
        </p>
        <button @click="NavigatTerminOptionen(i)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Tag Sotiren -->
  <div :class="TagSotiren ? 'ListeTagSotiren' : 'hidden'">
    <nav class="NavTerminBearbeiten">
      <button @click="NavigatTermine">
        <ion-icon name="arrow-back-outline"></ion-icon>
      </button>
      <p class="Day">Tag Sotiren</p>
    </nav>
    <draggable v-model="CurrentTag.Termine">
      <template
        v-for="(Termin, i) in CurrentTag.Termine"
        :key="i"
        #item="{ element: Termin }"
        style="width: 100%">
        <div class="Termine">
          {{ Termin.eintag }}
        </div>
      </template>
    </draggable>
  </div>

  <!-- Termin Bearbeiten -->

  <div :class="TerminBearbeiten ? 'TerminBearbeiten' : 'hidden'">
    <nav class="NavTerminBearbeiten">
      <button @click="NavigatTermine">
        <ion-icon name="arrow-back-outline"></ion-icon>
      </button>
      <p class="Day">Termin Bearbeiten</p>
    </nav>
    <input
      @input="TerminBearbeitenV"
      v-model="TerminBearbeitenValue"
      class="BearbeitenInput" />
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-weight: normal;
}

body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  font-size: 16.5px;
  color: var(--color-text);
  background: var(--color-background);
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.6;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.ListeTage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.Tage {
  width: 100%;
  height: 16.666%;
  font-size: 1.8rem;
  border-bottom: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}
nav {
  padding: 0.5rem;

  font-size: 1rem;
  width: 100%;
  background-color: #ffffff;
  border-bottom: solid black 1.5px;
}
aside {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #fff;
  border-right: solid black 1.5px;
  border-top: solid black 1.5px;
  color: #000;
  height: 85%;
  width: 25%;
  position: fixed;
  border-top-right-radius: 11px;
  z-index: 2;
}
.TerminOptionen {
  height: 15%;
  width: 11%;
  justify-content: center;
  border-top-right-radius: 0;
  border-bottom: solid black 1.5px;
  border-right: 0;
  border-left: solid black 1.5px;
  border-top-left-radius: 11px;
  border-bottom-left-radius: 11px;
  padding: 0.5rem;
  top: 25%;
  left: 89%;
}
.asideItem {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 16.666%;
  font-size: 1.5rem;
  border-bottom: solid black 1.5px;
}

.Day {
  margin: 0 auto;
}

.ListeTermineRapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.ListeTermineNav {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}

.ListeTermine {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: 3rem;

  width: 100%;
}

.Termine {
  font-size: 1rem;
  border: 1.5px solid black;

  display: flex;

  padding: 0.5rem;
  width: 100%;
}
.TermineC {
  font-size: 1rem;
  border: 1.5px solid black;
  background-color: #d3f9d8;
  display: flex;

  gap: 0.3rem;
  padding: 0.5rem;
  width: 100%;
}
.ListeTagSotiren {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.hidden {
  display: none;
}

button {
  width: 2rem;
  height: 2rem;
  padding: 0.3rem;
  border: 1px solid black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}
.TerminValue {
  margin-right: auto;
}

.TerminBearbeiten {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  height: 100%;
  width: 100%;
}
.NavTerminBearbeiten {
  display: flex;
  align-items: center;
}
.BearbeitenInput {
  padding: 0.5rem;
  font-size: 1.5rem;
  height: 3rem;
  width: 100%;
  margin: 50% auto 0 auto;
}

ion-icon {
  font-size: 1rem;
}
</style>
