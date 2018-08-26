
const Password = (password) => {

if(!password){
      let array = ['~', '!', '@','#', '$', '%', '^', '&', '*', '_', '-', '+', '=', '`', '|', '\\', '(', ')', '{', '}', '[', ']', '.', '?'];
      let rand = Math.floor(Math.random() * array.length);
      return "Tk12t95" + array[rand];
}

let length = password.trim().length;

  if(length >= 6 && length <= 8){
    if(new RegExp('[a-z]').test(password)){
      if(new RegExp('[A-Z]').test(password)){
        if((new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\\#$^+=!*\[\]()@%&-]).{6,8}$/).test(password))){
          //'[~!@#$%^&*+=`\|\\(){}[]\.?_-]'
          return password;
        }
      }
    }
  }
  return null;
}

const Mobile = (mobile) => {
  if(mobile && mobile.length === 12){
    if(new RegExp(/^(\+)(94)(\d){9}$/).test(mobile)){
      return mobile;
    }
  }
  return null;
};

const Role = (role) => {
  if(role === 'user' || role === 'moderator' || role === 'admin'){
    return role;
  }
  return null;
}

module.exports = {
  Password,
  Mobile,
  Role
};
