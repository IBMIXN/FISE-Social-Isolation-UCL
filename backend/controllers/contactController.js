// contactController.js
var nodemailer = require('nodemailer');


// Import CONTACT + USER models
Contact = require('../models/contactModel');
User = require('../models/userModel');


// GET - get all contact
exports.index = function (req, res) {
    Contact.get(function (err, contacts) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Contacts retrieved successfully",
            data: contacts
        });
    });
};

// POST - create new contact
exports.new = function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err) {
            res.json(err);
        }
        // FIRST check if User exists
        if (user) {
            // SECOND, check if Contact exists in Contact model/schema
            let contact;
            Contact.findById(req.body._id, function (err, cont) {
                if (!cont) {
                    contact = new Contact();
                    contact.firstName = req.body.firstName ? req.body.firstName : contact.firstName;
                    contact.avatarImage = req.body.avatarImage;
                    contact.email = req.body.email;
                    contact.relation = req.body.relation;

                    contact.save(function (err) {
                        if (err) {
                            res.json(err);
                        }
                    });
                } else {
                    contact = cont;
                }

                // THIRDLY, if User already contains Contact with same id then don't add a new one
                if (!user.Contacts.find(cont => cont._id === contact._id)) {
                    user.Contacts.push(contact);
                    user.save(function () {
                        if (err) {
                            res.json(err);
                        }
                        res.json({
                            message: 'Contact added to ' + user.firstName + '!',
                            data: contact
                        });
                    });
                } else {
                    res.json({message: user.firstName + " already has " + contact.firstName + " in their Contacts!"});
                }
            });
        }
        // to check when user is null
        else {
            res.json({message: "ERROR: User does not exist!"});
        }
    });
};

// GET - get specific contact by `contact_id`
exports.view = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err)
            res.send(err);
        res.json({
            message: 'Contact details loading..',
            data: contact
        });
    });
};

// PUT/PATCH - update specific contact by `contact_id`
exports.update = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        contact.firstName = req.body.firstName ? req.body.firstName : contact.firstName;
        contact.avatarImage = req.body.avatarImage ? req.body.avatarImage : contact.avatarImage;
        contact.email = req.body.email ? req.body.email : contact.email;
        contact.relation = req.body.relation ? req.body.relation : contact.relation;

        // save the contact in DB and check for errors
        contact.save(function () {
            User.find({"Contacts._id": contact._id}, function (err, users) {
                if (err) {
                    res.json(err);
                } else {
                    users.forEach(user => {
                        // need index so that we change the correct User in the array
                        let index = user.Contacts.findIndex(contact2 => contact2._id === contact._id);

                        user.Contacts[index] = contact;

                        user.save(function (err) {
                            if (err)
                                res.json(err);
                        });
                    });
                    res.json({
                        message: 'Contact Info updated',
                        data: users
                    });
                }
            });
        });
    });
};

// DELETE - delete specific contact by `contact_id`
exports.delete = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (contact) {
            User.findById(req.params.user_id, function (err, user) {
                if (user && (user.Contacts.find(cont => cont._id === contact._id))) {
                    // First, remove Contact from User's "Contacts" array
                    user.Contacts.remove(contact);

                    user.save(function (err) {
                        if (err) {
                            res.json(err);
                        }
                        // Delete contact from Contacts when no User is using that Contact
                        User.find({"Contacts._id": contact._id}, function (err, users) {
                            if (!users.length) {
                                // Secondly, remove Contact from actual Contact schema
                                Contact.deleteOne({
                                    _id: req.params.contact_id
                                }, function (err) {
                                    if (err)
                                        res.send(err);
                                    res.json({
                                        status: "success",
                                        message: 'Contact deleted from ' + user.firstName + ' and DB.',
                                        data: user
                                    });
                                });
                            } else {
                                res.json('Contact removed from ' + user.firstName + ".");
                            }
                        });
                    });
                } else {
                    res.json("ERROR: User does not exist or does not have " + contact.firstName + " as a Contact.");
                }
            });


        } else {
            res.json({
                message: "ERROR: Contact does not exist! Perhaps you entered a User ID?"
            });
        }
    });
};


// POST - Invite contact to call
exports.invite = function (req, res) {
    let name = req.params.contact_name;
    Contact.findOne({firstName: name}, function (err, contact) {
        if (err) {
            res.json(err);
        } else {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "TYPE EMAIL IN HERE", // Using `process.env.USER` doesn't work (not sure why)
                    pass: process.env.PASS
                }
            });

            let mailOptions = {
                from: 'TYPE EMAIL IN HERE',
                to: contact.email,

                subject: "Click here to talk to " + req.body.name,
                text: 'Hello ' + contact.firstName + '! Here\'s your link for your FISE Plaza call with '
                    + req.body.name + ':\n' + req.body.link
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.json(error);
                } else {
                    res.json({
                        message: 'Email sent: ' + info.response,
                        data: contact
                    });
                }
            });
        }
    });
}
