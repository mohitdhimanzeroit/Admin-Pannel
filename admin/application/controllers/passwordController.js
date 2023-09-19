const forgetpasswordView = (req, res) => {
    res.render("forgetpassword", {});
  };

  const resetpasswordView = (req, res) => {
    res.render("resetpassword", {});
  };
  module.exports = {
    forgetpasswordView,
    resetpasswordView
  };