const os = require('os');
const fs = require('fs');

console.log('Platform: ', os.platform());
console.log('Arch: ', os.arch());
console.log('User: ', os.userInfo());

let genders = ["Male", "Female"];

let maleNames = ["James", "Oliver", "Liam", "Noah", "Ethan", "Lucas", "Mason", "Logan", "Aiden", "Sebastian"];

let femaleNames = ["Emma", "Olivia", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn"];

let lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Wilson"];
const people = [];

function randChoice(arr){
    return arr[Math.floor(Math.random() * arr.length)];
};

function generatePhone() {
    let phone = '+48';
    for (let i = 0; i < 9; i++) {
        phone += Math.floor(Math.random() * 10);
    }
    return phone;
}

for(let i = 0; i < 20; i++){
    let object = {}
    object.gender = randChoice(genders);
    if(object.gender === 'Male'){ object.name = randChoice(maleNames);}
    else if (object.gender === 'Female'){ object.name = randChoice(femaleNames);}
    object.lastNames = randChoice(lastNames);
    object.age = Math.floor(Math.random() * 60) + 18;
    object.phone = generatePhone();
    object.email = `${object.name.toLowerCase()}.${object.lastNames.toLowerCase()}@gmail.com`;
    people.push(object);
    
}

const data = JSON.stringify(people);

fs.writeFile('people.json', data, (err) => {
  if (err) console.log('Something went wrong',err);
  console.log('File has been successfully generated! Check people.json');
});