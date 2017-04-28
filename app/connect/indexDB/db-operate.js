//
//
// import localforage from "localforage";
//
// // let dbOperate = {
// //     initDB(dbName,version) {
// //         localforage.config({
// //             driver      : localforage.INDEXEDDB,
// //             name        : dbName,
// //             version     : version || 1.0,
// //             storeName   : ["test","test2"]
// //         });
// //     },
// //     init
// // };
//
// class DBOperate {
//     constructor(options = {}) {
//         if (typeof indexedDB === "undefined") {
//             throw new Error("indexedDB is unsupported!");
//         }
//         if (typeof options.name === "undefined") {
//             throw new Error("database name is need");
//         }
//         this.name = options.name;
//         this.version = options.version || 1;
//         this.onUpgrade = options.onUpgrade || this.upgrade;
//         this.storeList = options.storeList || [];
//         this.instance = {};
//     }
//     errorHandler(err) {
//         console.log(err);
//         return;
//     };
//     initDB() {
//         let request=window.indexedDB.open(this.name,this.version);
//         let that = this;
//
//         request.onerror=function(e){
//             console.log(e.currentTarget.error.message);
//         };
//         request.onsuccess=function(e){
//             that.instance = e.target.result;
//             if(that.storeList.length){
//                 that.storeList.forEach(function (v) {
//                     that.addStore(v);
//                 });
//             }
//         };
//         request.onupgradeneeded=function(e){
//             that.upgrade(e.target.result);
//         };
//     };
//     openDB() {
//         let that = this;
//         if (!this.opened) {
//             this.opened = new Promise((resolve, reject) => {
//                 let request = indexedDB.open(this.name, this.version);
//
//                 request.onerror = event => {
//                     delete this.opened;
//                     reject(event.currentTarget.error);
//                 };
//
//                 request.onsuccess = event => {
//                     this.instance = event.target.result;
//                     resolve(this.instance);
//                 };
//
//                 request.onupgradeneeded = event => {
//                     this.instance = event.target.result;
//                     that.upgrade(this.instance);
//                 }
//
//             })
//         }
//         return this.opened;
//     };
//     addStore(storeName) {
//         this.openDB().then(function (db,option = {}) {
//             if(!db.objectStoreNames.contains(storeName)) {
//                 db.createObjectStore(storeName,option);
//             }
//         });
//     };
//     getStore(){};
//     clearStore(){};
//     clearAll(){};
//     setIem() {};
//     removeItem() {};
//     closeDB() {
//         return this.db && this.db.close();
//     };
//     upgrade(instance) {
//         return new Promise((resolve) => {
//             resolve(this.version,instance);
//         });
//     }
//
// }
//
// export default DBOperate;
