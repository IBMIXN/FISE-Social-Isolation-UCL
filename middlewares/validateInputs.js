const firstNameRule = /^[a-z]+$/i;

const emailRule = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const urlRule = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

module.exports = function validateInputs(req, res, next) {
  // First Name
  if (req.body.firstName) {
    var firstName = req.body.firstName.trim();
    if (!firstNameRule.test(firstName))
      return next(Error("Invalid First Name"));

    req.body.firstName = firstName;
  }

  if (req.body.email) {
    var email = req.body.email.trim();
    if (!emailRule.test(email)) return next(Error("Invalid Email Address"));
    req.body.email = email;
  }

  if (req.body.imageVideoUrl) {
    if (Array.isArray(req.body.imageVideoUrl)) {
      for (var i = 0; i < req.body.imageVideoUrl.length; i++) {
        req.body.imageVideoUrl[i] = req.body.imageVideoUrl[i].trim();
        if (req.body.imageVideoUrl[i] && !urlRule.test(req.body.imageVideoUrl[i]))
          return next(Error("Invalid URL for imageVideoUrl"));
      }
    } else {
      const url = req.body.imageVideoUrl.trim();
      if (!urlRule.test(req.body.imageVideoUrl))
        return next(Error("Invalid URL for imageVideoUrl"));
      else req.body.imageVideoUrl = [url];
    }
  }

  if (req.body.avatarImage) {
    var imageVideoUrl = req.body.imageVideoUrl.trim();
    if (!urlRule.test(imageVideoUrl))
      return next(Error("Invalid URL for imageVideoUrl"));
    req.body.imageVideoUrl = imageVideoUrl;
  }

  return next();
};
