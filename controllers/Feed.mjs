const getPosts = (req, res, next) => {
  res
    .status(200)
    .json({ posts: [{ title: "Posts", content: "Hello, World!" }] });
};

const createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Success to created post",
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content,
    },
  });
};

export { getPosts, createPost };
