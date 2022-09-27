const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const articleService = require("./article.service");

// routes
router.post("/addArticle", authorize(), articleSchema, article);
router.get("/all", getAll);
router.get("/latest", authorize(), getLatest);
router.get("/current", authorize(), getCurrent);
router.get("/:slug", authorize(), getBySlug);
router.get("/lists/all", authorize(), getByUser);
router.get("/single/:uuid", authorize(), getByUUID);
router.put("/update/:uuid", authorize(), updateSchema, update);
router.delete("/delete/:uuid", authorize(), _delete);

module.exports = router;

function articleSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    status: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function article(req, res, next) {
  const { title, content, status } = req.body;
  const user = req.user.uuid;
  const username = req.user.name;
  articleService
    .create({ user, username, title, content, status })
    .then(() => res.json({ message: "Article Added successful" }))
    .catch();
}

function getLatest(req, res, next) {
  articleService
    .getLatest()
    .then((articles) => res.json(articles))
    .catch(next);
}

function getAll(req, res, next) {
  articleService
    .getAll()
    .then((articles) => res.json(articles))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.article);
}

function getBySlug(req, res, next) {
  articleService
    .getBySlug(req.params.slug)
    .then((article) => res.json(article))
    .catch(next);
}
function getByUser(req, res, next) {
  articleService
    .getByUser(req.user.uuid)
    .then((articles) => res.json(articles))
    .catch(next);
}

function getByUUID(req, res, next) {
  articleService
    .getByUUID(req.params.uuid, req.user.uuid)
    .then((article) => res.json(article))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    status: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  articleService
    .update(req.params.uuid, req.user.uuid, req.user.name, req.body)
    .then(() => res.json({ message: "Article updated successfully" }))
    .catch(next);
}

function _delete(req, res, next) {
  articleService
    .delete(req.params.uuid, req.user.uuid)
    .then(() => res.json({ message: "Article deleted successfully" }))
    .catch((err) => res.json({ message: "Not allowed" }));
}
