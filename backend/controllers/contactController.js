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
    let contact = new Contact();
    contact.firstName = req.body.firstName ? req.body.firstName : contact.firstName;
    contact.avatarImage = req.body.avatarImage;
    contact.email = req.body.email;
    contact.relation = req.body.relation;

    User.findById(req.params.user_id, function (err, user) {
        if (err) {
            res.json(err);
        }
        if (user != null) {
            user.Contacts.push(contact);
            user.save(function () {
                contact.save(function (err) {
                    if (err) {
                        res.json(err);
                    }
                    res.json({
                        message: 'Contact created and added to ' + user.firstName + '!',
                        data: contact
                    });
                });
            });
        }
        // to check when user is null
        else {
            res.json({message: "ERROR"});
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
            // finds ONE user that has a Contact with `contact_id` in it
            // (TO-DO: might need to change `findOne` later when multiple users have same Contact)
            User.findOne({"Contacts._id": contact._id}, function (err, user) {
                // we need the actual Contact object itself not the whole user
                let contactObject = user.Contacts.find(function (contact2) {
                    return contact2._id = contact._id;
                });

                // need to access the right Contact in the array so that we can update it
                let index = user.Contacts.indexOf(contactObject);

                if (err) {
                    res.json(err);
                } else {
                    user.Contacts[index] = contact;

                    user.save(function (err) {
                        if (err)
                            res.json(err);
                        res.json({
                            message: 'Contact Info updated',
                            data: user
                        });
                    });
                }
            });
        });
    });
};

// DELETE - delete specific contact by `contact_id`
exports.delete = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        User.findOne({"Contacts._id": contact._id}, function (err, user) {
            // First, remove Contact from User's "Contacts" array
            user.Contacts.remove(contact);
            user.save(function () {
                // Secondly, remove Contact from actual Contact schema
                Contact.deleteOne({
                    _id: req.params.contact_id
                }, function (err) {
                    if (err)
                        res.send(err);
                    res.json({
                        status: "success",
                        message: 'Contact deleted',
                        data: user
                    });
                });
            });
        });
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
