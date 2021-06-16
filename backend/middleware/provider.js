const Role = require("../models/role");

const provider = async (req, res, next) => {
  const role = await Role.findById(req.user.roleId);
  if (!role) {
    return res.status(400).send("Error: the role does not exist");
  }

  if (role.name === "provider") {
    next();
  } else {
    return res.status(401).send("The user does not have authorization");
  }
};

module.exports = provider;