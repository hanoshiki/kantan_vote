import firebase from '~/plugins/firebase.js'

const db = firebase.firestore()

export const actions = {
  // データの取得
  getProjects: (context) => {
    db.collection('projects').onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        // 追加
        if (change.type === 'added') {
          console.log('added', change.doc.id, change.doc.data())
          return { id: change.doc.id, data: change.doc.data() }
        }
        // 更新
        else if (change.type === 'modified') {
          console.log('modified', change.doc.id, change.doc.data())
        }
        // 削除
        else if (change.type === 'removed') {
          console.log('removed', change.doc.id)
        }
      })
    })
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
