import userModel from "../models/user";
import Mongoose from "mongoose";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) =>
  res.render("creatAccount", { pagetitle: "JOIN" });
export const postJoin = async (req, res) => {
  const { email, username, name, password, password2, location } = req.body;
  if (password !== password2) {
    return res.status(400).render("creatAccount", {
      pagetitle: "JOIN",
      errorMessage: "password dosn't match",
    });
  }
  const exists = await userModel.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("creatAccount", {
      pagetitle: "JOIN",
      errorMessage: "This username/email is aready taken",
    });
  }
  try {
    await userModel.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    res.status(404).render("creatAccount", {
      pagetitle: "JOIN",
      errorMessage: "DB isn't working",
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pagetitle: "Login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username, socialOnly: false });
  if (!user) {
    return res
      .status(404)
      .render("login", { errorMessage: "username dosn't match" });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res
      .status(404)
      .render("login", { errorMessage: "password dosn't match" });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const githubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  res.redirect(finalUrl);
};

export const githubLoginFinish = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(emailData);
    const emailObg = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObg) {
      // will set notify
      return res.redirect("/login");
    }
    let user = await userModel.findOne({ email: emailObg.email });
    if (!user) {
      user = await userModel.create({
        name: userData.name,
        email: emailObg.email,
        username: userData.login,
        password: "",
        socialOnly: true,
        avartaUrl: userData.avatar_url,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const deleteProfile = (req, res) => res.send("Remove User");
export const edit = (req, res) => res.send("Edit User");
export const myProfile = (req, res) => res.send("Its my profile");
