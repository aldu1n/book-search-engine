const { User } = require('../models'); 
const { signToken, AuthenticationError } = require('../utils/auth'); 


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');

        return userData;
      }

      throw AuthenticationError();
    },
  },
  Mutation: {
    // Login mutation. Uses tokens.
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError();
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError();
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      console.log(user);
      const token = signToken(user);
      console.log(token,user,'added');
      return { token, user };
    },
    saveBook: async (parent, { input }, context) => {
      console.log({...input});
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { ...input } } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }

      throw AuthenticationError();
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      throw AuthenticationError();
    },
  },
};

module.exports = resolvers;