// contactController.js
var nodemailer = require('nodemailer');


// Import contact model
Contact = require('../models/contactModel');
// Handle index actions
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
// Handle create contact actions
exports.new = function (req, res) {
    var contact = new Contact();
    contact.firstName = req.body.firstName ? req.body.firstName : contact.firstName;
    contact.avatarImage = req.body.avatarImage;
    contact.email = req.body.email;
    contact.relation = req.body.relation;
// save the contact and check for errors
    contact.save(function (err) {
        if (err)
            res.json(err);
        res.json({
            message: 'New contact created!',
            data: contact
        });
    });
};
// Handle view contact info
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
// Handle update contact info
exports.update = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err)
            res.send(err);
        contact.firstName = req.body.firstName ? req.body.firstName : contact.firstName;
        contact.avatarImage = req.body.avatarImage;
        contact.email = req.body.email;
        contact.relation = req.body.relation;
// save the contact and check for errors
        contact.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Contact Info updated',
                data: contact
            });
        });
    });
};
// Handle delete contact
exports.delete = function (req, res) {
    Contact.remove({
        _id: req.params.contact_id
    }, function (err, contact) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'Contact deleted'
        });
    });
};


// Invite contact to call
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
