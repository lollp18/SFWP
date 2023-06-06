<script>
export default {
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
        ["Mitwoch", []],
        ["Donerstag", []],
        ["Freitag", []],
        ["Samstag", []],
      ]),
      currentTermin: undefined,
      CurrentTag: { Day: "Sonntag", Termine: ["f", "f", "f", "f"] },

      TerminBearbeitenValue: undefined,
      WochenTage: true,
      Terminliste: false,
      TerminBearbeiten: false,
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

      this.CurrentTag = {
        Day: Tag,
        Termine: this.Tage.get(Tag),
      }
    },
    SavDay() {
      this.Tage.set(this.CurrentTag.Day, this.CurrentTag.Termine)
    },
    TerminBearbeitenAufrufen(i) {
      this.currentTermin = i
      this.WochenTage = false
      this.Terminliste = false
      this.TerminBearbeiten = true

      this.TerminBearbeitenValue = this.CurrentTag.Termine[i].eintag
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
      this.Terminliste = true
      this.TerminBearbeiten = false
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
    TerminLöschhen(i) {
      this.CurrentTag.Termine.splice(i, 1)
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
  },
}
</script>

<template>
  <div :class="WochenTage ? 'ListeTage' : 'hidden'">
    <div
      class="Tage"
      v-for="Tag in WochenDays"
      @click="GetDay(Tag)">
      {{ Tag }}
    </div>
  </div>

  <div :class="Terminliste ? 'ListeTermineRapper' : 'hidden'">
    <nav class="ListeTermineNav">
      <button @click="NavigatWoche">
        <ion-icon name="list-outline"></ion-icon>
      </button>
      <p class="Day">{{ CurrentTag.Day }}</p>
      <button @click="AddTermin">
        <ion-icon name="add-outline"></ion-icon>
      </button>
    </nav>

    <div :class="Terminliste ? 'ListeTermine' : 'hidden'">
      <div
        class="Termine"
        v-for="(Termin, i) in CurrentTag.Termine"
        :key="i">
        <p class="ItemText">{{ Termin.eintag }}</p>
        <div class="ItemBTNS">
          <button
            @click="TerminLöschhen(i)"
            class="BTNlöschen">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="uncheck">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            class="BTNlöschen"
            @click="TerminBearbeitenAufrufen(i)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="{1.5}"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>

          <button
            @click="check(i)"
            class="BTNlöschen">
            <svg
              v-if="Termin.activ"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="{1.5}"
              stroke="currentColor"
              class="Ckeckt">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="{1.5}"
              stroke="currentColor"
              class="uncheck">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div :class="TerminBearbeiten ? 'TerminBearbeiten' : 'hidden'">
    <nav>
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
  width: 100vw;
  height: 100vh;
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
  height: 100%;
  width: 100%;
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
  height: 25%;
  font-size: 25px;
  border-bottom: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}
nav {
  display: flex;
  padding: 1rem;
  align-items: center;
  font-size: 2rem;
  width: 100%;
  background-color: #ffffff;
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
  position: fixed;
  top: 0;
  left: 0;
}
.ListeTermine {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-top: 6rem;

  width: 100%;
}

.Termine {
  font-size: 20px;
  border: 2px solid black;
  border-radius: 9px;
  display: flex;

  gap: 0.3rem;
  padding: 1rem;
  width: 100%;
}
.ItemText {
  width: 80%;
  text-align: left;
}
.ItemBTNS {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-left: auto;
}
.hidden {
  display: none;
}

button {
  width: 2.5rem;
  height: 2.5rem;
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
.BearbeitenInput {
  padding: 0.5rem;
  font-size: 25px;
  height: 3rem;
  margin: 50% auto 0 auto;
}

.Ckeckt {
  color: green;
}
.uncheck {
  color: red;
}

ion-icon {
  font-size: 50px;
}
</style>
