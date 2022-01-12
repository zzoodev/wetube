import userModel from "../models/user";
import Mongoose from "mongoose";
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
  const user = await userModel.findOne({ username });
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
  console.log("user logined!!");
  return res.redirect("/");
};
export const logout = (req, res) => res.send("Logout Page");
export const deleteProfile = (req, res) => res.send("Remove User");
export const edit = (req, res) => res.send("Edit User");
export const myProfile = (req, res) => res.send("Its my profile");
