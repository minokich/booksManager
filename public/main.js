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
   //編集用の書籍名/著者
   pushVal.newTitle = pushVal.bookInfo.title;
   pushVal.newAuthor = pushVal.bookInfo.author;
   //モーダル表示フラグ
   pushVal.modelViewFlag = false;
   //レンタル状況
   pushVal.isRentaled = (pushVal.rentalUserNo == '' ? false : true)
   obj.books.push(pushVal);
   obj.books.sort();
});
//更新時
books.on("child_changed", function(data) {
   for(i = 0;i < obj.books.length;i++){
      //修正可能項目が追加されるたびに追記する必要あり
      if(obj.books[i]["key"] === data.key){
         updateVal = data.toJSON();
         //書籍名/著者
         obj.books[i].bookInfo.title = updateVal.bookInfo.title;
         obj.books[i].bookInfo.author = updateVal.bookInfo.author;
         //編集用の書籍名/著者
         bj.books[i].newTitle = updateVal.bookInfo.title;
         obj.books[i].newAuthor = updateVal.bookInfo.author;
         //レンタル状況
         obj.books[i].isRentaled = (updateVal.rentalUserNo == '' ? false : true)
         break;
      }
   }
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
