Vue.component('modal', {
  template: '#modal-template'
})

var db = firebase.database();
var myBooks = db.ref("/my/books/");
var obj = {"books":[]};

//初期表示&データ追加時
myBooks.on("child_added", function(data) {
  pushVal = data.toJSON();
  pushVal.key = data.key;//key追加

  obj.books.push(pushVal);
  obj.books.sort();
});
//更新時
myBooks.on("child_changed", function(data) {
  for(i = 0;i < obj.books.length;i++){
    if(obj.books[i]["ISBN13"] === data.val().ISBN13){
      //console.log("一致しました。");
      pushVal = data.toJSON();
      pushVal.key = data.key;//key追加

      obj.books[i] = pushVal
      break;
    }
  }
  obj.books.sort();//再描画のためにsortを呼び出す
});

//削除時
myBooks.on("child_removed", function(data) {
  for(i = 0;i < obj.books.length;i++){
    console.log(data.key);
    if(data.key === obj.books[i].key){
      console.log('削除時');
      obj.books.splice(i,1)
    }
  }
  obj.books.sort();
});


//list出力
var listVue = new Vue({
  el: '#list',
  data: {
    books: obj.books,
    showModal: false
  },
  methods:{
    update: function(key,newTitle){
      console.log(key + ':' + newTitle);
      db.ref("/my/books/" + key)
      .update({title: newTitle})
      console.log("更新");
    },

    removeRecode: function(index,isbn13,key2){
      if(window.confirm('「'+isbn13+'」のレコードを削除します。')){
        db.ref("/my/books/" + key2)
        .remove()
        .then(function(index) {
          books = [];
          alert("削除しました");
        }).catch(function(error) {
          console.log("削除に失敗しました: " + error.message)
        });
      }
    }
  }
});
