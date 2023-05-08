// const obj = {
//     name: 'Alice',
//     greetNormal: function() {
//       console.log('Hello, my name is ' + this.name);
//     },
//     greetArrow: function() {
//       const greet = function() {
//         console.log('Hello, my name is ' + this.name);
//       }.bind(this);
//       greet();
//     }
//   };

//   obj.greetNormal(); // Output: Hello, my name is Alice
//   obj.greetArrow();
//---------------------------------------------------------------------------------------------------------------
// let obj = function () {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("Resolved");
//     }, 2000);
//   });
// };

// let obj1 = function () {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve("Rejected");
//       }, 1000);
//     });
//   };
// Promise.all([obj(),obj1()]).then(([data1,data2])=>{
// console.log(data1,data2)
// }).catch((data)=>
// {
//     console.log(data)
// })
//----------------------------------------------------------------------

// function Demo(n)
// {
//     return new Promise((resolve,reject)=>{
//        setTimeout(()=>{
//         resolve(n*2)
//        },1000)
//     })
// }

// Demo(10).then((data)=>{
//     console.log(data);
//     return Demo(data);
// }).then((data)=>{
//     console.log(data);
//     return Demo(data);
// }).then((data)=>{
//     console.log(data);
// })

//--------------------------------------------------------------------------------------------------

// function Demo(n)
// {
//     return new Promise((resolve,reject)=>{
//        setTimeout(()=>{
//         resolve(n*2)
//        },1000)
//     })
// }
// async function Any(n)
// {
//    let x1=await Demo(n);
//    console.log(x1)
//    let x2=await Demo(x1);
//    console.log(x2)
//    let x3=await Demo(x2);
//    return x3;
// }
// Any(10).then((data)=>{
//     console.log(data)
// })

//--------------------------------------------------------------------------------------------------------------

// let obj={
//     name:"surya",
//     age:22,
//     details:function(loc,cou)
//     {
//         return this.name+" "+this.age+" "+loc+" "+cou;
//     }
// }
// let obj2={
//     name:"teja",
//     age:20
// }
// let x=obj.details.bind(obj2,null)
// console.log(x("year"))

// function Demo(n)
// {
//     return new Promise((resolve,reject)=>{
//        setTimeout(()=>{
//         resolve(n*2)
//        },1000)
//     })
// }

// function y()
// {
//    Demo(10),(err,data)=>{
//        console.log(data) 
//     }
// }
// y()

// let x=2;
// let obj={
//     x:3,
//     y:function()
//     {
//         return x;
//     }
// }
// let y=obj.y;
// console.log(y())
// console.log(obj.x)

// Movie.aggregate([
   
//     { $group: { _id: "$title",
//       avgRating:{$avg:'$rating',
//        }} },
//        {
//         $sort:{avgRating:-1}
//        },{
//         $limit:1
//        }


//   ])

// let a=[3,2,5,1,6];
// for(let i of a)
// {
//     console.log(i)
// }


let obj={
    "name": "John Doe",
    "age": 30,
    "email": "johndoe@example.com",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345"
    },
    "phone_numbers": [
      {
        "type": "home",
        "number": "555-1234"
      },
      {
        "type": "work",
        "number": "555-5678"
      }
    ],
    "friends": [
      {
        "name": "Jane Smith",
        "age": 28
      },
      {
        "name": "Bob Johnson",
        "age": 32
      }
    ]
  }
  for(let x in obj)
  {
   if(typeof obj[x]==='string')
   {
    console.log(obj[x])
   }
   if(typeof obj[x]==='number')
   {
    console.log(obj[x])
   }
   if(typeof obj[x]==='object')
   {
     Object.entries(obj[x]).map(([key,value])=>{
        console.log(key,value)
     })
   }
   if(typeof obj[x]==='array')
   {
    console.log(obj[x])
   }
  }


  