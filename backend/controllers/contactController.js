// contactController.js
const nodemailer = require('nodemailer');

// Import MANAGER, USER & CONTACT models
Manager = require('../models/managerModel');
User = require('../models/userModel');
Contact = require('../models/contactModel');


/* HELPER Functions */
function updateContact(req, contact) {
    let newContact = new Contact();
    newContact.firstName = req.body.firstName ? req.body.firstName : contact.firstName;
    newContact.avatarImage = req.body.avatarImage ? req.body.avatarImage : contact.avatarImage;
    newContact.email = req.body.email ? req.body.email : contact.email;
    newContact.relation = req.body.relation ? req.body.relation : contact.relation;
    return newContact;
}


/* CRUD Functions */

// GET - get all Contacts of the logged-in Manager
exports.index = function (req, res) {
    let manager = req.user;
    if (manager) {
        Manager.findById(req.user._id, function (err, manager) {
            if (err) res.send(err);

            else {
                let contacts = [];
                manager.Users.forEach(usr => {
                    usr.Contacts.forEach(cont => {
                        contacts.push(cont);
                    });
                });

                res.json({
                    status: "success",
                    message: "Contacts retrieved successfully",
                    data: contacts
                });
            }
        });
    } else {
        res.redirect('/login');
    }
};

// POST - create new Contact for specific User (using `user_id`) of the logged-in Manager
exports.new = function (req, res) {
    /* 1. Manager logged in? */
    let manager = req.user;
    if (manager) {

        /* 2. Get User query object AND Contact query object */
        User.findById(req.params.user_id, function (err, user) {
            if (err) res.send(err);
            else {

                /* 3. User, Contact exist? */
                if (user) {

                    /* 4. Manager contains User with Contact? */
                    let userInManager = manager.Users.find(usr => usr._id === user._id);
                    if (userInManager) {
                        /*--------------------------------------MAIN CODE------------------------------------*/
                        /* 5. Contact ALREADY in DB? */
                        Contact.findOne({
                            email: req.body.email
                        }, function (err, cont) {
                            if (err) res.send(err);
                            else {
                                if (!cont) {

                                    /* 6. Create NEW Contact */
                                    let contact = new Contact();
                                    contact.firstName = req.body.firstName;
                                    contact.avatarImage = req.body.avatarImage;
                                    contact.email = req.body.email;
                                    contact.relation = req.body.relation;

                                    /* 7. Contact in User's `Contacts` array? */
                                    if (!user.Contacts.find(cont => cont._id === contact._id)) {

                                        /* 8. Save CONTACT */
                                        contact.save(function (err) {
                                            if (err) res.send(err);
                                            else {

                                                /* 9. Update USER */
                                                user.Contacts.push(contact);

                                                /* 10. Save USER */
                                                user.save(function (err) {
                                                    if (err) res.send(err);
                                                    else {

                                                        /* 11. Update MANAGER */
                                                        let index = manager.Users.findIndex(usr => usr._id === user._id);
                                                        manager.Users[index] = user;

                                                        /* 12. Save MANAGER */
                                                        manager.save(function (err) {
                                                            if (err) res.send(err);
                                                            else {
                                                                res.json({
                                                                    status: 'success',
                                                                    message: 'Contact created successfully!',
                                                                    data: manager
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        res.json({message: "ERROR: " + user.firstName + " already has " + contact.email + " in their Contacts!"});
                                    }
                                } else {
                                    res.json("ERROR: Contact already exists!");
                                }
                            }
                        });
                    } else {
                        res.json("ERROR: You do not have access to that User!")
                    }
                } else {
                    res.json("ERROR: User or Contact does not exist!");
                }
            }

        });
    } else {
        res.redirect('/login');
    }
};

// GET - get logged-in Manager's specific User's (using `user_id`) specific Contact (using `contact_id`)
exports.view = function (req, res) {
    /* 1. is contact_id provided? */
    if (req.params.contact_id) {

        /* 2. Manager logged in? */
        let manager = req.user;
        if (manager) {

            /* 3. Get User query object AND Contact query object */
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);
                else {
                    Contact.findById(req.params.contact_id, function (err, contact) {
                        if (err) res.send(err);
                        else {

                            /* 4. User, Contact exist? */
                            if (user && contact) {

                                /* 5. Manager contains User with Contact? */
                                let userInManager = manager.Users.find(usr => usr._id === user._id);
                                if (userInManager) {
                                    let contactInManager = userInManager.Contacts.find(cont => cont._id === contact._id);
                                    if (contactInManager) {

                                        /*--------------------------------------MAIN CODE------------------------------------*/
                                        /* 6. Show Contacts */
                                        res.json({
                                            message: 'Contact details loading..',
                                            data: contact
                                        });
                                    } else {
                                        res.json("ERROR: You do not have access to that Contact!");
                                    }
                                } else {
                                    res.json("ERROR: You do not have access to that User!")
                                }
                            } else {
                                res.json("ERROR: User or Contact does not exist!");
                            }
                        }
                    });
                }
            });
        } else {
            res.redirect('/login');
        }
    } else {
        res.json("ERROR: You have to provide a `contact_id`!");
    }
};


// PUT/PATCH - update logged-in Manager's specific User's (using `user_id`) specific Contact (using `contact_id`)
exports.update = function (req, res) {
    /* 1. is contact_id provided? */
    if (req.params.contact_id) {

        /* 2. Manager logged in? */
        let manager = req.user;
        if (manager) {

            /* 3. Get User query object AND Contact query object */
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);
                else {
                    Contact.findById(req.params.contact_id, function (err, contact) {
                        if (err) res.send(err);
                        else {

                            /* 4. User, Contact exist? */
                            if (user && contact) {

                                /* 5. Manager contains User with Contact? */
                                let userInManager = manager.Users.find(usr => usr._id === user._id);
                                if (userInManager) {
                                    let contactInManager = userInManager.Contacts.find(cont => cont._id === contact._id);
                                    if (contactInManager) {

                                        /*--------------------------------------MAIN CODE------------------------------------*/
                                        /* 6. create new UPDATED Contact */
                                        let newContact = updateContact(req, contact);

                                        /* 7. newContact already in DB? */
                                        Contact.findOne({
                                            email: req.body.email
                                        }, function (err, cont) {
                                            if (err) res.send(err);
                                            else {

                                                /* 8. UPDATE Contact to Manager and to User */
                                                if (!cont) {
                                                    let index = userInManager.Contacts.findIndex(cont => cont._id === contact._id);
                                                    userInManager.Contacts[index] = newContact;
                                                    user.Contacts[index] = newContact;

                                                    /* 9. Save MANAGER */
                                                    manager.save(function (err) {
                                                        if (err) res.send(err);
                                                    });

                                                    /* 10. Save USER */
                                                    user.save(function (err) {
                                                        if (err) res.send(err);
                                                        else {

                                                            /* 11. Delete Contact from DB if no other User of this Manager contains Contact */
                                                            User.find({"Contacts._id": contact._id}, function (err, users) {
                                                                if (err) res.send(err);
                                                                else {
                                                                    if (!users.length) {
                                                                        Contact.deleteOne(contact, function (err) {
                                                                            if (err) res.send(err);
                                                                        });
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });

                                                    /* 12. Save CONTACT */
                                                    newContact.save(function (err) {
                                                        if (err) res.send(err);
                                                    });

                                                    res.json({
                                                        status: "success",
                                                        message: "Contact info updated successfully!",
                                                        data: manager
                                                    });
                                                } else {
                                                    res.json("ERROR: Email already taken!");
                                                }
                                            }
                                        });
                                    } else {
                                        res.json("ERROR: You do not have access to that Contact!");
                                    }
                                } else {
                                    res.json("ERROR: You do not have access to that User!")
                                }
                            } else {
                                res.json("ERROR: User or Contact does not exist!");
                            }
                        }
                    });
                }
            });
        } else {
            res.redirect('/login');
        }
    } else {
        res.json("ERROR: You have to provide a `contact_id`!");
    }
};


// DELETE - delete logged-in Manager's specific User's (using `user_id`) specific Contact (using `contact_id`)
exports.delete = function (req, res) {
    /* 1. is contact_id provided? */
    if (req.params.contact_id) {

        /* 2. Manager logged in? */
        let manager = req.user;
        if (manager) {

            /* 3. Get User query object AND Contact query object */
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);
                else {
                    Contact.findById(req.params.contact_id, function (err, contact) {
                        if (err) res.send(err);
                        else {

                            /* 4. User, Contact exist? */
                            if (user && contact) {

                                /* 5. Manager contains User with Contact? */
                                let userInManager = manager.Users.find(usr => usr._id === user._id);
                                if (userInManager) {
                                    let contactInManager = userInManager.Contacts.find(cont => cont._id === contact._id);
                                    if (contactInManager) {

                                        /*--------------------------------------MAIN CODE------------------------------------*/
                                        /* 6. DELETE Contact from Manager and from User */
                                        userInManager.Contacts.remove(contact);
                                        user.Contacts.remove(contact);

                                        /* 7. Save MANAGER */
                                        manager.save(function (err) {
                                            if (err) res.send(err);
                                        });

                                        /* 8. Save USER */
                                        user.save(function (err) {
                                            if (err) res.send(err);
                                            else {

                                                /* 9. Delete Contact from DB if no other User of this Manager contains Contact */
                                                User.find({"Contacts._id": contact._id}, function (err, users) {
                                                    if (err) res.send(err);
                                                    else {
                                                        if (!users.length) {
                                                            Contact.deleteOne(contact, function (err) {
                                                                if (err) res.send(err);
                                                            });
                                                        }
                                                    }
                                                });

                                                res.json({
                                                    status: "success",
                                                    message: "Contact deleted successfully!",
                                                    data: manager
                                                });
                                            }
                                        });
                                    } else {
                                        res.json("ERROR: You do not have access to that Contact!");
                                    }
                                } else {
                                    res.json("ERROR: You do not have access to that User!")
                                }
                            } else {
                                res.json("ERROR: User or Contact does not exist!");
                            }
                        }
                    });
                }
            });
        } else {
            res.redirect('/login');
        }
    } else {
        res.json("ERROR: You have to provide a `contact_id`!");
    }
};


// POST - Invite logged-in Manager's specific User's () specific Contact () to call
exports.invite = function (req, res) {
    /* 1. is contact_id provided? */
    if (req.params.contact_id) {

        /* 2. Manager logged in? */
        let manager = req.user;
        if (manager) {

            /* 3. Get User query object AND Contact query object */
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);
                else {
                    Contact.findById(req.params.contact_id, function (err, contact) {
                        if (err) res.send(err);
                        else {

                            /* 4. User, Contact exist? */
                            if (user && contact) {

                                /* 5. Manager contains User with Contact? */
                                let userInManager = manager.Users.find(usr => usr._id === user._id);
                                if (userInManager) {
                                    let contactInManager = userInManager.Contacts.find(cont => cont._id === contact._id);
                                    if (contactInManager) {

                                        /*--------------------------------------MAIN CODE------------------------------------*/
                                        /* 6. CALL Contact */
                                        let transporter = nodemailer.createTransport({
                                            service: 'gmail',
                                            auth: {
                                                user: "almazovemil@gmail.com", // Using `process.env.USER` doesn't work (not sure why)
                                                pass: process.env.PASS
                                            }
                                        });

                                        let mailOptions = {
                                            // from: 'TYPE EMAIL IN HERE',
                                            from: "almazovemil@gmail.com",
                                            to: contact.email,

                                            subject: "Click here to talk to " + req.body.name,
                                            text: 'Hello ' + contact.firstName + '! Here\'s your link for your FISE Plaza call with '
                                                + req.body.name + ':\n' + req.body.link
                                        };

                                        transporter.sendMail(mailOptions, function (error, info) {
                                            if (error) res.json(error);
                                            else {
                                                res.json({
                                                    message: 'Email sent: ' + info.response,
                                                    data: contact
                                                });
                                            }
                                        });
                                    } else {
                                        res.json("ERROR: You do not have access to that Contact!");
                                    }
                                } else {
                                    res.json("ERROR: You do not have access to that User!")
                                }
                            } else {
                                res.json("ERROR: User or Contact does not exist!");
                            }
                        }
                    });
                }
            });
        } else {
            res.redirect('/login');
        }
    } else {
        res.json("ERROR: You have to provide a `contact_id`!");
    }
}

