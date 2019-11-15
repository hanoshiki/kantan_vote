<template>
  <v-container fluid>
    <doughnut-chart :chart-data="chartData" :options="chartOptions" />
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
      chartDataValues: [],
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
      }
    }
  },
  mounted() {
    setTimeout(() => {
      // this.getProjects()
    }, 0)
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
    getProjects() {
      this.$store.dispatch('dbProjects/getProjects').then((result) => {
        console.log(result)
        const records = result.docs.map((elem) => elem.data())
        console.log(records)
        this.projectVotes = records.map(function(element, index, array) {
          return element.vote
        })
        this.projectLabels = records.map(function(element, index, array) {
          return element.project_name
        })
      })
    },
    updateData() {
      const data = []
      for (let i = 0; i < this.projectLabels.length; i++) {
        data.push(this.projectVotes[i])
      }
      this.projectVotes = data
    }
  }
}
</script>
