// ** CONTACT ROUTES **
const sgMail = require("@sendgrid/mail");

const relationMappings = {
    mother: 0,
    father: 1,
    grandmother: 2,
    grandfather: 3,
    aunt: 4,
    uncle: 5,
    sister: 6,
    brother: 7,
    daughter: 8,
    son: 9,
    granddaughter: 10,
    grandson: 11,
};

// Get Contact
exports.view = (req, res, next) => {
    const {user, contact} = req.targets;
    res.redirect('/dashboard/' + user._id + "/" + contact._id);
    /*res.json({
        message: "Contact details were found!",
        data: contact,
    });*/
};

// Add Contact to User
exports.new = (req, res, next) => {
    const {manager, user} = req.targets;
    const {firstName, avatarImage, email, relation} = req.body;

    const newContact = {
        firstName,
        avatarImage,
        email,
        relation: relationMappings[relation.toLowerCase()],
    };

    user.contacts.push(newContact);

    manager.save((err) => {
        if (err) return next(err);
        res.redirect('/dashboard/' + user._id);
        /*res.json({
            message: "New contact created and linked successfully!",
            data: manager,
        });*/
    });
};

// Update User's Contact
exports.update = (req, res, next) => {
    const {manager, user, contact} = req.targets;
    const {firstName, avatarImage, email, relation} = req.body;

    contact.firstName = firstName ? firstName : contact.firstName;
    contact.avatarImage = avatarImage ? avatarImage : contact.avatarImage;
    contact.email = email ? email : contact.email;
    contact.relation = relation ? relationMappings[relation.toLowerCase()] : contact.relation;

    contact.markModified("relation");
    manager.save((err) => {
        if (err) return next(err);
        res.redirect('/dashboard/' + user._id + "/" + contact._id);
        /*res.json({
            message: "Contact updated successfully!",
            data: manager,
        });*/
    });
};

// Delete User's Contact
exports.delete = (req, res, next) => {
    const {manager, contact} = req.targets;

    const user = manager.users.find(usr => usr.contacts.includes(usr.contacts.find(cont => cont._id === contact._id)));
    const targetIndex = user.contacts.indexOf(contact);
    user.contacts.splice(targetIndex);

    manager.save((err) => {
        if (err) return next(err);
        res.redirect('/dashboard/' + user._id);
        /*res.json({
            message: "Contact deleted successfully!",
            data: manager,
        });*/
    });
};

// Call User's Contact
exports.invite = async (req, res, next) => {
    const {user} = req.targets;
    const {contact_id} = req.params;
    const {callLink} = req.body;

    const contact = user.contacts.filter(
        (contact) => contact._id == contact_id
    )[0];

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: contact.email,
        from: process.env.SENDGRID_EMAIL_ADDRESS,
        subject: `Click here to talk to ${user.firstName}`,
        text: `Hello ${contact.firstName}, copy and paste the following link into your web browser. ${callLink}`,
        html: `<p>Hello ${contact.firstName},<br/>${user.firstName} would like to call you.<br />To enter the call, click <a href="${callLink}">here</a>.</p>`,
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
};
