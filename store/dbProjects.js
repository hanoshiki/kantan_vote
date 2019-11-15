import firebase from '~/plugins/firebase.js'

const db = firebase.firestore()

export const actions = {
  // データの取得
  getProjects: (context) => {
    return db.collection('projects').get()
  },
  // プロジェクト追加
  addProject: (context, content) => {
    console.log(content)
  },
  // 票数追加
  addVote: (context, content) => {
    console.log(content)
  }
}
