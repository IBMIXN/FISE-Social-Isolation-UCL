// contactController.js
const sgMail = require("@sendgrid/mail");

// Import MANAGER, USER & CONTACT models
Manager = require("../models/managerModel");
User = require("../models/userModel");
Contact = require("../models/contactModel");

/* HELPER Functions */
function updateContact(req, contact) {
  let newContact = new Contact();
  newContact.firstName = req.body.firstName
    ? req.body.firstName
    : contact.firstName;
  newContact.avatarImage = req.body.avatarImage
    ? req.body.avatarImage
    : contact.avatarImage;
  newContact.email = req.body.email ? req.body.email : contact.email;
  newContact.relation = req.body.relation
    ? req.body.relation
    : contact.relation;
  newContact.owner = contact.owner;
  return newContact;
}

/* CRUD Functions */

// Add Contact to User
exports.new = (req, res, next) => {
  let manager = req.user;
  let { user_id } = req.params;
  // 2. Get User query object AND Contact query object
  User.findById(user_id, function (err, user) {
    if (err) return next(err);
    // 5. Contact ALREADY in DB?
    Contact.findOne(
      {
        email: req.body.email,
      },
      function (err, cont) {
        if (err) return next(err);
        if (cont)
          return res.status(403).send({ message: "Contact Already exists" });
        // 6. Create NEW Contact
        let contact = new Contact();
        contact.firstName = req.body.firstName;
        contact.avatarImage = req.body.avatarImage;
        contact.email = req.body.email;
        contact.relation = req.body.relation;
        contact.owner = user_id;

        // 7. Contact in User's `Contacts` array? Pretty sure we don't need
        if (!user.Contacts.find((cont) => cont._id === contact._id)) {
          // 8. Save CONTACT
          contact.save(function (err) {
            if (err) return next(err);
            // 9. Update USER
            user.Contacts.push(contact);

            // 10. Save USER
            user.save((err) => {
              if (err) return next(err);
              // 11. Update MANAGER
              let index = manager.Users.findIndex(
                (usr) => usr._id === user._id
              );
              manager.Users[index] = user;

              // 12. Save MANAGER
              manager.save((err) => {
                if (err) return next(err);
                res.json({
                  status: "success",
                  message: "Contact created successfully!",
                  data: manager,
                });
              });
            });
          });
        } else {
          res.json({
            message:
              "ERROR: " +
              user.firstName +
              " already has " +
              contact.email +
              " in their Contacts!",
          });
        }
      }
    );
  });
};

// Get Contact
exports.view = (req, res, next) => {
  Contact.findById(req.params.contact_id, (err, contact) => {
    if (err) return next(err);
    res.json({
      message: "Contact details were found!",
      data: contact,
    });
  });
};

// Update User's Contact
exports.update = (req, res, next) => {
  const manager = req.user;
  const { contact_id } = req.params;

  User.findById(req.params.user_id, (err, user) => {
    if (err) return next(err);
    Contact.findById(req.params.contact_id, (err, contact) => {
      if (err) return next(err);
      /* 4. User, Contact exist? */
      if (user && contact) {
        /* 5. Manager contains User with Contact? */
        let userInManager = manager.Users.find((usr) => usr._id === user._id);
        if (userInManager) {
          /* 6. create new UPDATED Contact */
          let newContact = updateContact(req, contact);

          /* 7. newContact already in DB? */
          Contact.findOne(
            {
              email: req.body.email,
            },
            (err, existingContact) => {
              if (err) return next(err);
              if (existingContact)
                return res
                  .status(400)
                  .send({ message: "Email already exists" });

              let index = userInManager.Contacts.findIndex(
                (cont) => cont._id === contact._id
              );
              userInManager.Contacts[index] = newContact;
              user.Contacts[index] = newContact;

              /* 9. Save MANAGER */

              newContact.save(function (err) {
                if (err) return next(err);
                user.save(function (err) {
                  if (err) return next(err);
                  // User.find({ "Contacts._id": contact._id }, (err, users) => {
                  //   if (err) return next(err);
                  //   if (!users.length) {
                  //     Contact.deleteOne(contact, (err) => {
                  //       if (err) return next(err);
                  //     });
                  //   }
                  // }); Don't think the above is necessary
                  manager.save(function (err) {
                    if (err) return next(err);
                    res.json({
                      status: "success",
                      message: "Contact info updated successfully!",
                      data: manager,
                    });
                  });
                });
              });
            }
          );
        }
      }
    });
  });
};

// Delete User's Contacct
exports.delete = (req, res, next) => {
  let manager = req.user;
  let { contact_id } = req.params;

  Contact.findOne({ _id: contact_id }, (err, contact) => {
    if (err) return next(err);
    User.findOne({ _id: contact.owner }, (err, user) => {
      if (err) return next(err);
      let userInManager = manager.Users.find((usr) => usr._id === user._id);
      userInManager.Contacts.remove(contact);
      user.Contacts.remove(contact);

      manager.save((err) => {
        if (err) return next(err);
        user.save((err) => {
          if (err) return next(err);
          Contact.deleteOne(contact, (err) => {
            if (err) return next(err);
            res.json({
              status: "success",
              message: "Contact deleted successfully!",
              data: manager,
            });
          });
        });
      });
    });
  });
};

// Call User's Contact
exports.invite = (req, res, next) => {
  const { contact_id } = req.params;
  const { otc, callLink } = req.body;

  User.findOne({ otc: otc }, (err, user) => {
    if (err) return next(err);
    const { firstName: userName } = user;

    Contact.findById(contact_id, function (err, contact) {
      if (err) return next(err);

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: contact.email,
        from: process.env.SENDGRID_EMAIL_ADDRESS,
        subject: `Click here to talk to ${userName}`,
        text: `Hello ${contact.firstName}, copy and paste the following link into your web browser. ${callLink}`,
        html: `<p>Hello ${contact.firstName},<br/>${userName} would like to call you.<br />To enter the call, click <a href="${callLink}">here</a>.</p>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          res.status(200).json({
            message: "Email sent: ",
            data: contact,
          });
        })
        .catch((err) => next(err));
    });
  });
};
