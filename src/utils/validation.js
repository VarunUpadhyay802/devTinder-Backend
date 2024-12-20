const validator = require("validator");

const validateSignUpData = (req) => {
    //extracted things which you want from body
  const { firstName, lastName, emailId, password } = req.body;
  

    //applying checks through validator
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } 
  else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } 
  // else if (!validator.isStrongPassword(password)) {
  //   throw new Error("Please enter a strong Password!");
  // }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
  
    // "photoUrl",
    "firstName",
    "lastName",
    "gender",
    "age",
    "about",
    "skills",
  ];
//we are checking that each field which is coming from the req should be presnt in the allowedEditFields
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};