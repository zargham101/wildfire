const validate = (schema) => {
  return (req, res, next) => {

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "All fields are empty" });
    }

    const allEmpty = Object.values(req.body).every(
      (val) => val === undefined || val === null || (typeof val === "string" && val.trim() === "")
    );

    if (allEmpty) {
      return res.status(400).json({ message: "All fields are empty" });
    }
      const { error } = schema.validate(req.body);
      if (error) {
          return res.status(400).json({ message: error.details[0].message });
      }
      next();
  };
};

module.exports = validate;
