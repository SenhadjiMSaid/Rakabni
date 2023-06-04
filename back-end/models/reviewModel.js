const mongoose = require("mongoose");
const User = require("./userModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review ne peu pas etre vide"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    conducteur: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review doit avoir un Conducteur"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review doit avoir un user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 1user can do 1 review in eatch user
reviewSchema.index({ conducteur: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //this.populate({
  //pour que dans un user le array des review on a que l'id du conducteur mais pour user name photo .....
  //path: "conducteur",
  //select: "name photo",
  //})
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (conducteurId) {
  const stats = await this.aggregate([
    // to have moyenne exp 4?5 etoiles
    {
      $match: { conducteur: conducteurId }, //select the user we want to update
    },
    {
      $group: {
        _id: "$conducteur",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(conducteurId, {
      // if we have an review
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await User.findByIdAndUpdate(conducteurId, {
      // if we havent we set it to sefault
      ratingsQuantity: 0,
      ratingsAverage: 1,
    });
  }
};

reviewSchema.post("save", function (next) {
  // to call calcAverage ratings eatch time we have new review
  //this points to current review

  this.constructor.calcAverageRatings(this.conducteur); //
});
//findByIdAndUpdate
//findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.conducteur);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
