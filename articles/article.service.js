const config = require("config.json");
const jwt = require("jsonwebtoken");
const db = require("_helpers/db");
const urlSlug = require("url-slug");
const uniqid = require("uniqid");

module.exports = {
  getAll,
  getLatest,
  getBySlug,
  getByUser,
  getByUUID,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.Article.findAll({
    where: { status: "published" },
    order: [["id", "DESC"]],
  });
}

async function getLatest() {
  return await db.Article.findAll({ order: [["id", "DESC"]] });
}

async function getBySlug(slug) {
  return await getArticle(slug);
}
async function getByUser(user) {
  return await db.Article.findAll({ where: { user }, order: [["id", "DESC"]] });
}
async function getByUUID(uuid, user) {
  const article = await db.Article.findOne({ where: { user, uuid } });
  if (!article) throw "Article not found";
  return article;
}

async function create(params) {
  // save Article
  const { title, content, status, user, username } = params;
  const slugedUrl = urlSlug(title);
  await db.Article.create({
    title,
    content,
    slug: slugedUrl + uniqid(),
    user,
    username,
    status,
  });
}

async function update(uuid, user, username, params) {
  const { title, content, status } = params;
  const slugedUrl = urlSlug(title);
  const Article = await await db.Article.findOne({ where: { uuid, user } });

  // copy params to Article and save
  Object.assign(Article, {
    title,
    content,
    slug: slugedUrl + uniqid(),
    username,
    status,
  });
  await Article.save();

  return Article.get();
}

async function _delete(uuid, user) {
  const Article = await db.Article.findOne({ where: { uuid, user } });
  await Article.destroy();
}

// helper functions

async function getArticle(slug) {
  const Article = await db.Article.findOne({ where: { slug } });
  if (!Article) throw "Article not found";
  return Article;
}
