import Post from '../models/PostModel.js';
import User from '../models/UserModel.js';

/* CREATE */

export const createPost = async (req, res, next) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: []
    });
    await newPost.save();

    const post = await Post.find();

    res.status(201).json(
      post.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();

    res.status(200).json(
      post.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* UPDATE like*/
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// COMMENT POST

export const commentPost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const comments = {
      username: req.body.userName,
      comment: req.body.comment
    };

    await Post.updateOne(
      { _id: postId },
      {
        $push: {
          comments
        }
      }
    );

    const newCommentPost = await Post.findById(postId);

    res.status(200).json({ message: 'Posts', success: true, newCommentPost });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//Get Post for  delete
export const getPostForDelete = async (req, res) => {
  try {
    let posts = await Post.find();

    const formattedPosts = posts.map(({ _id, userId }) => {
      return { _id, userId };
    });
    res.status(200).json({ message: 'Posts', success: true, formattedPosts });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'error while fetching posts',
      success: false
    });
  }
};

//Delete Post

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    console.log(postId, 'PostId');

    let deletePost = await Post.deleteOne({ _id: postId });
    if (deletePost) {
      let posts = await Post.find();

      const newposts = posts.map(({ _id }) => {
        return { _id };
      });
      res.status(200).json({ newposts, message: 'Post deleted', success: true });
    } else {
      console.log('error');
    }
  } catch (error) {
    res.status(500).json('delete error' + error.message);
  }
};
