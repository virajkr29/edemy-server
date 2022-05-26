import User from '../models/userModel';
//import stripe from 'stripe'
import queryString from 'query-string';
import Course from '../models/courseModel';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

export const makeInstructor = async (req, res) => {
  //Here we are defining the data and give the redirect url as we can see
  try {
    const user = await User.findById(req.user._id).exec();

    //If the user does not have the stripe id then we will have to recreate it
    if (!user.stripe_account_id) {
      //Using express we will create the marketplace
      const account = await stripe.accounts.create({
        type: 'standard',
        email: user.email,
        country: 'IN',
      });
      console.log('ACCOUNT =>', account.id);

      user.stripe_account_id = account.id;
      user.save();
    }

    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: 'account_onboarding',
    });

    accountLink = Object.assign(accountLink, {
      'stripe_user[email]': user.email,
    });

    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (err) {
    console.log('Make instruction Error : ', err);
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();

    const account = await stripe.accounts.retrive(user.stripe_account_id);

    console.log('ACCOUNT=>INFO HERE', account);

    if (!account.charges_enabled) {
      return res.status(401).send('Unauthorized User.Access not Granted');
    } else {
      //Update the stripe seller
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account,
          $addToSet: { role: 'Instructor' },
        },
        { new: true }
      ).exec();

      res.json(statusUpdated);
    }
  } catch (err) {
    console.log(err);
  }
};

export const instructorCourses = async (req, res) => {
  try {
    console.log("CUIRRENT USER =>>",req.user._id)
    let currentUser = req.user._id
    const courses = await Course.find({'instructor._id':currentUser}).sort({ createdAt: -1 }).exec()

    res.json(courses);
  } catch (err) {
    console.log(err);
  }
};

//