import userModel from "../models/user";
import videoModel from "../models/video";
import Mongoose from "mongoose";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) =>
  res.render("creatAccount", { pagetitle: "Create Account" });

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
export const getLogin = (req, res) => {
  res.render("login", { pagetitle: "Login" });
};

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
    code: req.query.code, // url code
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
      req.flash("error", "Not authorized");
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

export const getEdit = (req, res) =>
  res.render("edit-profile", { pagetitle: "Edit profile" });
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    file,
    body: { name, username, location, email },
  } = req;
  const exists = await userModel.exists({ $and: [{ username }, { email }] });
  if (exists) {
    return res.render("edit-profile", {
      pagetitle: "Edit profile",
      errorMessage: "username and email you writed aready existing",
    });
  }
  const updatedUser = await userModel.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      username,
      location,
      email,
    },
    {
      new: true,
    }
  );
  req.session.user = updatedUser;
  res.locals.loggedInUser = updatedUser;
  console.log(req.session);
  return res.render("edit-profile", { pagetitle: "Edit profile" });
};
export const getChangePassword = (req, res) =>
  res.render("change-password", { pagetitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  if (newPassword !== newPassword1) {
    res.status(400).render("change-password", {
      pagetitle: "Change Password",
      errorMessage: "password confirm falsed",
    });
  }
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    res.status(400).render("change-password", {
      pagetitle: "Change Password",
      errorMessage: "existing password incorrect",
    });
  }
  const user = await userModel.findById(_id);
  user.password = newPassword;
  req.session.user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};

export const myProfile = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "userModel",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pagetitle: "User is not found" });
  }
  res.render("myProfile", { pagetitle: `${user.username}`, user });
};

export const deleteProfile = (req, res) => res.send("Remove User");
