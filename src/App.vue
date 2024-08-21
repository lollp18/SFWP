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

  updated() {
    this.$nextTick(() => {
      this.SaveWoche()
      this.GetWoche()
    })
  },

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
        ["Dienstag", []],
        ["Mittwoch", []],
        ["Donnerstag", []],
        ["Freitag", []],
        ["Samstag", []],
      ]),
      CurrentTerminID: undefined,
      CurrentTermin: {
        StraßenName: "",
        StraßenNummer: undefined,
        Tätichkeit: "",
      },
      CurrentTag: {
        Day: "Sonntag",
        Termine: Array(
          {
            eintrag: {
              StraßenName: "",
              StraßenNummer: undefined,
              Tätichkeit: "",
            },
            activ: false,
          },
          {
            eintrag: {
              StraßenName: "",
              StraßenNummer: undefined,
              Tätichkeit: "",
            },
            activ: false,
          },
          {
            eintrag: {
              StraßenName: "",
              StraßenNummer: undefined,
              Tätichkeit: "",
            },
            activ: false,
          },
          {
            eintrag: {
              StraßenName: "",
              StraßenNummer: undefined,
              Tätichkeit: "",
            },
            activ: false,
          }
        ),
      },

      WochenTage: true,
      Terminliste: false,
      TerminBearbeiten: false,
      aside: false,
      TagSotiren: false,
      TerminOptionen: false,
    }
  },

  methods: {
    KopieTermin() {
      const KopieTermin = this.CurrentTag.Termine[this.CurrentTerminID]
      this.CurrentTag.Termine.push({ ...KopieTermin })
      this.SaveWoche()
    },
    SaveWoche() {
      this.SavDay()
      localStorage.setItem(
        "Woche",
        JSON.stringify(Array.from(this.Tage.entries()))
      )
      this.GetWoche()
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
    },
    TerminBearbeitenAufrufen() {
      this.WochenTage = false
      this.Terminliste = false
      this.TerminBearbeiten = true
      this.TerminOptionen = false
      this.aside = false
      this.CurrentTermin = {
        ...this.CurrentTag.Termine[this.CurrentTerminID].eintrag,
      }
    },
    TerminBearbeitenV() {
      this.CurrentTag.Termine[this.CurrentTerminID].eintrag = {
        ...this.CurrentTermin,
      }
      this.SaveWoche()
    },
    NavigatWoche() {
      this.WochenTage = true
      this.Terminliste = false
      this.TerminBearbeiten = false
    },
    NavigatTermine() {
      if (
        (!this.CurrentTermin.StraßenNummer ||
          !this.CurrentTermin.StraßenName ||
          !this.CurrentTermin.Tätichkeit) &&
        this.TagSotiren == false
      )
        this.TerminLöschen()
      this.WochenTage = false
      this.TerminOptionen = false
      this.Terminliste = true
      this.TerminBearbeiten = false
      this.TagSotiren = false
    },
    NavigatTagSotiren() {
      this.TerminOptionen = false
      this.Terminliste = false
      this.aside = false
      this.TagSotiren = true
    },
    NavigatTerminOptionen(i) {
      this.TerminOptionen
        ? (this.TerminOptionen = false)
        : (this.TerminOptionen = true) && (this.CurrentTerminID = i)
    },

    AddTermin() {
      this.CurrentTag.Termine.push({
        eintrag: {
          StraßenName: "",
          StraßenNummer: undefined,
          Tätichkeit: "",
        },
        activ: false,
      })
      this.CurrentTerminID = this.CurrentTag.Termine.length - 1
      this.TerminBearbeitenAufrufen()
      this.SaveWoche()
    },

    getDimensions() {
      this.height = document.documentElement.clientHeight
    },
    TerminLöschen() {
      this.TerminOptionen = false
      this.CurrentTag.Termine.splice(this.CurrentTerminID, 1)
      this.SaveWoche()
    },
    check(i) {
      this.CurrentTag.Termine[i].activ
        ? (this.CurrentTag.Termine[i].activ = false)
        : (this.CurrentTag.Termine[i].activ = true)

      this.SaveWoche()
    },

    AsideNav() {
      this.aside ? (this.aside = false) : (this.aside = true)
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
      v-for="Tag in WochenDays"
      @click="GetDay(Tag)">
      <p class="Day">{{ Tag[0] + Tag[1] }}</p>
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
  <div :class="TerminOptionen ? 'TerminOptionen' : 'hidden'">
    <button @click="TerminLöschen()">
      <ion-icon name="trash"></ion-icon>
    </button>
    <button @click="TerminBearbeitenAufrufen()">
      <ion-icon name="pencil"></ion-icon>
    </button>
    <button @click="KopieTermin()">
      <ion-icon name="copy-outline"></ion-icon>
    </button>
  </div>

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
          {{
            Termin.eintrag.StraßenName +
            " Str " +
            Termin.eintrag.StraßenNummer +
            " " +
            Termin.eintrag.Tätichkeit
          }}
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
      <p class="Day">Tag Sotiren</p>
      <button @click="NavigatTermine">
        <ion-icon name="arrow-back-outline"></ion-icon>
      </button>
    </nav>
    <draggable v-model="CurrentTag.Termine">
      <template
        class="Termine"
        v-for="(Termin, i) in CurrentTag.Termine"
        :key="i"
        #item="{ element: Termin }">
        <div class="Termine">
          {{
            Termin.eintrag.StraßenName +
            " Str " +
            Termin.eintrag.StraßenNummer +
            " " +
            Termin.eintrag.Tätichkeit
          }}
        </div>
      </template>
    </draggable>
  </div>

  <!-- Termin Bearbeiten -->

  <div :class="TerminBearbeiten ? 'TerminBearbeiten' : 'hidden'">
    <nav class="NavTerminBearbeiten">
      <p class="Day">Termin Bearbeiten</p>
      <button @click="NavigatTermine">
        <ion-icon name="arrow-back-outline"></ion-icon>
      </button>
    </nav>
    <input
      placeholder="Str Name"
      @input="TerminBearbeitenV"
      style="width: 100%"
      v-model="CurrentTermin.StraßenName"
      class="BearbeitenInput" />
    <input
      placeholder="Str Nr"
      @input="TerminBearbeitenV"
      style="width: 20%"
      v-model="CurrentTermin.StraßenNummer"
      class="BearbeitenInput" />
    <select
      @change="TerminBearbeitenV"
      placeholder="Tätichkeit"
      v-model="CurrentTermin.Tätichkeit"
      style="width: 50%; font-size: 1.5rem">
      <option
        style="display: flex; justify-content: center; align-items: center"
        value=""
        disabled>
        Tätichkeit
      </option>
      <option value="M">M</option>
      <option value="F">F</option>
      <option value="FSS">FSS</option>
      <option value="ABN">ABN</option>
    </select>
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
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  font-size: 16.5px;
  color: #000;
  background: #fff;
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
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.Tage {
  width: 100vw;
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
  width: 100vw;
  background-color: #ffffff;
  border-bottom: solid black 1.5px;
}
aside {
  position: fixed;
  top: 88vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #fff;

  border-top: solid black 1.5px;
  color: #000;
  height: 5%;
  width: 100vw;
  position: fixed;

  z-index: 2;
}
.TerminOptionen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  background-color: #fff;
  position: fixed;
  z-index: 2;
  height: 15%;
  width: 11%;
  border-top: solid black 1.5px;
  border-bottom: solid black 1.5px;
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
  height: 100%;
  font-size: 1.5rem;

  border-left: solid black 0.5px;
  border-right: solid black 0.5px;
}

.Day {
  margin: 0 auto;
}

.ListeTermineRapper {
  width: 100vw;
  height: 100vw;
  position: relative;
}
.ListeTermineNav {
  border-top: 1px solid black;
  display: flex;
  position: fixed;
  top: 93vh;
  left: 0;
  z-index: 0;
}

.ListeTermine {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
}

.Termine {
  font-size: 1rem;
  border: 1.5px solid black;

  display: flex;

  padding: 0.5rem;
  width: 100vw;
}
.TermineC {
  font-size: 1rem;
  border: 1.5px solid black;
  background-color: #d3f9d8;
  display: flex;

  gap: 0.3rem;
  padding: 0.5rem;
  width: 100vw;
}
.ListeTagSotiren {
  width: 100vw;
  height: 100vh;
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
  color: #000;
  align-items: center;
  gap: 1rem;

  height: 100vh;
  width: 100vw;
}
.NavTerminBearbeiten {
  display: flex;
  align-items: center;
}
.BearbeitenInput {
  padding: 0.5rem;
  font-size: 1.5rem;

  height: 2rem;
}

ion-icon {
  font-size: 1rem;
}
</style>
