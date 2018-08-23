Vue.component('modal', {
   template: '#modal-template'
})
var selfUpdate = false;
var db = firebase.database();
var books = db.ref("/books/");
var obj = {"books":[]};
var thisUserEdit = false
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
   //サムネがNULLならstorageのリンクを入れる
   if(!pushVal.bookInfo.cover)pushVal.bookInfo.cover = 'https://firebasestorage.googleapis.com/v0/b/fir-test-f97de.appspot.com/o/img%2Fnoimage.jpg?alt=media&token=cc89d222-729b-4b4a-8d9c-ddc107963e8c'

   obj.books.push(pushVal);

   //更新されるとソートさせる
   //CSSでソートとかさせるなら消したほうが良いかも
   obj.books.sort();
});
//更新時
books.on("child_changed", function(data) {
   for(i = 0;i < obj.books.length;i++){
      if(obj.books[i]["key"] === data.key){
         if(obj.books[i].modelViewFlag && !selfUpdate)alert('別のユーザによって更新が行われました。')
         selfUpdate = false;
         //dataを置換
         obj.books[i].bookInfo = data.toJSON().bookInfo;
         //以下bookInfoに含まれないパラメータ
         //key追加
         obj.books[i].key = data.key
         //編集用の書籍名/著者
         obj.books[i].newTitle = obj.books[i].bookInfo.title;
         obj.books[i].newAuthor = obj.books[i].bookInfo.author;
         obj.books[i].rentalUserNo = data.toJSON().rentalUserNo
         //レンタル状況
         obj.books[i].isRentaled = (obj.books[i].rentalUserNo == '' ? false : true)
         //coverUrl
         if(!obj.books[i].bookInfo.cover)obj.books[i].bookInfo.cover = 'https://firebasestorage.googleapis.com/v0/b/fir-test-f97de.appspot.com/o/img%2Fnoimage.jpg?alt=media&token=cc89d222-729b-4b4a-8d9c-ddc107963e8c'
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
         selfUpdate = true;
         db.ref("/books/" + book.key+"/")
         .update({
            'bookInfo/title' : book.newTitle ,
            'bookInfo/author': book.newAuthor,
            'rentalUserNo':book.rentalUserNo
         });
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
