const { validationResult } = require('express-validator');


module.exports = {
  handleErrors(template, dataCb) {
    return  (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {

        console.log(errors);
        // let data = {};
        // if (dataCb) {
        //   data = await dataCb(req);
        // }
        req.flash('error', errors.array());
       return  res.render(template, {errors: req.flash('error')});
        // console.log(errors.array);
        
        // return res.render(template, { errors });
        // , ...data
      }

      next();
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/signin');
    }

    next();
  }
};