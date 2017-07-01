import $ from 'jquery'


var fetchJSON = function(url) {  
  return new Promise((resolve, reject) => {
    $.getJSON(url)
      .done((json) => resolve(json))
      .fail((xhr, status, err) => reject(status + err.message));
  });
}

var itemUrls = [
    'http://www.filltext.com/?rows=5&fname={firstName}&lname={lastName}&tel={phone|format}&address={streetAddress}&city={city}&state={usState|abbr}&zip={zip}&pretty=true',
    'http://www.filltext.com/?rows=1&id={index}&email={email}&username={username}&password={randomString|5}&pretty=true'
];
var  itemPromises = itemUrls.map(fetchJSON);

Promise.all(itemPromises)
    .then(function (results) {
        // we only get here if ALL promises fulfill
        console.log(results);
        var people = results[0];
        var bestPerson =results[1];
        console.log('people', people);
        console.log('bestPerson', bestPerson);
    })
    .catch(function (err) {
        // Will catch failure of first failed promise
        console.log("Failed:", err);
    });




// function getUserById(userId) {
//   var prm = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         if (!userId) reject('What do you want!');
//         else resolve({ id: 123, name: 'puki', schoolId: 9 });
//     }, 1000)
//   });
//   return prm;
// }

// function getSchoolById(schoolId) {
//   var prm = new Promise((whenResolve, whenReject) => {
//     setTimeout(() => {
//       whenResolve({ id: 9, name: 'Skoola' });
//     }, 1000)
//   });
//   return prm;
// }

// function getUserDetails() {
//   var p = getUser();
//   return p.then(user => {

//     var prmSchool = getSchoolById(user.schoolId)
//     return prmSchool.then(school => {
//       user.school = school;
//       return user;
//     });
//   });

// }

// console.log('Started Calculation');
// var prmUserDetails = getUserDetails();
// prmUserDetails.then(userDetails => {
//   console.log(userDetails);
// });


// function getCards() {
//   var prm = fetch('http://www.clashapi.xyz/api/cards');
//   var prmCardsToReturn = prm.then(res => {
//       console.log(res);
//       var prmCards = res.json();
//       return prmCards;

//   });
//   return prmCardsToReturn
// }

// var prmCards = getCards();
// prmCards.then(console.log)



