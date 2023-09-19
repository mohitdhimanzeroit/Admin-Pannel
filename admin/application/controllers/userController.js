const createuserView = (req, res) => {
    res.render("createuser", {});
  };

  const userslistView = (req, res) => {
    res.render("userslist", {});
  };
  module.exports = {
    createuserView,
    userslistView
  };