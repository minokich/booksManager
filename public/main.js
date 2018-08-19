Vue.component('modal', {
   template: '#modal-template'
})

var db = firebase.database();
var books = db.ref("/books/");
var obj = {"books":[]};

//初期表示&データ追加時
books.on("child_added", function(data) {
   pushVal = data.toJSON();
   pushVal.key = data.key;//key追加

   pushVal.newTitle = pushVal.bookInfo.title;
   pushVal.newAuthor = pushVal.bookInfo.author;
   pushVal.modelViewFlag = false;

   obj.books.push(pushVal);
   obj.books.sort();
});
//更新時
books.on("child_changed", function(data) {
   for(i = 0;i < obj.books.length;i++){
      if(obj.books[i]["key"] === data.key){
         console.log(i + ":"+ obj.books[i]["key"]);
         updateVal = data.toJSON();
         //修正可能項目が追加されるたびに追記する必要あり
         obj.books[i].bookInfo.title = updateVal.bookInfo.title;
         obj.books[i].newTitle = updateVal.bookInfo.title;
         obj.books[i].bookInfo.author = updateVal.bookInfo.author;
         obj.books[i].newAuthor = updateVal.bookInfo.author;
         break;
      }
   }
   //obj.books.sort();//再描画のためにsortを呼び出す
});

//削除時
books.on("child_removed", function(data) {
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
      books: obj.books
   },
   methods:{
      update: function(book){
         db.ref("/books/" + book.key+"/bookInfo")
         .update({title: book.newTitle})
         console.log("更新");
      },
      removeRecode: function(index,isbn,key2){
         if(window.confirm('「'+isbn+'」のレコードを削除します。')){
            db.ref("/books/" + key2)
            .remove()
            .then(function(index) {
               books = [];
               alert("削除しました");
            }).catch(function(error) {
               console.log("削除に失敗しました: " + error.message)
            });
         }
      },
      modalOpen: function(book){
         book.modelViewFlag = true;
      },
      modalClose: function(book){
         book.modelViewFlag = false;
      }
   }
});
