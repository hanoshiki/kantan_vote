<template>
  <v-container fluid>
    <doughnut-chart :chart-data="chartData" :options="chartOptions" />
    <v-list subheader two-line flat>
      <v-subheader>よかったアイデアを選んでください</v-subheader>

      <v-list-item-group>
        <template v-for="(item, index) in projectLabels">
          <v-list-item :key="item" @click="selectRow(index)">
            <v-list-item-action>
              <v-icon v-if="index != selected" color="grey lighten-1">
                mdi-star-circle-outline
              </v-icon>
              <v-icon v-else color="orange">
                mdi-star-circle
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider
            v-if="index + 1 < projectLabels.length"
            :key="index"
          ></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script>
import colors from 'vuetify/es5/util/colors'
import firebase from '~/plugins/firebase.js'

const db = firebase.firestore()

export default {
  components: {},
  data() {
    return {
      projectIds: [],
      projectVotes: [],
      projectLabels: [],
      chartColors: [
        colors.red.lighten1,
        colors.blue.lighten1,
        colors.yellow.lighten1,
        colors.green.lighten1
      ],
      chartOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic'
        }
      },
      selected: -1
    }
  },
  mounted() {
    setTimeout(() => {}, 0)
  },
  created() {
    db.collection('projects').onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        // 追加
        if (change.type === 'added') {
          console.log('added', change.doc.id, change.doc.data())
          this.projectIds.push(change.doc.id)
          this.projectLabels.push(change.doc.data().project_name)
          this.projectVotes.push(change.doc.data().vote)
        }
        // 更新
        else if (change.type === 'modified') {
          console.log('modified', change.doc.id, change.doc.data())
          const idx = this.projectIds.indexOf(change.doc.id)
          this.projectVotes[idx] = change.doc.data().vote
          this.updateData()
          console.log(this.projectVotes)
        }
        // 削除
        else if (change.type === 'removed') {
          console.log('removed', change.doc.id)
        }
      })
    })
  },
  computed: {
    chartData() {
      return {
        datasets: [
          {
            data: this.projectVotes,
            backgroundColor: this.chartColors
          }
        ],
        labels: this.projectLabels
      }
    }
  },
  methods: {
    addVote(idx) {
      this.$store
        .dispatch('dbProjects/addVote', {
          id: this.projectIds[idx],
          vote: this.projectVotes[idx] + 1
        })
        .then((result) => {
          console.log(result)
        })
    },
    updateData() {
      const data = []
      for (let i = 0; i < this.projectLabels.length; i++) {
        data.push(this.projectVotes[i])
      }
      this.projectVotes = data
    },
    selectRow(index) {
      console.log('click', index)
      if (this.selected === index) {
        this.selected = -1
      } else {
        this.selected = index
        this.addVote(index)
      }
    }
  }
}
</script>
