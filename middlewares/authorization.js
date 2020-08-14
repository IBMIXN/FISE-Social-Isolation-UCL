function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    req.targets = {};
    req.targets.manager = req.user;
    return next();
  }
  res.redirect("/login");
}

async function checkOtcIsValid(req, res, next) {
  const { otc: rawOtc } = req.body;

  const otc = rawOtc
    .trim()
    .split(/[\s-]+/)
    .join("-"); // in case someone buggered the entry

  const all_managers = await Manager.find({});
  const manager = all_managers.filter((manager) =>
    manager.users.filter((user) => user.otc === otc)
  )[0];
  const user = manager.users.filter((user) => user.otc === otc)[0];

  if (manager && user && user.otcIsValid) {
    req.targets = { manager, user };
    return next();
  }

  res.status(403).send({
    message:
      "Either you don't have access to that app user or it doesn't exist!",
  });
}

async function checkManagerOwnsUser(req, res, next) {
  const { manager } = req.targets;
  const user_id = req.body.user_id ? req.body.user_id : req.params.user_id;

  const user = manager.users.filter((user) => user._id === user_id)[0];

  if (user) {
    req.targets.user = user;
    return next();
  }

  res.status(403).send({
    message: "Either you don't have access to that user or it doesn't exist!",
  });
}

async function checkManagerOwnsContact(req, res, next) {
  const { manager } = req.targets;
  const contact_id = req.body.contact_id
    ? req.body.contact_id
    : req.params.contact_id;

  /*const user = manager.users.filter((user) =>
        user.contacts.filter((contact) => contact._id === contact_id)
    )[0];*/
  const user = manager.users.find((usr) =>
    usr.contacts.includes(usr.contacts.find((cont) => cont._id === contact_id))
  );

  if (user) {
    const contact = user.contacts.filter(
      (contact) => contact._id == contact_id
    )[0];

    if (manager && user && contact) {
      req.targets.user = user;
      req.targets.contact = contact;
      return next();
    }
  }

  res.status(403).send({
    message:
      "Either you don't have access to that contact or it doesn't exist!",
  });
}

module.exports = {
  checkAuthenticated,
  checkOtcIsValid,
  checkManagerOwnsUser,
  checkManagerOwnsContact,
};
